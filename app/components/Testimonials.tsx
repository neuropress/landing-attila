"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import AnimatedContent from "./gsap/AnimatedContent";
import FadeContent from "./gsap/FadeContent";

const testimonials = [
	{
		name: "Trokán Nóra",
		profileImage: "/images/testi/6.webp",
		symptom: "színésznő",
		solution:
			"„A tudatosság nem más, mint az elménk fölötti hatalmunkra való ráébredés. A tudatosodás pedig az elme fölötti uralom gyakorlásának útja.” Büszkék vagyunk Trokán Nórára, amiért nem csak figyelt a szervezete jelzéseire, de képes volt a nehezebb utat választani és változtatni az egészsége érdekében. Ma már sokkal jobban érzi magát és az epegörcsök sem gyötrik.",
		rating: 5,
	},
	{
		name: "Szabó Zsófi",
		profileImage: "/images/testi/5.webp",
		symptom: "színésznő, műsorvezető",
		solution:
			"Szabó Zsófi évek óta szenved a migréntől. Már szinte az élete részévé vált a vissza-visszatérő, elviselhetetlen fájdalom, az átvirrasztott éjszakák, a kimerültség. Egy ismerősétől hallott először a NeuroPress Terápiáról és az esélytelenek nyugalmával érkezett az állapotfelmérésre, hiszen korábban már több gyógymód is hatástalannak bizonyult nála. Vargha Attila azonban rámutatott arra, hogy a migrén csupán a jéghegy csúcsa és az egész szervezetet kell vizsgálni.",
		rating: 5,
	},
	{
		name: "Polgár Odett",
		profileImage: "/images/testi/4.webp",
		symptom: "színésznő",
		solution:
			"Polgár Odett színésznőként és édesanyaként is rengeteg stressznek van kitéve, ami hosszú távon az egészségére is hatással volt. A NeuroPress Terápia segítségével sikerült megtalálnia a belső egyensúlyt és megszabadulnia a krónikus fáradtságtól, ami korábban mindennapjait megnehezítette. Odett most már sokkal energikusabbnak érzi magát és képes teljes mértékben élvezni a munkáját és a családi életét.",
		rating: 5,
	},
];

const SLIDES_PER_VIEW_DESKTOP = 3;
const showArrows = testimonials.length > SLIDES_PER_VIEW_DESKTOP;

const Stars = ({ count }: { count: number }) => (
	<div className="flex gap-0.5 justify-center">
		{Array.from({ length: 5 }).map((_, i) => (
			<svg
				key={i}
				className={`w-4 h-4 ${i < count ? "text-amber-400" : "text-gray-200"}`}
				fill="currentColor"
				viewBox="0 0 20 20">
				<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
			</svg>
		))}
	</div>
);

const Testimonials = () => {
	return (
		<section className="w-full py-20 bg-primary-light">
			<div className="max-w-7xl mx-auto px-4 md:px-8">
				<AnimatedContent
					distance={40}
					duration={0.7}
					threshold={0.3}
					className="w-full">
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 text-center w-full lg:w-3/4 mx-auto">
						Nekik már segítettünk
					</h2>
				</AnimatedContent>
				<AnimatedContent
					distance={30}
					duration={0.7}
					delay={0.15}
					threshold={0.3}
					className="w-full">
					<p className="text-lg md:text-xl text-gray-700 mb-12 font-light text-center w-full lg:w-3/4 mx-auto">
						Olvasd el, hogyan változtatta meg a Neuropress terápia a hozzánk
						fordulók életét, és hogyan szabadultak meg kellemetlen tünetektől.
					</p>
				</AnimatedContent>

				<FadeContent
					duration={800}
					delay={300}
					threshold={0.2}
					className="relative testimonials-swiper -mx-2 px-2 py-3 -my-3">
					<Swiper
						modules={[Autoplay, Navigation]}
						spaceBetween={24}
						slidesPerView={1}
						breakpoints={{
							768: { slidesPerView: 2 },
							1024: { slidesPerView: SLIDES_PER_VIEW_DESKTOP },
						}}
						autoplay={{
							delay: 2000,
							disableOnInteraction: true,
							pauseOnMouseEnter: true,
						}}
						navigation={
							showArrows
								? { nextEl: ".testimonials-next", prevEl: ".testimonials-prev" }
								: false
						}
						loop>
						{testimonials.map((testimonial, index) => (
							<SwiperSlide key={index}>
								<div className="bg-white rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300 h-full my-3">
									{/* Quote mark */}
									<div className="text-4xl leading-none text-(--primary-color) font-serif mb-3 select-none">
										&ldquo;
									</div>

									{/* Review text */}
									<p className="text-gray-600 font-light text-sm leading-relaxed flex-1 mb-6">
										{testimonial.solution}
									</p>

									{/* Stars */}
									<Stars count={testimonial.rating} />

									{/* Divider */}
									<div className="border-t border-gray-100 my-4" />

									{/* Author */}
									<div className="flex items-center gap-3">
										<div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
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
								</div>
							</SwiperSlide>
						))}
					</Swiper>

					{/* Desktop-only arrows */}
					{showArrows && (
						<>
							<button
								className="testimonials-prev hidden lg:flex absolute -left-12 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center rounded-full bg-white shadow border border-gray-100 hover:shadow-md transition-shadow disabled:opacity-30"
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
								className="testimonials-next hidden lg:flex absolute -right-12 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center rounded-full bg-white shadow border border-gray-100 hover:shadow-md transition-shadow disabled:opacity-30"
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
				</FadeContent>
			</div>
		</section>
	);
};

export default Testimonials;
