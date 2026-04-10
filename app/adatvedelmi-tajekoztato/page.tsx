import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Adatvédelmi tájékoztató",
	description:
		"A Neuropress Terápia adatvédelmi tájékoztatója – tájékozódj személyes adataid kezeléséről.",
};

export default function AdatvedelmiTajekoztato() {
	return (
		<main className="max-w-3xl mx-auto px-8 py-24 min-h-screen">
			<Link
				href="/"
				className="text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8 inline-block">
				← Vissza a főoldalra
			</Link>
			<h1 className="text-3xl font-bold text-gray-900 mb-4">
				Adatvédelmi tájékoztató
			</h1>
			<p className="text-gray-500 font-light mb-12 text-sm">
				Utolsó frissítés: 2026. január 1.
			</p>
			<div className="prose prose-gray max-w-none font-light text-gray-700 leading-relaxed space-y-6">
				<p>
					A Neuropress Terápia (továbbiakban: Adatkezelő) elkötelezett a
					személyes adatok védelme iránt. Ez a tájékoztató részletesen leírja,
					hogy milyen adatokat gyűjtünk, hogyan kezeljük azokat, és milyen jogok
					illetnek meg téged az adataid kapcsán.
				</p>
				<h2 className="text-xl font-medium text-gray-900 mt-8">
					1. Az adatkezelő adatai
				</h2>
				<p>
					Adatkezelő neve: Vargha Attila (Neuropress Terápia)
					<br />
					Székhely: Budapest XI. kerület, Magyarország
					<br />
					E-mail: info@neuropress.hu
					<br />
					Telefon: +36 30 123 4567
				</p>
				<h2 className="text-xl font-medium text-gray-900 mt-8">
					2. Kezelt adatok köre
				</h2>
				<p>
					Kapcsolatfelvételi űrlap kitöltésekor az alábbi adatokat kezeljük:
					teljes név, telefonszám, e-mail cím, az érdeklődés tárgya és az üzenet
					szövege.
				</p>
				<h2 className="text-xl font-medium text-gray-900 mt-8">
					3. Az adatkezelés célja és jogalapja
				</h2>
				<p>
					Az adatkezelés célja a kapcsolatfelvételi kérelmek megválaszolása és
					időpontok egyeztetése. Jogalapja: az érintett hozzájárulása (GDPR 6.
					cikk (1) bekezdés a) pont).
				</p>
				<h2 className="text-xl font-medium text-gray-900 mt-8">
					4. Adatmegőrzési idő
				</h2>
				<p>
					A személyes adatokat a hozzájárulás visszavonásáig, de legfeljebb 5
					évig őrizzük.
				</p>
				<h2 className="text-xl font-medium text-gray-900 mt-8">
					5. Az érintett jogai
				</h2>
				<p>
					Jogod van hozzáférni a rólad tárolt adatokhoz, kérni azok
					helyesbítését, törlését vagy az adatkezelés korlátozását. Panasszal
					fordulhatsz a Nemzeti Adatvédelmi és Információszabadság Hatósághoz
					(naih.hu).
				</p>
				<p className="text-sm text-gray-400 pt-8 border-t border-gray-100">
					Ez a tájékoztató folyamatosan bővítés alatt áll. Kérdések esetén
					keresd ügyfélszolgálatunkat az info@neuropress.hu címen.
				</p>
			</div>
		</main>
	);
}
