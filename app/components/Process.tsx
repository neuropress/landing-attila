"use client";
import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedContent from "./gsap/AnimatedContent";
import FadeContent from "./gsap/FadeContent";
import BackgroundLogo from "./BackgroundLogo";

gsap.registerPlugin(ScrollTrigger);

const steps = [
	{
		icon: "fa-solid fa-file-pen",
		title: "Jelentkezz az űrlapon!",
		description:
			"Töltsd ki a jelentkezési űrlapot, és indítsd el az utadat a tünetmentes élet felé.",
	},
	{
		icon: "fa-solid fa-phone",
		title: "Időpontegyeztetés",
		description:
			"Felvesszük veled a kapcsolatot és időpontot egyeztetünk telefonon.",
	},
	{
		icon: "fa-solid fa-clipboard-list",
		title: "Állapotfelmérés",
		description:
			"Részletesen feltérképezzük tüneteid mögött húzódó kiváltó okokat és felállítjuk egyénre szabottan a komplex kezelési terved.",
	},
	{
		icon: "fa-solid fa-hand-holding-medical",
		title: "Személyre szabott kezelések",
		description:
			"Személyre szabott kezeléseken veszel részt, amelyeket az állapotfelmérés alapján állítunk össze.",
	},
	{
		icon: "fa-solid fa-chart-line",
		title: "Felülvizsgálat",
		description:
			"Állapotod javulását rendszeres felülvizsgálatokkal követjük nyomon és finomhangoljuk a terápiát.",
	},
];

const HorizontalConnector = ({ delay }: { delay: number }) => {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		gsap.set(el, { scaleX: 0, transformOrigin: "left center" });
		const st = ScrollTrigger.create({
			trigger: el,
			start: "top 85%",
			once: true,
			onEnter: () =>
				gsap.to(el, { scaleX: 1, duration: 0.5, delay, ease: "power2.out" }),
		});
		return () => st.kill();
	}, [delay]);
	return (
		<div
			ref={ref}
			className="w-full border-t-2 border-dashed border-gray-200"
		/>
	);
};

const VerticalConnector = ({ delay }: { delay: number }) => {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		gsap.set(el, { scaleY: 0, transformOrigin: "top center" });
		const st = ScrollTrigger.create({
			trigger: el,
			start: "top 85%",
			once: true,
			onEnter: () =>
				gsap.to(el, { scaleY: 1, duration: 0.4, delay, ease: "power2.out" }),
		});
		return () => st.kill();
	}, [delay]);
	return (
		<div
			ref={ref}
			className="flex-1 w-px border-l-2 border-dashed border-gray-200 my-2"
		/>
	);
};

const Process = () => {
	return (
		<section
			className="w-full pb-20 bg-white relative overflow-hidden"
			id="process">
			<div className="max-w-7xl mx-auto px-4 md:px-8">
				<AnimatedContent distance={40} duration={0.7} threshold={0.3}>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-center">
						Hogyan működik a terápia?
					</h2>
				</AnimatedContent>
				<AnimatedContent
					distance={30}
					duration={0.7}
					delay={0.15}
					threshold={0.3}>
					<p className="text-lg font-light text-gray-500 text-center mb-16 w-full lg:w-1/2 mx-auto">
						5 egyszerű lépés a tünetmentes, kiegyensúlyozottabb élethez.
					</p>
				</AnimatedContent>

				{/* Desktop: horizontal stepper */}
				<div className="hidden lg:flex items-start">
					{steps.map((step, index) => (
						<React.Fragment key={index}>
							<AnimatedContent
								distance={30}
								duration={0.6}
								delay={index * 0.15}
								threshold={0.1}
								className="flex flex-col items-center text-center flex-1">
								<div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mb-5 ring-2 ring-white shadow-sm shrink-0">
									<i
										className={`${step.icon} text-(--primary-color) text-xl`}
									/>
								</div>
								<span className="text-xs font-medium text-(--primary-color) uppercase tracking-widest mb-2">
									{String(index + 1).padStart(2, "0")}
								</span>
								<h3 className="text-base font-medium text-gray-900 mb-2">
									{step.title}
								</h3>
								<p className="text-sm font-light text-gray-500 leading-relaxed max-w-45">
									{step.description}
								</p>
							</AnimatedContent>

							{index < steps.length - 1 && (
								<div className="flex-1 flex items-start pt-8 max-w-20">
									<HorizontalConnector delay={index * 0.15 + 0.12} />
								</div>
							)}
						</React.Fragment>
					))}
				</div>

				{/* Mobile: vertical stepper */}
				<div className="flex lg:hidden flex-col gap-0">
					{steps.map((step, index) => (
						<div key={index} className="flex gap-5">
							{/* Left: circle + connector */}
							<div className="flex flex-col items-center">
								<AnimatedContent
									distance={20}
									duration={0.5}
									delay={index * 0.12}
									threshold={0.1}
									className="shrink-0">
									<div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center ring-2 ring-white shadow-sm">
										<i
											className={`${step.icon} text-(--primary-color) text-base`}
										/>
									</div>
								</AnimatedContent>
								{index < steps.length - 1 && (
									<VerticalConnector delay={index * 0.12 + 0.1} />
								)}
							</div>

							{/* Right: content */}
							<AnimatedContent
								distance={30}
								direction="horizontal"
								reverse
								duration={0.5}
								delay={index * 0.12}
								threshold={0.1}
								className="pb-8">
								<span className="text-xs font-medium text-(--primary-color) uppercase tracking-widest">
									{String(index + 1).padStart(2, "0")}
								</span>
								<h3 className="text-base font-medium text-gray-900 mt-1 mb-1">
									{step.title}
								</h3>
								<p className="text-sm font-light text-gray-500 leading-relaxed">
									{step.description}
								</p>
							</AnimatedContent>
						</div>
					))}
				</div>

				<FadeContent
					duration={700}
					delay={400}
					threshold={0.2}
					className="w-full h-16 flex items-center justify-center mt-10">
					<a
						href="#contact"
						className="primary-button inline-block mx-auto py-2">
						Jelentkezem állapotfelmérésre!
					</a>
				</FadeContent>
			</div>
			<BackgroundLogo orientation="left" />
		</section>
	);
};

export default Process;
