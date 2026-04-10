import Image from "next/image";
const About = () => {
	return (
		<section className="w-full bg-white py-20">
			<div className="max-w-7xl mx-auto px-8 sm:px-4">
				<div className="flex flex-col lg:flex-row items-start gap-12">
					<div className="bg-white">
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 text-start w-full">
							Ismerd meg vezető orvosunkat, Dr. Szabó Pétert, aki a Neuropress
							terápia megalkotója és szakmai vezetője!
						</h2>
						<p className="text-md md:text-lg text-gray-700 mb-12 font-light text-start w-full">
							Dr. Szabó Péter több mint 20 éves tapasztalattal rendelkező orvos,
							aki a neurológia és a reflexológia területén szerzett mélyreható
							ismereteket. Szenvedélye a komplex terápiás megközelítések
							kidolgozása, amelyek célja a betegek életminőségének javítása. A
							Neuropress terápia megalkotásával Dr. Szabó egy olyan innovatív
							kezelési módszert hozott létre, amely a legújabb tudományos
							kutatásokra és klinikai tapasztalatokra épül, hogy hatékonyan
							kezelje a krónikus fájdalom és egyéb kellemetlen tünetek okait.
							Dr. Szabó Péter elkötelezett amellett, hogy minden beteg számára
							személyre szabott és eredményorientált ellátást nyújtson, és
							folyamatosan dolgozik azon, hogy továbbfejlessze a Neuropress
							terápiát a legújabb orvosi felfedezések fényében.
						</p>
					</div>
					<div className="shrink-0 w-full max-w-sm bg-primary-light rounded-2xl p-8 flex flex-col items-start text-start">
						<div className="relative w-20 h-20 rounded-full overflow-hidden mb-6 shadow-md">
							<Image
								src="/images/attila.webp"
								alt="Dr. Szabó Péter"
								fill
								className="object-cover object-center"
								priority
							/>
						</div>
						<p className="text-gray-700 font-light text-sm leading-relaxed italic mb-6">
							&ldquo;Hiszem, hogy minden tünet mögött egy ok rejlik. A
							Neuropress terápia célja, hogy megtaláljuk és kezeljük ezt az okot
							— nem csupán enyhítsük a fájdalmat.&rdquo;
						</p>
						<div className="border-t border-gray-200 w-16 mb-4" />
						<p className="text-sm font-medium text-gray-900">Dr. Szabó Péter</p>
						<p className="text-xs font-light text-gray-400 mt-1">
							Alapító, Neuropress terapeuta
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default About;
