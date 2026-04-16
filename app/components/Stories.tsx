"use client";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import AnimatedContent from "./gsap/AnimatedContent";
import FadeContent from "./gsap/FadeContent";
import BackgroundLogo from "./BackgroundLogo";
import { useState, useRef, useEffect } from "react";

const testimonials = [
	{
		name: "Kovács Gergelyné Kránicz Szilvia",
		link: "https://www.neuropress.hu/elementor-17040/",
		profileImage: "/images/stories/4.webp",
		symptom: "Hormonális egyensúlyzavar, meddőség",
		solution:
			"Az állapotfelmérés idegrendszeri terhelést és felszívódási zavart mutatott. Biorezonanciás kezelések, életmódváltás (több állati zsiradék, glutén- és cukormentesség) és AVIVA torna hatására rendszeressé vált a ciklusa, a hormonértékek normalizálódtak, és természetes úton terhes lett.",
	},
	{
		name: "Szekeres Tünde - Marci",
		link: "https://www.neuropress.hu/szekeres-tunde-marci-baba/",
		profileImage: "/images/stories/5.webp",
		symptom: "Vetélés utáni meddőség",
		solution:
			"A vetélés után felborult ciklust Neuropress kezelésekkel rendezték. Régi páciensként tért vissza, és az életmódváltással együtt 5 hónapon belül ismét pozitív tesztet tarthatott a kezében. A szegedi csapat minden lépésnél mellette állt.",
	},
	{
		name: "Doernbrack Berni",
		link: "https://www.neuropress.hu/doernbrack-bernadett/",
		profileImage: "/images/stories/2.webp",
		symptom: "Pajzsmirigy, inzulinrezisztencia, meddőség",
		solution:
			"Vargha Attila a tünetek okát a felszívódási zavarban találta meg. A célzott kezelések és életmódváltás hatására fél év alatt terhes lett – lombik program helyett. A Neuropress terápia ott segített, ahol a gyógyszeres kezelések nem tudtak.",
	},
	{
		name: "Kaiser Tatjana Viktória",
		link: "https://www.neuropress.hu/kaiser-tatjana-viktoria/",
		profileImage: "/images/stories/3.webp",
		symptom: "Fájdalmas menstruáció",
		solution:
			"A heti kezelések során a fájdalmak megszűntek, és egy teljesen új életmódot is kapott. A csapat nemcsak szakemberként, hanem igazi társként kísérte végig az úton. A kezelés végére a tünetek teljesen eltűntek, és új emberként lépett ki az ajtón.",
	},
	{
		name: "Urban Viola",
		link: "https://www.neuropress.hu/urban-viola/",
		profileImage: "/images/stories/8.webp",
		symptom: "Migrén, puffadás, rendszertelen ciklus",
		solution:
			"Több orvos is azt mondta, minden rendben van – de ő nem érezte jól magát. A Neuropress kezelések és az életmódváltás hatására elmúlt a migrén, rendszeressé és fájdalommentessé vált a ciklusa, a puffadás megszűnt, és az alvása is helyreállt.",
	},
	{
		name: "Tóth Zita és Heger Hanna",
		link: "https://www.neuropress.hu/toth-zita-es-heger-hanna/",
		profileImage: "/images/stories/7.webp",
		symptom: "Hashimoto, emésztési rendellenesség",
		solution:
			"Heti 2 kezeléssel és az életmódváltással mindketten meggyógyultak: elmúltak a fájdalmak, Hanna 9, Zita 12 kg-ot fogyott. A PM értékek és az antiTPO is normalizálódott. Az endokrinológus csak annyit mondott: \u201eNe hagyja abba, jó az irány.\u201d",
	},
	{
		name: "Bernáth László",
		link: "https://www.neuropress.hu/bernath-laszlo/",
		profileImage: "/images/stories/1.webp",
		symptom: "Autoimmun betegség, ízületi fájdalmak",
		solution:
			"Az étkezési szokások megváltoztatása és a rendszeres kezelések hatására az emésztés kiváló lett, az alvás rendezetté vált, a stressztűrő képesség megnőtt, az ízületi fájdalmak és bizsergések enyhültek. Erőteljesebbnek érzi magát, mint valaha.",
	},
	{
		name: "Varga Zsolt Dominik",
		link: "https://www.neuropress.hu/elementor-17449/",
		profileImage: "/images/stories/9.webp",
		symptom: "Pattanásos bőr",
		solution:
			"Az állapotfelmérés feltárta a bőrtünetek belső okait. A kitartó kezelések és a szegedi csapat szaktudásának köszönhetően mára teljesen tünetmentes. Mindössze elkötelezettség és a Neuropress tudása kellett a látványos változáshoz.",
	},
	{
		name: "Szőke-Kis László",
		link: "https://www.neuropress.hu/szoke-kis-laszlo/",
		profileImage: "/images/stories/6.webp",
		symptom: "Parkinson-kór, reflux",
		solution:
			"A kezelések alatt a reflux gyógyszereit teljesen elhagyta, tünetmentesen. A terápia után fokozatosan javultak a Parkinson-tünetek: visszatért a jobb kéz használata, javult a beszéd és a mozgáskoordináció. Szinte minden tünete enyhült.",
	},
];

