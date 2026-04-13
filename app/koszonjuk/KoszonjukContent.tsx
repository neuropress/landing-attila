"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";

const headingWords = ["Köszönjük", "az", "üzeneted!"];

export default function KoszonjukContent() {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

			// Pulse rings appear then loop forever
			gsap.set(".pulse-ring", { scale: 1, opacity: 0 });
			tl.to(".pulse-ring", {
				scale: 1,
				opacity: 0.5,
				duration: 0.01,
				stagger: 0.2,
			});

			// Check circle springs in
			tl.fromTo(
				".check-circle",
				{ scale: 0, opacity: 0 },
				{ scale: 1, opacity: 1, duration: 0.55, ease: "back.out(3)" },
				"<",
			);

			// Heading words stagger up
			tl.fromTo(
				".heading-word",
				{ y: 40, opacity: 0 },
				{ y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
				"-=0.15",
			);

			// Body text
			tl.fromTo(
				".anim-body",
				{ y: 20, opacity: 0 },
				{ y: 0, opacity: 1, duration: 0.5 },
				"-=0.25",
			);

			// Button
			tl.fromTo(
				".anim-btn",
				{ y: 20, opacity: 0 },
				{ y: 0, opacity: 1, duration: 0.5, ease: "back.out(2)" },
				"-=0.25",
			);

			// Repeating pulse rings
			gsap.to(".pulse-ring-1", {
				scale: 2,
				opacity: 0,
				duration: 2.2,
				ease: "power1.out",
				repeat: -1,
				delay: 0.6,
			});
			gsap.to(".pulse-ring-2", {
				scale: 2,
				opacity: 0,
				duration: 2.2,
				ease: "power1.out",
				repeat: -1,
				delay: 1.3,
			});
		}, containerRef);

		return () => ctx.revert();
	}, []);

	return (
		<div
			ref={containerRef}
			className="min-h-[100vh] flex items-center justify-center px-4">
			<div className="flex flex-col items-center text-center max-w-md">
				{/* Pulsing rings + icon */}
				<div className="relative flex items-center justify-center mb-10">
					<div className="pulse-ring pulse-ring-1 absolute w-24 h-24 rounded-full bg-[var(--primary-color)] opacity-0" />
					<div className="pulse-ring pulse-ring-2 absolute w-24 h-24 rounded-full bg-[var(--primary-color)] opacity-0" />
					<div className="check-circle w-24 h-24 rounded-full bg-[var(--primary-light)] flex items-center justify-center opacity-0">
						<i className="fa-solid fa-circle-check text-[var(--primary-color)] text-5xl" />
					</div>
				</div>

				{/* Heading — words animate individually */}
				<h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex flex-wrap justify-center gap-x-3">
					{headingWords.map((word, i) => (
						<span key={i} className="heading-word opacity-0 inline-block">
							{word}
						</span>
					))}
				</h1>

				{/* Body */}
				<p className="anim-body opacity-0 text-lg font-light text-gray-500 mb-10">
					{
						"Hamarosan felvesszük veled a kapcsolatot az időpontegyeztetés érdekében."
					}
				</p>

				{/* Button */}
				<Link
					href="/"
					className="anim-btn opacity-0 primary-button px-8 py-3 rounded-lg inline-flex items-center gap-2">
					<i className="fa-solid fa-arrow-left text-sm" />
					{"Vissza a főoldalra"}
				</Link>
			</div>
		</div>
	);
}
