"use client";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
	{ href: "#stories", label: "Sikertörténetek" },
	{ href: "#about", label: "Rólunk" },
	{ href: "#pricing", label: "Árazás" },
	{ href: "#contact", label: "Kapcsolat" },
];

const legalLinks = [
	{ href: "/adatvedelmi-tajekoztato", label: "Adatvédelmi tájékoztató" },
	{ href: "/cookie-szabalyzat", label: "Cookie szabályzat" },
	// { href: "/aszf", label: "Általános szerződési feltételek" },
];

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer
			id="main-footer"
			style={{ backgroundColor: "var(--primary-color)" }}
			className="fixed bottom-0 left-0 right-0 z-0 text-white">
			<div className="max-w-7xl mx-auto px-8 sm:px-4 py-16">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
					<div className="flex flex-col gap-5">
						<Link href="/" className="inline-block w-fit">
							<Image
								src="/logos/3.webp"
								alt="Neuropress Logo"
								width={250}
								height={70}
								className="object-contain brightness-0 invert hidden md:block"
								priority={false}
							/>
						</Link>
						<p className="text-sm font-light text-white/75 leading-relaxed hidden md:block">
							A Neuropress egyedileg továbbfejlesztett, reflexológián alapuló
							komplex terápia, amely feltárja és célzottan kezeli a tünetek
							valódi okait.
						</p>
						<div className="flex gap-3 mt-1">
							<a
								href="https://www.facebook.com/NeuroPress"
								aria-label="Facebook"
								className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors duration-200">
								<i className="fa-brands fa-facebook text-sm" />
							</a>
							<a
								href="https://www.instagram.com/neuropress"
								aria-label="Instagram"
								className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors duration-200">
								<i className="fa-brands fa-instagram text-sm" />
							</a>
							<a
								href="https://www.youtube.com/@neuropressterapia8765"
								aria-label="YouTube"
								className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors duration-200">
								<i className="fa-brands fa-youtube text-sm" />
							</a>
						</div>
					</div>

					<div>
						<h4 className="text-xs font-medium uppercase tracking-widest text-white mb-5">
							Navigáció
						</h4>
						<ul className="flex flex-col gap-3">
							{navLinks.map((link) => (
								<li key={link.href}>
									<a
										href={link.href}
										className="text-sm font-light text-white/80 hover:text-white transition-colors duration-200 flex items-center gap-2 group">
										<i className="fa-solid fa-chevron-right text-xs text-white/40 group-hover:text-white/70 transition-colors" />
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h4 className="text-xs font-medium uppercase tracking-widest text-white mb-5">
							Jogi információk
						</h4>
						<ul className="flex flex-col gap-3">
							{legalLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-sm font-light text-white/80 hover:text-white transition-colors duration-200 flex items-center gap-2 group">
										<i className="fa-solid fa-chevron-right text-xs text-white/40 group-hover:text-white/70 transition-colors" />
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>

			<div className="border-t border-white/20">
				<div className="max-w-7xl mx-auto px-8 sm:px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
					<p className="text-xs font-light text-white/50">
						{`© ${currentYear} Neuropress. Minden jog fenntartva.`}
					</p>
					<p className="text-xs font-light text-white/50">
						{"Fejlesztette: "}
						<a
							href="https://www.prismasolutions.ro"
							className="text-white/70 hover:text-white transition-colors duration-200">
							Prisma Solutions
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
