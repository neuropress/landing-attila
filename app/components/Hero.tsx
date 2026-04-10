"use client";
import React from "react";
import Image from "next/image";
import SplitText from "./gsap/SplitText";
import FadeContent from "./gsap/FadeContent";
import AnimatedContent from "./gsap/AnimatedContent";

const handleAnimationComplete = () => {
	console.log("All letters have animated!");
};

const Hero = () => {
	return (
		<div className="min-h-screen flex flex-col bg-primary-light justify-center items-start relative overflow-hidden">
			<div className="max-w-7xl mx-auto flex flex-col text-left px-8 md:px-0 z-10 w-full md:w-2/5 md:ml-8 lg:ml-20 xl:ml-32 mt-20 md:mt-0">
				{/* <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
					Feltárjuk szűnni nem akaró kellemetlen tüneteid okait és célzottan
					kezeljük azokat!
				</h1> */}
				<SplitText
					text="Feltárjuk szűnni nem akaró kellemetlen tüneteid okait és célzottan
					kezeljük azokat!"
					className="text-2xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
					delay={40}
					duration={0.25}
					textAlign="start"
					tag="h1"
					onLetterAnimationComplete={handleAnimationComplete}
				/>
				<FadeContent
					duration={1000}
					ease="power2.out"
					delay={500}
					threshold={0.2}>
					<p className="text-lg md:text-xl text-gray-700 mb-8 font-light">
						Neuropress - egyedileg továbbfejlesztett, reflexológián alapuló
						komplex terápia
					</p>
					<a href="#contact" className="primary-button inline-block">
						Jelentkezem állapotfelmérésre!
					</a>
				</FadeContent>
			</div>
			{/* Mobile decorative blob */}
			<div
				className="sm:hidden absolute bg-primary rounded-full w-140 h-140 -right-110 -top-0 blur-3xl opacity-40 animate-blob-orbit"
				aria-hidden="true"
			/>
			<div
				className="hidden sm:block absolute rounded-[100px] w-[500px] h-[500px] md:w-[700px] md:h-[700px] lg:w-[800px] lg:h-[800px]  right-[-60px] md:right-[-80px] lg:right-[-100px]  top-[-120px] md:top-[-160px] lg:top-[-200px]  rotate-[-12deg] overflow-hidden animate-slide-in-from-left"
				aria-hidden="true">
				<Image
					src="/images/attila.webp"
					alt="Vargha Attila, a Neuropress Terápia alapítója"
					className="w-[130%] h-[130%] object-cover object-center rotate-[12deg] left-[-15%] top-[20%] absolute"
					draggable="false"
					style={{ pointerEvents: "none", userSelect: "none" }}
					width={2000}
					height={2000}
					priority
				/>
			</div>
		</div>
	);
};

export default Hero;
