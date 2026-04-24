"use client";
import AnimatedContent from "./gsap/AnimatedContent";
import FadeContent from "./gsap/FadeContent";

const cards = [
	{
		icon: "fa-solid fa-magnifying-glass-chart",
		title: "Neuropress állapotfelmérés",
		items: [
			{
				label: "Állapotfelmérés (1–1,5 óra)",
				price: "45 000 Ft",
				info: "Részletes feltérképezés, amely alapján meghatározzuk a személyre szabott kezelési terved.",
			},
			// { label: "Állapotfelmérés – Dunaszerdahely (SK)", price: "145 €" },
		],
		link: { href: "#contact", label: "Jelentkezem állapotfelmérésre" },
	},
	{
		icon: "fa-solid fa-hand-holding-medical",
		title: "Neuropress kezelések",
		items: [
			{
				label: "Budapest XI. és XII. ker. (50 perc)",
				price: "15 000 Ft",
				info: "50 perc célzott,  hatékony kezelés",
			},
			{
				label: "Kecskemét, Szeged (50 perc)",
				price: "13 500 Ft",
				info: "50 perc célzott,  hatékony kezelés",
			},
			// { label: "Győr (50 perc)", price: "14 000 Ft", info: "" },
			// { label: "Dunaszerdahely – 50 perc", price: "40 €", info: "" },
			// { label: "Dunaszerdahely – 25 perc", price: "30 €", info: "" },
		],
		link: { href: "#contact", label: "Időpontot kérek" },
	},
	{
		icon: "fa-solid fa-rotate",
		title: "Neuropress felülvizsgálat",
		items: [
			{ label: "Felülvizsgálat", price: "20 000 Ft", info: "" },
			// { label: "Felülvizsgálat – Dunaszerdahely (SK)", price: "65 €", info: "" },
		],
		link: { href: "#contact", label: "Időpontot kérek" },
	},
	{
		icon: "fa-solid fa-wave-square",
		title: "Biorezonancia vizsgálat",
		items: [
			{
				label: "Biorezonancia vizsgálat (1 óra)",
				price: "20 000 Ft",
				info: "",
			},
			// { label: "Biorezonancia – Dunaszerdahely (SK)", price: "65 €", info: "" },
		],
		link: { href: "#contact", label: "Érdekel a vizsgálat" },
	},
];

const Prices = () => {
	const handleSelect = (therapy: string) => {
		window.dispatchEvent(new CustomEvent("selectTherapy", { detail: therapy }));
		document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<section className="w-full py-20 bg-primary-light" id="pricing">
			<div className="max-w-7xl mx-auto px-4 md:px-8">
				<AnimatedContent distance={40} duration={0.7} threshold={0.3}>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-center">
						Áraink
					</h2>
				</AnimatedContent>
				<AnimatedContent
					distance={30}
					duration={0.7}
					delay={0.15}
					threshold={0.3}>
					<p className="text-lg font-light text-gray-500 text-center mb-16 w-full lg:w-1/2 mx-auto">
						Áraink 2026. február 1. napjától érvényesek!
					</p>
				</AnimatedContent>

				<FadeContent
					duration={800}
					delay={300}
					threshold={0.2}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{cards.map((card, index) => (
						<div
							key={index}
							className="bg-white rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300">
							{/* Icon */}
							<div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center mb-5 shrink-0">
								<i className={`${card.icon} text-(--primary-color) text-lg`} />
							</div>

							{/* Title */}
							<h3 className="text-base font-medium text-gray-900 mb-4 leading-snug">
								{card.title}
							</h3>

							<div className="border-t border-gray-100 mb-4" />

							{/* Price rows */}
							<ul className="flex flex-col gap-4 flex-1 mb-6">
								{card.items.map((item, i) => (
									<li key={i}>
										<p className="text-xs text-gray-600  mb-0.5">
											{item.label}
										</p>
										<p className="text-xl font-medium text-(--primary-color)">
											{item.price}
										</p>
										{item.info && (
											<p className="text-xs font-light text-gray-400 mt-1">
												{item.info}
											</p>
										)}
									</li>
								))}
							</ul>

							<div className="border-t border-gray-100 mb-4" />

							{/* CTA */}
							<button
								onClick={() => handleSelect(card.title)}
								className="text-sm font-normal text-(--primary-color) hover:text-(--primary-dark) transition-colors flex items-center gap-1.5 group cursor-pointer">
								{card.link.label}
								<i className="fa-solid fa-arrow-right text-xs transition-transform duration-200 group-hover:translate-x-1" />
							</button>
						</div>
					))}
				</FadeContent>
			</div>
		</section>
	);
};

export default Prices;
