import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import FooterSpacer from "./layout/FooterSpacer";
import LoadingScreen from "./components/LoadingScreen";
import Script from "next/script";

const montserrat = Montserrat({
	subsets: ["latin", "latin-ext"],
	variable: "--font-montserrat",
	weight: ["300", "400", "500", "600", "700", "800"],
	style: ["normal", "italic"],
	display: "swap",
});

// const geistMono = Geist_Mono({
// 	variable: "--font-geist-mono",
// 	subsets: ["latin"],
// });

export const metadata: Metadata = {
	title: {
		default: "Neuropress Terápia | Reflexológia & Biorezonancia Budapest",
		template: "%s | Neuropress Terápia",
	},
	description:
		"Reflexológián alapuló Neuropress terápia – tartós megoldás fejfájásra, stresszre és alvászavarra. Személyre szabott kezelés Budapesten és vidéken.",
	keywords: [
		"neuropress terápia",
		"reflexológia Budapest",
		"biorezonancia vizsgálat",
		"fejfájás természetes kezelés",
		"alvászavar terápia",
		"stressz kezelés",
		"természetgyógyászat Budapest",
		"idegrendszer kezelés",
		"Vargha Attila terapeuta",
		"személyre szabott terápia",
		"migrén kezelés",
		"immunrendszer erősítés",
	],
	authors: [{ name: "Vargha Attila" }],
	creator: "Neuropress Terápia",
	publisher: "Neuropress Terápia",
	metadataBase: new URL("https://neuropress.hu"),
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		locale: "hu_HU",
		url: "https://neuropress.hu",
		title: "Neuropress Terápia | Reflexológia & Biorezonancia Budapest",
		description:
			"Tartós megoldás fejfájásra, stresszre és alvászavarra. Neuropress reflexológiai terápia Budapesten – személyre szabott kezelés, 20+ év tapasztalattal.",
		siteName: "Neuropress Terápia",
		images: [
			{
				url: "/images/og-image.webp",
				width: 1200,
				height: 630,
				alt: "Neuropress Terápia – Reflexológia és Biorezonancia Budapest",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Neuropress Terápia | Reflexológia & Biorezonancia Budapest",
		description:
			"Tartós megoldás fejfájásra, stresszre és alvászavarra. Személyre szabott Neuropress reflexológiai terápia Budapesten.",
		images: ["/images/twitter-image.webp"],
		creator: "@neuropress",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	icons: {
		icon: [
			{ url: "/favicon/favicon.ico", sizes: "any" },
			{ url: "/favicon/favicon.svg", type: "image/svg+xml" },
			{ url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
		],
		apple: [
			{
				url: "/favicon/apple-touch-icon.png",
				sizes: "180x180",
				type: "image/png",
			},
		],
	},
	manifest: "/favicon/site.webmanifest",
	verification: {
		google: "your-google-verification-code",
		yandex: "your-yandex-verification-code",
	},
	category: "technology",
	other: {
		"theme-color": "#199ba9",
		"mobile-web-app-capable": "yes",
		"apple-mobile-web-app-capable": "yes",
		"apple-mobile-web-app-status-bar-style": "default",
		"apple-mobile-web-app-title": "NeuroPress",
		"application-name": "NeuroPress",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="hu" className={`h-full antialiased ${montserrat.variable}`}>
			<head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=5"
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "HealthAndBeautyBusiness",
							name: "Neuropress Terápia",
							description:
								"Reflexológián alapuló Neuropress terápia – tartós megoldás fejfájásra, stresszre és alvászavarra. Személyre szabott kezelés Budapesten és vidéken.",
							url: "https://neuropress.hu",
							telephone: "+36301234567",
							founder: {
								"@type": "Person",
								name: "Vargha Attila",
								jobTitle: "Vezető terapeuta, alapító",
							},
							address: {
								"@type": "PostalAddress",
								addressLocality: "Budapest",
								addressRegion: "Budapest",
								addressCountry: "HU",
								description: "XI. kerület",
							},
							areaServed: [
								{ "@type": "City", name: "Budapest" },
								{ "@type": "City", name: "Kecskemét" },
								{ "@type": "City", name: "Szeged" },
								{ "@type": "City", name: "Győr" },
							],
							sameAs: [
								"https://www.facebook.com/NeuroPress",
								"https://www.instagram.com/neuropress",
								"https://www.youtube.com/@neuropressterapia8765",
							],
							priceRange: "13 500 Ft – 45 000 Ft",
							currenciesAccepted: "HUF, EUR",
							openingHours: "Mo-Fr 08:00-18:00",
						}),
					}}
				/>
			</head>
			<body className="min-h-full flex flex-col">
				<Script
					src="https://kit.fontawesome.com/0e7d01b6b6.js"
					crossOrigin="anonymous"
					strategy="afterInteractive"
				/>
				<Header />
				<div className="flex-grow relative z-10 bg-white w-full">
					{children}
				</div>
				<FooterSpacer />
				<Footer />
			</body>
		</html>
	);
}
