import Image from "next/image";

const blocks = [
	{
		borderColor: "border-l-[var(--primary-color)]",
		tagColor: "text-(--primary-color)",
		tag: "Tünetek",
		title: "Feltárjuk a tünetek valódi okát",
		body: "A legtöbb kezelés csak a tüneteket kezeli – mi az okokat keressük. A Neuropress állapotfelmérés során részletesen feltérképezzük tested és idegrendszered állapotát, hogy ne csak átmeneti enyhülést, hanem tartós javulást érhessünk el.",
		image: "/images/image.webp",
		imageAlt: "Tünetek feltárása",
		imageRight: true,
	},
	{
		borderColor: "border-l-[var(--accent-color)]",
		tagColor: "text-(--accent-color)",
		tag: "Terápia",
		title: "Személyre szabott kezelési terv",
		body: "Nincs két egyforma páciens – ezért nincs két egyforma terápia sem. Az állapotfelmérés eredményei alapján személyre szabott kezelési tervet állítunk össze, amely pontosan a te szervezeted igényeire van hangolva. A reflexológián alapuló Neuropress módszer célzottan hat az idegrendszerre.",
		image: "/images/image.webp",
		imageAlt: "Személyre szabott kezelés",
		imageRight: false,
	},
	{
		borderColor: "border-l-[var(--secondary-color)]",
		tagColor: "text-(--secondary-color)",
		tag: "Életmód",
		title: "Komplex életmódbeli támogatás",
		body: "A kezelések mellett étkezési és életmódbeli tanácsokkal is segítünk, hogy a változások hosszú távon is fennmaradjanak. Célunk, hogy ne csak jobb légy a terápia alatt, hanem utána is – önállóan, tudatosan.",
		image: "/images/image.webp",
		imageAlt: "Életmódbeli támogatás",
		imageRight: true,
	},
];

const AboutCure = () => {
	return (
		<section className="w-full py-20 bg-white">
			<div className="max-w-7xl mx-auto px-4 md:px-8">
				<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 text-center w-full lg:w-3/4 mx-auto">
					Miért jobb a Neuropress terápia, mint egy hagyományos reflexológiai
					kezelés?
				</h2>
				<p className="text-lg md:text-xl text-gray-700 mb-16 font-light text-center w-full lg:w-3/4 mx-auto">
					A Neuropress nem csak reflexológia: komplexen vizsgáljuk a tested és
					idegrendszered, hogy személyre szabott, tartós javulást hozó terápiát
					nyújtsunk.
				</p>

				<div className="flex flex-col gap-8">
					{blocks.map((block, index) => (
						<div
							key={index}
							className={`flex flex-col ${block.imageRight ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-8 bg-primary-light rounded-2xl overflow-hidden border-l-4 ${block.borderColor} shadow-sm`}>
							{/* Image */}
							<div className="relative w-full lg:w-2/5 h-64 lg:h-80 shrink-0">
								<Image
									src={block.image}
									alt={block.imageAlt}
									fill
									className="object-cover"
								/>
							</div>

							{/* Text */}
							<div className="flex flex-col justify-center px-8 py-8 lg:py-0 lg:pr-10 lg:pl-4">
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
					))}
				</div>
			</div>
		</section>
	);
};

export default AboutCure;
