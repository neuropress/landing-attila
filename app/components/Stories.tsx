"use client";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import AnimatedContent from "./gsap/AnimatedContent";
import FadeContent from "./gsap/FadeContent";

const testimonials = [
	{
		name: "Kovács Anna",
		profileImage: "/images/profile.webp",
		symptom: "Migrén és alvászavar",
		solution:
			"A Neuropress terápia után jelentős javulást tapasztaltam a migrénes fejfájásaimban, és az alvásom is sokkal pihentetőbb lett. Az életminőségem drámaian javult, és újra élvezhetem a mindennapokat fájdalom nélkül.",
		rating: 5,
	},
	{
		name: "Nagy Péter",
		profileImage: "/images/profile.webp",
		symptom: "Stressz és szorongás",
		solution:
			"A Neuropress komplex megközelítése segített nekem abban, hogy jobban kezeljem a stresszt és a szorongást. Az életmódbeli tanácsok és a terápiás kezelések együttesen hozzájárultak ahhoz, hogy kiegyensúlyozottabbá váljak.",
		rating: 5,
	},
	{
		name: "Szabó Eszter",
		profileImage: "/images/profile.webp",
		symptom: "Energiahiány és koncentrációs nehézségek",
		solution:
			"A Neuropress terápia után sokkal energikusabbnak érzem magam, és a koncentrációs képességem is jelentősen javult. Az életmódbeli tanácsok segítettek abban, hogy egészségesebb szokásokat alakítsak ki.",
		rating: 5,
	},
	{
		name: "Tóth László",
		profileImage: "/images/profile.webp",
		symptom: "Izom- és ízületi fájdalom",
		solution:
			"A Neuropress terápia során tapasztaltam a legnagyobb javulást az izom- és ízületi fájdalmaimban. A kezelések és a tanácsok együttesen segítettek abban, hogy újra szabadon mozoghassak.",
		rating: 5,
	},
];

const SLIDES_PER_VIEW_DESKTOP = 3;
const showArrows = testimonials.length > SLIDES_PER_VIEW_DESKTOP;

const Stories = () => {
	return (
		<section className="w-full py-20 bg-primary-light" id="stories">
			<div className="max-w-7xl mx-auto px-4 md:px-8">
				<AnimatedContent distance={40} duration={0.7} threshold={0.3} className="w-full">
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 text-center w-full lg:w-3/4 mx-auto">
						Így változik meg az életed a terápia után
					</h2>
				</AnimatedContent>
				<AnimatedContent distance={30} duration={0.7} delay={0.15} threshold={0.3} className="w-full">
					<p className="text-lg md:text-xl text-gray-700 mb-12 font-light text-center w-full lg:w-3/4 mx-auto">
						A Neuropress terápia komplex szemléletmódja miatt nem áll meg a
						kezeléseknél. Étkezés- és életmódbeli tanácsokkal is ellátjuk a
						hozzánk járókat, hogy mielőbb maguk mögött tudhassák kellemetlen
						tüneteiket.
					</p>
				</AnimatedContent>

				<FadeContent duration={800} delay={300} threshold={0.2} className="relative stories-swiper -mx-2 px-2 py-3 -my-3">
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
								? { nextEl: ".stories-next", prevEl: ".stories-prev" }
								: false
						}
						loop>
						{testimonials.map((testimonial, index) => (
							<SwiperSlide key={index} className="h-auto">
								<div className="bg-white rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300 h-full my-3">
									{/* Author */}
									<div className="flex items-center gap-3 mb-2">
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
									<div className="border-t border-gray-100 my-4" />

									{/* Problem */}
									<h4 className="text-md font-semibold text-gray-800 mb-2 min-h-15">
										{testimonial.symptom}
									</h4>

									{/* Solution */}
									<p className="text-gray-600 font-light text-sm leading-relaxed flex-1 mb-6">
										{testimonial.solution}
									</p>
								</div>
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
				</FadeContent>

				<FadeContent duration={800} delay={500} threshold={0.2} className="w-full h-16 flex items-center justify-center mt-10">
					<Link
						href="#contact"
						className="primary-button inline-block mx-auto py-2">
						Szeretnék én is jól lenni!
					</Link>
				</FadeContent>
			</div>
		</section>
	);
};

export default Stories;
