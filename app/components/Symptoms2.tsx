"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import AnimatedContent from "./gsap/AnimatedContent";

const STEP_DURATION = 4000;

const symptoms = [
	{
		icon: "fa-regular fa-head-side-cough",
		title: "Allergiás panaszok",
		image: "/images/stock/19.webp",
	},
	{
		icon: "fa-regular fa-bed",
		title: "Nőgyógyászati problémák",
		image: "/images/stock/16.webp",
	},
	{
		icon: "fa-regular fa-heart-pulse",
		title: "Bőrgyógyászati panaszok",
		image: "/images/stock/14.webp",
	},
	{
		icon: "fa-regular fa-bolt",
		title: "Idegrendszeri panaszok",
		image: "/images/stock/15.webp",
	},
	{
		icon: "fa-regular fa-face-smile",
		title: "Hormonális zavarok",
		image: "/images/stock/18.webp",
	},
	{
		icon: "fa-regular fa-bone",
		title: "Mozgásszervi és izületi panaszok",
		image: "/images/stock/5.webp",
	},
	{
		icon: "fa-regular fa-utensils",
		title: "Cukorbetegség",
		image: "/images/stock/13.webp",
	},
	{
		icon: "fa-regular fa-shield",
		title: "Érrendszeri panaszok",
		image: "/images/stock/17.webp",
	},
	{
		icon: "fa-regular fa-brain",
		title: "Immunrendszeri zavarok",
		image: "/images/stock/11.webp",
	},
];

const Symptoms2 = () => {
	const [activeIndex, setActiveIndex] = useState(0);
	const [progressKey, setProgressKey] = useState(0);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const startTimer = useCallback(() => {
		if (intervalRef.current) clearInterval(intervalRef.current);
		intervalRef.current = setInterval(() => {
			setActiveIndex((prev) => (prev + 1) % symptoms.length);
			setProgressKey((k) => k + 1);
		}, STEP_DURATION);
	}, []);

	useEffect(() => {
		startTimer();
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [startTimer]);

	const handleSelect = (index: number) => {
		setActiveIndex(index);
		setProgressKey((k) => k + 1);
		startTimer();
	};

	return (
		<section className="w-full py-20 bg-white relative overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 md:px-8">
				<AnimatedContent
					distance={40}
					duration={0.7}
					threshold={0.3}
					className="w-full">
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-12 text-center w-full lg:w-3/4 mx-auto">
						Kellemetlen, olykor kínzó tünetek, amikre a terápiánk megoldás lehet
					</h2>
				</AnimatedContent>

				<AnimatedContent
					distance={30}
					duration={0.7}
					threshold={0.2}
					className="w-full">
					<div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-stretch">
						{/* Left: Image panel */}
						<div className="relative w-full lg:w-1/2 rounded-3xl overflow-hidden aspect-[4/3] lg:aspect-auto bg-[var(--primary-light)] shrink-0">
							{symptoms.map((symptom, index) => (
								<Image
									key={index}
									src={symptom.image}
									alt={symptom.title}
									sizes="(max-width: 1024px) 100vw, 50vw"
									fill
									className={`object-cover transition-opacity duration-700 ${
										index === activeIndex ? "opacity-100" : "opacity-0"
									}`}
									priority={index === 0}
								/>
							))}

							{/* Active label overlay */}
							<div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/40 to-transparent">
								<p className="text-white font-medium text-lg leading-snug">
									{symptoms[activeIndex].title}
								</p>
							</div>
						</div>

						{/* Right: Symptom list */}
						<div className="w-full lg:w-1/2 flex flex-col gap-2">
							{symptoms.map((symptom, index) => {
								const isActive = index === activeIndex;
								return (
									<button
										key={index}
										onClick={() => handleSelect(index)}
										className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all duration-300 cursor-pointer overflow-hidden ${
											isActive
												? "bg-[var(--primary-color)] text-white shadow-md"
												: "bg-[var(--primary-light)] text-gray-700 hover:bg-gray-100"
										}`}>
										<i
											className={`text-[18px] shrink-0 ${symptom.icon} ${
												isActive ? "text-white" : "text-[var(--primary-color)]"
											}`}
										/>
										<span className="text-sm font-medium leading-snug">
											{symptom.title}
										</span>

										{/* Progress bar */}
										{isActive && (
											<span
												key={progressKey}
												className="symptom-progress absolute bottom-0 left-0 h-[3px] bg-white/40"
												style={
													{
														"--step-duration": `${STEP_DURATION}ms`,
													} as React.CSSProperties
												}
											/>
										)}
									</button>
								);
							})}
						</div>
					</div>
				</AnimatedContent>
			</div>
		</section>
	);
};

export default Symptoms2;
