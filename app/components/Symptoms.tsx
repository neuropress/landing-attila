"use client";
import React from "react";
import AnimatedContent from "./gsap/AnimatedContent";
import BackgroundLogo from "./BackgroundLogo";

const symptoms = [
	{
		icon: "fa-regular fa-head-side-cough",
		title: "Fejfájás, migrén",
		description:
			"Visszatérő fejfájás, nyomásérzet vagy lüktető migrén, amely rontja az életminőségedet.",
	},
	{
		icon: "fa-regular fa-bed",
		title: "Alvászavar, fáradtság",
		description:
			"Nehéz elalvás, éjszakai ébredések vagy tartós kimerültség, ami napközben is megmarad.",
	},
	{
		icon: "fa-regular fa-heart-pulse",
		title: "Stressz, szorongás",
		description:
			"Folyamatos feszültség, belső nyugtalanság vagy pánikrohamok, amelyek befolyásolják mindennapjaid.",
	},
	{
		icon: "fa-regular fa-bolt",
		title: "Energiahiány",
		description:
			"Reggeltől este tartó alacsony energiaszint, motivációhiány, koncentrációs nehézségek.",
	},
	{
		icon: "fa-regular fa-face-smile",
		title: "Hangulatingadozás",
		description:
			"Hirtelen hangulatváltozások, ingerlékenység vagy érzelmi kiegyensúlyozatlanság.",
	},
	{
		icon: "fa-regular fa-bone",
		title: "Izom- és ízületi fájdalom",
		description:
			"Tartós feszültség, görcsök, vagy fájdalmas pontok a nyakban, vállban, hátban.",
	},
	{
		icon: "fa-regular fa-utensils",
		title: "Emésztési panaszok",
		description:
			"Puffadás, görcsök, irritábilis bél szindróma vagy egyéb funkcionális emésztési zavarok.",
	},
	{
		icon: "fa-regular fa-shield",
		title: "Immunrendszer gyengesége",
		description:
			"Visszatérő fertőzések, lassú felépülés, az immunrendszer általános alulteljesítése.",
	},
];

const Symptoms = () => {
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
				<div className="grid grid-cols-2  md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
					{symptoms.map((symptom, index) => (
						<AnimatedContent
							key={index}
							distance={30}
							duration={0.6}
							delay={index * 0.08}
							threshold={0.1}
							className="h-full">
							<div className="group flex flex-col items-center text-center p-2 md:p-6 rounded-2xl bg-transparent border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-transparent cursor-default h-full">
								<div className="text-(--primary-color) mb-4 transition-transform duration-300 group-hover:scale-110">
									<i className={`text-[25px] ${symptom.icon}`}></i>
								</div>
								<h4 className="text-base font-medium text-gray-900 mb-2 leading-snug wrap-break-word w-full">
									{symptom.title}
								</h4>
								<p className="text-sm font-light text-gray-500 leading-relaxed">
									{symptom.description}
								</p>
							</div>
						</AnimatedContent>
					))}
				</div>
			</div>
			{/* <BackgroundLogo /> */}
		</section>
	);
};

export default Symptoms;
