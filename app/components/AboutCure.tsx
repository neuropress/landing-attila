"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import AnimatedContent from "./gsap/AnimatedContent";
import ScrollStack, { ScrollStackItem } from "./gsap/ScrollStack";

const blocks = [
	{
		borderColor: "border-l-[var(--accent-color)]",
		tagColor: "text-(--accent-color)",
		tag: "Terápia",
		title: "Személyre szabott kezelési terv",
		body: "Nincs két egyforma páciens – ezért nincs két egyforma terápia sem. A reflexológián alapuló Neuropress módszer olyan intenzitású ingerekkel dolgozik, ahol az idegrendszer már reagálni kezd, és az fMRI kutatások által igazolt megközelítésünk nem a tüneteket kezeli, hanem a működést állítja helyre az idegrendszeri inger-válasz-változások révén.",
		image: "/images/neur/2.webp",
		imageAlt: "Személyre szabott kezelés",
		imageRight: false,
	},
	{
		borderColor: "border-l-[var(--primary-color)]",
		tagColor: "text-(--primary-color)",
		tag: "Tünetek",
		title: "Feltárjuk a tünetek valódi okát",
		body: "A legtöbb kezelés csak a tüneteket kezeli – mi az okokat keressük. A Neuropress állapotfelmérés során részletesen feltérképezzük tested és idegrendszered állapotát, hogy ne csak átmeneti enyhülést, hanem tartós javulást érhessünk el.",
		image: "/images/neur/1.webp",
		imageAlt: "Tünetek feltárása",
		imageRight: true,
	},
	{
		borderColor: "border-l-[var(--secondary-color)]",
		tagColor: "text-(--secondary-color)",
		tag: "Életmód",
		title: "Komplex életmódbeli támogatás",
		body: "A kezelések mellett étkezési és életmódbeli tanácsokkal is segítünk, hogy a változások hosszú távon is fennmaradjanak. Célunk, hogy ne csak jobb légy a terápia alatt, hanem utána is – önállóan, tudatosan.",
		image: "/images/neur/3.webp",
		imageAlt: "Életmódbeli támogatás",
		imageRight: true,
	},
];

const AboutCure = () => {
	const [stackPos, setStackPos] = useState("35%");
	const [scaleEndPos, setScaleEndPos] = useState("30%");

	useEffect(() => {
		const update = () => {
			const mobile = window.innerWidth < 768;
			setStackPos(mobile ? "15%" : "35%");
			// scaleEndPos must be numerically smaller than stackPos so the
			// triggerEnd > triggerStart invariant holds and scaling stays smooth.
			setScaleEndPos(mobile ? "5%" : "30%");
		};
		update();
		window.addEventListener("resize", update);
		return () => window.removeEventListener("resize", update);
	}, []);

	return (
		<section className="w-full bg-white pt-20">
			<div className="hidden md:block sticky top-0 z-20 bg-white py-6">
				<div className="max-w-7xl mx-auto px-4 md:px-8">
					<AnimatedContent
						distance={40}
						duration={0.7}
						threshold={0.3}
						className="w-full">
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-center w-full lg:w-3/4 mx-auto">
							Miért jobb a Neuropress terápia, mint egy hagyományos
							reflexológiai kezelés?
						</h2>
						<p className="text-lg md:text-xl text-gray-700 font-light text-center w-full lg:w-3/4 mx-auto">
							A Neuropress nem csak reflexológia: komplexen vizsgáljuk a tested
							és idegrendszered, hogy személyre szabott, tartós javulást hozó
							terápiát nyújtsunk.
						</p>
					</AnimatedContent>
				</div>
			</div>

			<ScrollStack
				useWindowScroll={true}
				innerClassName="px-4 md:px-8 max-w-7xl mx-auto"
				bottomPadding="pb-[50vh]"
				itemDistance={70}
				itemScale={0.03}
				itemStackDistance={18}
				stackPosition={stackPos}
				scaleEndPosition={scaleEndPos}
				baseScale={0.9}>
				{blocks.map((block, index) => (
					<ScrollStackItem
						key={index}
						itemClassName="!p-0 !h-auto overflow-hidden">
						<div
							className={`flex flex-col ${block.imageRight ? "lg:flex-row" : "lg:flex-row-reverse"} bg-primary-light border-l-4 ${block.borderColor}`}>
							{/* Image — top on mobile, side panel on desktop */}
							<div className="relative w-full h-52 lg:w-2/5 lg:h-auto lg:min-h-72 shrink-0">
								<Image
									src={block.image}
									alt={block.imageAlt}
									fill
									className="object-cover"
								/>
							</div>

							{/* Text */}
							<div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
								<span
									className={`text-xs font-medium uppercase tracking-widest mb-3 ${block.tagColor}`}>
									{block.tag}
								</span>
								<h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 leading-snug">
									{block.title}
								</h3>
								<p className="text-gray-600 font-light leading-relaxed">
									{block.body}
								</p>
							</div>
						</div>
					</ScrollStackItem>
				))}
			</ScrollStack>
		</section>
	);
};

export default AboutCure;
