import Image from "next/image";
import Link from "next/link";

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

const Stories = () => {
	return (
		<section className="w-full py-20 bg-primary-light" id="stories">
			<div className="max-w-7xl mx-auto px-8 sm:px-4">
				<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 text-center w-full lg:w-3/4 mx-auto">
					Így változik meg az életed a terápia után
				</h2>
				<p className="text-lg md:text-xl text-gray-700 mb-12 font-light text-center w-full lg:w-3/4 mx-auto">
					A Neuropress terápia komplex szemléletmódja miatt nem áll meg a
					kezeléseknél. Étkezés- és életmódbeli tanácsokkal is ellátjuk a
					hozzánk járókat, hogy mielőbb maguk mögött tudhassák kellemetlen
					tüneteiket.
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{testimonials.map((testimonial, index) => (
						<div
							key={index}
							className="bg-white rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300">
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

							{/* Divider */}
						</div>
					))}
				</div>
				<div className="w-full h-16 flex items-center justify-center mt-10">
					<Link
						href="#contact"
						className="primary-button inline-block mx-auto py-2">
						Szeretnék én is jól lenni!
					</Link>
				</div>
			</div>
		</section>
	);
};

export default Stories;
