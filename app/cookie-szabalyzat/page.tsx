import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Cookie szabályzat",
	description:
		"A Neuropress Terápia cookie szabályzata – tájékozódj a sütik használatáról.",
};

export default function CookieSzabalyzat() {
	return (
		<main className="max-w-3xl mx-auto px-8 py-24 min-h-screen">
			<Link
				href="/"
				className="text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8 inline-block">
				← Vissza a főoldalra
			</Link>
			<h1 className="text-3xl font-bold text-gray-900 mb-4">
				Cookie szabályzat
			</h1>
			<p className="text-gray-500 font-light mb-12 text-sm">
				Utolsó frissítés: 2026. január 1.
			</p>
			<div className="prose prose-gray max-w-none font-light text-gray-700 leading-relaxed space-y-6">
				<p>
					Ez a szabályzat leírja, hogyan használja a Neuropress Terápia
					weboldala a sütiket (cookie-kat) és hasonló technológiákat.
				</p>
				<h2 className="text-xl font-medium text-gray-900 mt-8">
					1. Mi az a cookie?
				</h2>
				<p>
					A cookie egy kis szövegfájl, amelyet a weboldalak tárolnak a
					böngésződben, hogy emlékezzenek a beállításaidra és javítsák a
					felhasználói élményt.
				</p>
				<h2 className="text-xl font-medium text-gray-900 mt-8">
					2. Milyen sütiket használunk?
				</h2>
				<p>
					<strong className="font-medium">Szükséges sütik:</strong> Az oldal
					alapvető működéséhez elengedhetetlenek. Ezek nélkül az oldal nem
					működik megfelelően.
					<br />
					<br />
					<strong className="font-medium">Analitikai sütik:</strong> Anonim
					látogatási statisztikák gyűjtésére szolgálnak (pl. Google Analytics),
					hogy javíthassuk az oldal tartalmát.
				</p>
				<h2 className="text-xl font-medium text-gray-900 mt-8">
					3. Sütik kezelése
				</h2>
				<p>
					A böngésződ beállításaiban bármikor törölheted vagy letilthatod a
					sütiket. Ez azonban egyes funkciók működését befolyásolhatja.
				</p>
				<h2 className="text-xl font-medium text-gray-900 mt-8">4. Kapcsolat</h2>
				<p>
					Cookie-kkal kapcsolatos kérdéseid esetén keresd ügyfélszolgálatunkat
					az info@neuropress.hu e-mail címen.
				</p>
				<p className="text-sm text-gray-400 pt-8 border-t border-gray-100">
					Ez a szabályzat folyamatosan bővítés alatt áll.
				</p>
			</div>
		</main>
	);
}
