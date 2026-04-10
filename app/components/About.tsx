"use client";
import Image from "next/image";
import AnimatedContent from "./gsap/AnimatedContent";
import FadeContent from "./gsap/FadeContent";

const About = () => {
	return (
		<section className="w-full bg-white py-20" id="about">
			<div className="max-w-7xl mx-auto px-4 md:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-12 items-start">
					<AnimatedContent distance={40} duration={0.7} threshold={0.3} className="w-full">
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-start w-full">
							Ki áll a terápia mögött?
						</h2>
					</AnimatedContent>

					<AnimatedContent
						distance={50}
						direction="horizontal"
						duration={0.8}
						delay={0.1}
						threshold={0.2}
						className="lg:row-span-2 shrink-0 w-full max-w-sm">
						<div className="bg-primary-light rounded-2xl p-8 flex flex-col items-start text-start">
							<div className="relative w-20 h-20 rounded-full overflow-hidden mb-6 shadow-md">
								<Image
									src="/images/attila.webp"
									alt="Dr. Vargha Attila"
									fill
									className="object-cover object-center"
									priority
								/>
							</div>
							<p className="text-gray-700 font-light text-sm leading-relaxed italic mb-6">
								&ldquo;„Szakértelem-Hatékonyság-Egészség" <br /> Vargha Attila
								vagyok, a NeuroPress Terápia vezető terapeutája, Budapesten a XI.
								kerületben, Kecskeméten és Szegeden vezetem a NeuroPress
								rendelőket, közel 20 éve.&rdquo;
							</p>
							<div className="border-t border-gray-200 w-16 mb-4" />
							<p className="text-sm font-medium text-gray-900">
								Dr. Vargha Attila
							</p>
							<p className="text-xs font-light text-gray-400 mt-1">
								Alapító, Neuropress terapeuta
							</p>
						</div>
					</AnimatedContent>

					<FadeContent duration={800} delay={250} threshold={0.2} className="w-full">
						<p className="text-md md:text-lg text-gray-700 font-light text-start w-full">
							Németországban nevelkedtem, majd ott végeztem közgazdasági szakon.
							Életem során mindig érdekelt az egészség és az azzal kapcsolatos
							témakörök, hozzá tartozó kutatások, új irányok és lehetőségek.{" "}
							<br />
							2001-ben Magyarországra költöztem és a családi vállalkozásba
							beléptem, ahol Édesapám ennek a terápiának az alapjait kidolgozta
							és sikeresen alkalmazta. A terápia alapfilozófiája magával
							ragadott és az eredményei meggyőztek, így egyértelmű volt
							számomra, hogy ez az, amivel foglalkozni szeretnék, ezt szeretném
							tovább vinni, fejleszteni és kutatni. <br />
							Időközben elvégeztem a természetgyógyászati iskolát reflexológiai
							szakképesítéssel. Tudásomat többek között bővítettem funkcionális
							táplálkozási- és hormonegyensúly tanácsadó képesítéssel.
							<br /> A gyógyítás ezen, területe vált számomra életfeladattá,
							melyet és emellett magamat is folyamatosan képzem és fejlesztem.
							Nincs nagyobb elismerés és motiváció számomra, mint a hozzánk
							forduló pácienseink gyógyulásának öröme. <br />
							Fontos számomra az egészségtudatos életmód, mint testileg,
							szellemileg és lelkileg. Bízom benne, hogy gyermekem is
							továbbviszi örökségét és szeretném kisgyerekes Édesapaként, hogy
							fiam büszke legyen Rám, és amit csinálok minden tekintetben
							példaértékű legyen.
						</p>
					</FadeContent>
				</div>
			</div>
		</section>
	);
};

export default About;