type Testimonial = (typeof testimonials)[0];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
	const [imageMode, setImageMode] = useState(false);
	const cardRef = useRef<HTMLDivElement>(null);
	const revealingRef = useRef(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (entry.isIntersecting && !revealingRef.current) {
					revealingRef.current = true;
					setImageMode(true);
					setTimeout(() => {
						setImageMode(false);
					}, 1400);
					observer.disconnect();
				}
			},
			{ threshold: 0.5, rootMargin: "-15% 0px -15% 0px" },
		);
		if (cardRef.current) observer.observe(cardRef.current);
		return () => observer.disconnect();
	}, []);

	const handleProfileClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setImageMode(true);
	};

	const handleCardClick = () => {
		if (imageMode) setImageMode(false);
	};

	return (
		<div
			ref={cardRef}
			onClick={handleCardClick}
			style={{ height: "400px" }}
			className={`relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 my-3${imageMode ? " cursor-pointer" : ""}`}>
			{/* Full-image layer */}
			<div
				className={`absolute inset-0 transition-all duration-700 ease-in-out ${
					imageMode
						? "opacity-100 scale-100"
						: "opacity-0 scale-105 pointer-events-none"
				}`}>
				<Image
					src={testimonial.profileImage}
					alt={testimonial.name}
					fill
					className="object-cover object-top"
				/>
				<div className="absolute inset-0  flex items-end p-5">
					<p className="text-white/80 text-xs">
						Kattints a tartalom visszatöltéséhez
					</p>
				</div>
			</div>

			{/* Content layer */}
			<div
				className={`absolute inset-0 bg-white p-6 flex flex-col transition-all duration-700 ease-in-out ${
					imageMode
						? "opacity-0 translate-y-3 pointer-events-none"
						: "opacity-100 translate-y-0"
				}`}>
				{/* Author */}
				<div className="flex items-center gap-3 mb-2">
					<div
						onClick={handleProfileClick}
						className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0 cursor-pointer ring-2 ring-transparent hover:ring-[#199ba9] hover:ring-offset-1 transition-all duration-200"
						title="Kép megtekintése">
						<Image
							src={testimonial.profileImage}
							alt={`${testimonial.name} profilképe`}
							fill
							className="object-cover"
						/>
					</div>
					<div className="text-left min-w-0">
						<p className="text-sm font-medium text-gray-900 truncate">
							{testimonial.name}
						</p>
						<p className="text-xs font-light text-gray-400 truncate">
							{testimonial.symptom}
						</p>
					</div>
				</div>

				<div className="border-t border-gray-100 my-4" />

				<h4 className="text-md font-semibold text-gray-800 mb-2 line-clamp-2">
					{testimonial.symptom}
				</h4>

				<p className="text-gray-600 font-light text-sm leading-relaxed flex-1 mb-4 line-clamp-5">
					{testimonial.solution}
				</p>

				<Link
					href={testimonial.link}
					className="text-sm font-medium text-primary mt-auto"
					onClick={(e) => e.stopPropagation()}>
					Tovább olvasom
				</Link>
			</div>
		</div>
	);
};

