import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Általános Szerződési Feltételek",
	description:
		"A Neuropress Terápia Általános Szerződési Feltételei – tájékozódj a szolgáltatások igénybevételének feltételeiről.",
};

export default function Aszf() {
	return (
		<main className="max-w-3xl mx-auto px-8 py-24 min-h-screen">
			<Link
				href="/"
				className="text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8 inline-block">
				← Vissza a főoldalra
			</Link>
			<h1 className="text-3xl font-bold text-gray-900 mb-4">
				Általános Szerződési Feltételek
			</h1>
			<p className="text-gray-500 font-light mb-12 text-sm">
				Utolsó frissítés: 2026. január 1.
			</p>
			<div className="prose prose-gray max-w-none font-light text-gray-700 leading-relaxed space-y-6">
				<p>
					Jelen Általános Szerződési Feltételek (ÁSZF) szabályozzák a Neuropress
					Terápia (továbbiakban: Szolgáltató) által nyújtott terápiás
					szolgáltatások igénybevételének feltételeit.
				</p>
				<h2 className="text-xl font-medium text-gray-900 mt-8">
					1. A szolgáltató adatai
				</h2>
				<p>
					Szolgáltató neve: Vargha Attila (Neuropress Terápia)
					<br />
					Székhely: Budapest XI. kerület, Magyarország
					<br />
					E-mail: info@neuropress.hu
					<br />
					Telefon: +36 30 123 4567
				</p>
				<h2 className="text-xl font-medium text-gray-900 mt-8">
					2. A szolgáltatás tárgya
				</h2>
				<p>
					A Neuropress Terápia reflexológián alapuló természetes terápiás
					kezeléseket nyújt (állapotfelmérés, kezelések, felülvizsgálat,
					biorezonancia vizsgálat). A terápia nem helyettesíti az orvosi
					diagnózist és kezelést.
				</p>
				<h2 className="text-xl font-medium text-gray-900 mt-8">
					3. Időpontfoglalás és lemondás
				</h2>
				<p>
					Az időpontokat előre kell egyeztetni telefonon vagy e-mailben. Az
					időpont lemondását legalább 24 órával korábban kell jelezni. Késői
					lemondás esetén a kezelés díja felszámítható.
				</p>
				<h2 className="text-xl font-medium text-gray-900 mt-8">4. Díjak</h2>
				<p>
					Az aktuális díjszabás a weboldalon található Áraink szekciójában
					érhető el. Az árak 2026. február 1-jétől érvényesek.
				</p>
				<h2 className="text-xl font-medium text-gray-900 mt-8">
					5. Panaszkezelés
				</h2>
				<p>
					Panasz esetén keresd a Szolgáltatót az info@neuropress.hu e-mail
					címen. A Szolgáltató 15 napon belül válaszol.
				</p>
				<p className="text-sm text-gray-400 pt-8 border-t border-gray-100">
					Ez az ÁSZF folyamatosan bővítés alatt áll. Javasoljuk, hogy
					rendszeresen ellenőrizd a frissítéseket.
				</p>
			</div>
		</main>
	);
}
