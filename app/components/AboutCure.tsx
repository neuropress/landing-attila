"use client";
import Image from "next/image";
import AnimatedContent from "./gsap/AnimatedContent";

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
	return (
		<section className="w-full bg-white pt-20">
			<div className="max-w-7xl mx-auto px-4 md:px-8">
				<AnimatedContent
					distance={40}
					duration={0.7}
					threshold={0.3}
					className="w-full mb-12">
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

				<div className="flex flex-col gap-8 pb-20">
					{blocks.map((block, index) => (
						<AnimatedContent
							key={index}
							distance={40}
							duration={0.6}
							threshold={0.2}
							delay={index * 0.1}>
							<div
								className={`flex flex-col ${block.imageRight ? "lg:flex-row" : "lg:flex-row-reverse"} bg-primary-light border-l-4 ${block.borderColor} rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.1)] overflow-hidden`}>
								<div className="relative w-full h-52 lg:w-2/5 lg:h-auto lg:min-h-72 shrink-0">
									<Image
										src={block.image}
										alt={block.imageAlt}
										fill
										className="object-cover"
									/>
								</div>
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
						</AnimatedContent>
					))}
				</div>
			</div>
		</section>
	);
};

export default AboutCure;