const SLIDES_PER_VIEW_DESKTOP = 3;
const showArrows = testimonials.length > SLIDES_PER_VIEW_DESKTOP;

const Stories = () => {
	return (
		<section
			className="w-full py-20 bg-primary-light relative overflow-hidden"
			id="stories">
			<div className="max-w-7xl mx-auto px-4 md:px-8">
				<AnimatedContent
					distance={40}
					duration={0.7}
					threshold={0.3}
					className="w-full">
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 text-center w-full lg:w-3/4 mx-auto">
						Így változik meg az életed a terápia után
					</h2>
				</AnimatedContent>
				<AnimatedContent
					distance={30}
					duration={0.7}
					delay={0.15}
					threshold={0.3}
					className="w-full">
					<p className="text-lg md:text-xl text-gray-700 mb-12 font-light text-center w-full lg:w-3/4 mx-auto">
						A Neuropress terápia komplex szemléletmódja miatt nem áll meg a
						kezeléseknél. Étkezés- és életmódbeli tanácsokkal is ellátjuk a
						hozzánk járókat, hogy mielőbb maguk mögött tudhassák kellemetlen
						tüneteiket.
					</p>
				</AnimatedContent>

				<FadeContent
					duration={800}
					delay={300}
					threshold={0.2}
					className="relative stories-swiper -mx-2 px-2 py-3 -my-3">
					<Swiper
						modules={[Autoplay, Navigation]}
						spaceBetween={24}
						slidesPerView={1}
						breakpoints={{
							768: { slidesPerView: 2 },
							1024: { slidesPerView: SLIDES_PER_VIEW_DESKTOP },
						}}
						autoplay={{
							delay: 4000,
							disableOnInteraction: true,
							pauseOnMouseEnter: true,
						}}
						navigation={
							showArrows
								? { nextEl: ".stories-next", prevEl: ".stories-prev" }
								: false
						}
						loop>
						{testimonials.map((testimonial, index) => (
							<SwiperSlide key={index} className="h-auto">
								<TestimonialCard testimonial={testimonial} />
							</SwiperSlide>
						))}
					</Swiper>

					{/* Desktop-only arrows */}
					{showArrows && (
						<>
							<button
								className="stories-prev hidden lg:flex absolute -left-12 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center rounded-full bg-white shadow border border-gray-100 hover:shadow-md transition-shadow disabled:opacity-30"
								aria-label="Előző">
								<svg
									width="18"
									height="18"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									viewBox="0 0 24 24">
									<path d="M15 18l-6-6 6-6" />
								</svg>
							</button>
							<button
								className="stories-next hidden lg:flex absolute -right-12 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center rounded-full bg-white shadow border border-gray-100 hover:shadow-md transition-shadow disabled:opacity-30"
								aria-label="Következő">
								<svg
									width="18"
									height="18"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									viewBox="0 0 24 24">
									<path d="M9 18l6-6-6-6" />
								</svg>
							</button>
						</>
					)}
					<div className="w-full h-16 flex items-center justify-center mt-10">
						<a
							href="#contact"
							className="primary-button inline-block mx-auto py-2">
							Szeretnék én is jól lenni!
						</a>
					</div>
				</FadeContent>
			</div>
			<BackgroundLogo orientation="right" />
		</section>
	);
};

export default Stories;
