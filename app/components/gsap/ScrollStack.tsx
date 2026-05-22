"use client";
import React, { useLayoutEffect, useRef, useCallback } from "react";
import type { ReactNode } from "react";

export interface ScrollStackItemProps {
	itemClassName?: string;
	children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
	children,
	itemClassName = "",
}) => (
	<div
		className={`scroll-stack-card relative w-full h-80 my-8 p-12 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.1)] box-border origin-top will-change-transform ${itemClassName}`.trim()}
		style={{
			backfaceVisibility: "hidden",
			transformStyle: "preserve-3d",
		}}>
		{children}
	</div>
);

interface ScrollStackProps {
	className?: string;
	innerClassName?: string;
	bottomPadding?: string;
	children: ReactNode;
	itemDistance?: number;
	itemScale?: number;
	itemStackDistance?: number;
	stackPosition?: string;
	scaleEndPosition?: string;
	baseScale?: number;
	scaleDuration?: number;
	rotationAmount?: number;
	blurAmount?: number;
	useWindowScroll?: boolean;
	onStackComplete?: () => void;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
	children,
	className = "",
	innerClassName,
	bottomPadding = "pb-200",
	itemDistance = 100,
	itemScale = 0.03,
	itemStackDistance = 30,
	stackPosition = "20%",
	scaleEndPosition = "10%",
	baseScale = 0.85,
	scaleDuration = 0.5,
	rotationAmount = 0,
	blurAmount = 0,
	useWindowScroll = false,
	onStackComplete,
}) => {
	const scrollerRef = useRef<HTMLDivElement>(null);
	const stackCompletedRef = useRef(false);
	const animationFrameRef = useRef<number | null>(null);
	const cardsRef = useRef<HTMLElement[]>([]);
	const lastTransformsRef = useRef(new Map<number, any>());
	const cardTopsRef = useRef<number[]>([]);
	const endElementTopRef = useRef<number>(0);

	const calculateProgress = useCallback(
		(scrollTop: number, start: number, end: number) => {
			if (scrollTop < start) return 0;
			if (scrollTop > end) return 1;
			return (scrollTop - start) / (end - start);
		},
		[],
	);

	const parsePercentage = useCallback(
		(value: string | number, containerHeight: number) => {
			if (typeof value === "string" && value.includes("%")) {
				return (parseFloat(value) / 100) * containerHeight;
			}
			return parseFloat(value as string);
		},
		[],
	);

	const getScrollData = useCallback(() => {
		if (useWindowScroll) {
			return {
				scrollTop: window.scrollY,
				containerHeight: window.innerHeight,
				scrollContainer: document.documentElement,
			};
		} else {
			const scroller = scrollerRef.current;
			return {
				scrollTop: scroller ? scroller.scrollTop : 0,
				containerHeight: scroller ? scroller.clientHeight : 0,
				scrollContainer: scroller,
			};
		}
	}, [useWindowScroll]);

	const getElementOffset = useCallback(
		(element: HTMLElement) => {
			if (useWindowScroll) {
				// Walk the offsetParent chain — unlike getBoundingClientRect(),
				// offsetTop is a layout value and is NOT affected by CSS transforms.
				// Using getBoundingClientRect() here creates a feedback loop:
				// transform → reported top changes → new transform calculated → vibration.
				let top = 0;
				let el: HTMLElement | null = element;
				while (el) {
					top += el.offsetTop;
					el = el.offsetParent as HTMLElement | null;
				}
				return top;
			} else {
				return element.offsetTop;
			}
		},
		[useWindowScroll],
	);

	const computeLayout = useCallback(() => {
		cardTopsRef.current = cardsRef.current.map((card) =>
			getElementOffset(card),
		);
		const endElement = useWindowScroll
			? (document.querySelector(".scroll-stack-end") as HTMLElement | null)
			: (scrollerRef.current?.querySelector(
					".scroll-stack-end",
				) as HTMLElement | null);
		endElementTopRef.current = endElement ? getElementOffset(endElement) : 0;
	}, [getElementOffset, useWindowScroll]);

	const updateCardTransforms = useCallback(() => {
		if (!cardsRef.current.length) return;

		const { scrollTop, containerHeight } = getScrollData();
		const stackPositionPx = parsePercentage(stackPosition, containerHeight);
		const scaleEndPositionPx = parsePercentage(
			scaleEndPosition,
			containerHeight,
		);

		const endElementTop = endElementTopRef.current;

		cardsRef.current.forEach((card, i) => {
			if (!card) return;

			const cardTop = cardTopsRef.current[i] ?? 0;
			const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
			const triggerEnd = cardTop - scaleEndPositionPx;
			const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
			const pinEnd = endElementTop - containerHeight / 2;

			const scaleProgress = calculateProgress(
				scrollTop,
				triggerStart,
				triggerEnd,
			);
			const targetScale = baseScale + i * itemScale;
			const scale = 1 - scaleProgress * (1 - targetScale);
			const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

			let blur = 0;
			if (blurAmount) {
				let topCardIndex = 0;
				for (let j = 0; j < cardsRef.current.length; j++) {
					const jCardTop = cardTopsRef.current[j] ?? 0;
					const jTriggerStart =
						jCardTop - stackPositionPx - itemStackDistance * j;
					if (scrollTop >= jTriggerStart) {
						topCardIndex = j;
					}
				}

				if (i < topCardIndex) {
					const depthInStack = topCardIndex - i;
					blur = Math.max(0, depthInStack * blurAmount);
				}
			}

			let translateY = 0;
			const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

			if (isPinned) {
				translateY =
					scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
			} else if (scrollTop > pinEnd) {
				translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
			}

			const newTransform = {
				translateY: Math.round(translateY * 100) / 100,
				scale: Math.round(scale * 1000) / 1000,
				rotation: Math.round(rotation * 100) / 100,
				blur: Math.round(blur * 100) / 100,
			};

			const lastTransform = lastTransformsRef.current.get(i);
			const hasChanged =
				!lastTransform ||
				Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
				Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
				Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
				Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

			if (hasChanged) {
				const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
				const filter =
					newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : "";

				card.style.transform = transform;
				card.style.filter = filter;

				lastTransformsRef.current.set(i, newTransform);
			}

			if (i === cardsRef.current.length - 1) {
				const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
				if (isInView && !stackCompletedRef.current) {
					stackCompletedRef.current = true;
					onStackComplete?.();
				} else if (!isInView && stackCompletedRef.current) {
					stackCompletedRef.current = false;
				}
			}
		});
	}, [
		itemScale,
		itemStackDistance,
		stackPosition,
		scaleEndPosition,
		baseScale,
		rotationAmount,
		blurAmount,
		useWindowScroll,
		onStackComplete,
		calculateProgress,
		parsePercentage,
		getScrollData,
	]);

	const setupScrollListener = useCallback(() => {
		const handleScroll = () => {
			if (animationFrameRef.current) return;
			animationFrameRef.current = requestAnimationFrame(() => {
				animationFrameRef.current = null;
				updateCardTransforms();
			});
		};

		if (useWindowScroll) {
			window.addEventListener("scroll", handleScroll, { passive: true });
			return () => window.removeEventListener("scroll", handleScroll);
		} else {
			const scroller = scrollerRef.current;
			if (!scroller) return;
			scroller.addEventListener("scroll", handleScroll, { passive: true });
			return () => scroller.removeEventListener("scroll", handleScroll);
		}
	}, [updateCardTransforms, useWindowScroll]);

	useLayoutEffect(() => {
		if (!useWindowScroll && !scrollerRef.current) return;

		const cards = Array.from(
			useWindowScroll
				? document.querySelectorAll(".scroll-stack-card")
				: (scrollerRef.current?.querySelectorAll(".scroll-stack-card") ?? []),
		) as HTMLElement[];
		cardsRef.current = cards;
		const transformsCache = lastTransformsRef.current;

		cards.forEach((card, i) => {
			if (i < cards.length - 1) {
				card.style.marginBottom = `${itemDistance}px`;
			}
			card.style.willChange = "transform, filter";
			card.style.transformOrigin = "top center";
			card.style.backfaceVisibility = "hidden";
			card.style.transform = "translateZ(0)";
			card.style.webkitTransform = "translateZ(0)";
			card.style.perspective = "1000px";
			card.style.webkitPerspective = "1000px";
		});

		computeLayout();

		const removeScrollListener = setupScrollListener();

		updateCardTransforms();

		const resizeObserver = new ResizeObserver(() => {
			computeLayout();
			updateCardTransforms();
		});
		resizeObserver.observe(document.documentElement);

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
			removeScrollListener?.();
			resizeObserver.disconnect();
			stackCompletedRef.current = false;
			cardsRef.current = [];
			transformsCache.clear();
		};
	}, [
		itemDistance,
		itemScale,
		itemStackDistance,
		stackPosition,
		scaleEndPosition,
		baseScale,
		scaleDuration,
		rotationAmount,
		blurAmount,
		useWindowScroll,
		onStackComplete,
		computeLayout,
		setupScrollListener,
		updateCardTransforms,
	]);

	return (
		<div
			className={`relative w-full ${useWindowScroll ? "overflow-visible" : "h-full overflow-y-auto overflow-x-visible"} ${className}`.trim()}
			ref={scrollerRef}
			style={
				useWindowScroll
					? undefined
					: {
							overscrollBehavior: "contain",
							WebkitOverflowScrolling: "touch",
						}
			}>
			<div
				className={`scroll-stack-inner pt-8 min-h-screen ${bottomPadding} ${innerClassName ?? "px-20"}`}>
				{children}
				{/* Spacer so the last pin can release cleanly */}
				<div className="scroll-stack-end w-full h-px" />
			</div>
		</div>
	);
};

export default ScrollStack;
