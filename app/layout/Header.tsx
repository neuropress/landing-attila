"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
	{ href: "#stories", label: "Sikertörténetek" },
	{ href: "#about", label: "Rólunk" },
	{ href: "#pricing", label: "Árazás" },
];

const Header = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 10);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<>
			<header
				className={`w-full fixed top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm" : "bg-transparent border-b border-transparent"}`}>
				<nav className="max-w-7xl mx-auto flex items-between items-center h-18 sm:px-4 px-8 bg-transparent">
					{/* Logo and links */}
					<div className="flex items-center gap-8 w-full">
						<Link href="/" className="flex items-center gap-2 shrink-0">
							<Image
								src="/logos/3.webp"
								alt="Neuro Press Logo"
								width={160}
								height={80}
								className="object-contain"
								priority
							/>
						</Link>
						{/* Desktop nav */}
						<ul className="hidden md:flex items-center gap-10 ml-4">
							{navLinks.map((link) => (
								<li key={link.href}>
									<a
										href={link.href}
										className="text-gray-700 hover:text-(--primary-color) transition-colors font-normal px-2 py-1 rounded">
										{link.label}
									</a>
								</li>
							))}
						</ul>
						<a
							href="#contact"
							className="primary-button hidden md:inline-block ml-auto shrink-0">
							Jelentkezem!
						</a>
					</div>
					{/* Hamburger button */}
					<button
						className="md:hidden ml-auto flex items-center justify-center w-10 h-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						aria-label="Open menu"
						onClick={() => setMenuOpen(true)}>
						<span className="sr-only">Open menu</span>
						<svg
							width="24"
							height="24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="w-6 h-6 text-gray-700">
							<line x1="3" y1="6" x2="21" y2="6" />
							<line x1="3" y1="12" x2="21" y2="12" />
							<line x1="3" y1="18" x2="21" y2="18" />
						</svg>
					</button>
				</nav>
			</header>

			{/* Mobile Side Drawer — rendered outside <header> to avoid stacking context issues */}
			{menuOpen && (
				<div className="fixed inset-0 z-100 flex">
					{/* Overlay */}
					<div
						className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
						onClick={() => setMenuOpen(false)}
						aria-hidden="true"
					/>
					{/* Side nav */}
					<aside className="relative w-64 max-w-[80vw] h-full bg-white/80 backdrop-blur-md shadow-lg p-6 flex flex-col animate-slide-in-left">
						<button
							className="absolute top-4 right-4 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
							aria-label="Close menu"
							onClick={() => setMenuOpen(false)}>
							<svg
								width="24"
								height="24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="w-6 h-6 text-gray-700">
								<line x1="18" y1="6" x2="6" y2="18" />
								<line x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</button>
						<Link href="/" className="flex items-center gap-2 mb-8 mt-2">
							<Image
								src="/logos/3.webp"
								alt="Neuro Press Logo"
								width={128}
								height={64}
								className="object-contain"
								priority
							/>
						</Link>
						<ul className="flex flex-col gap-4 mt-4">
							{navLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-gray-700 hover:text-(--primary-color) transition-colors font-normal px-2 py-1 rounded"
										onClick={() => setMenuOpen(false)}>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
						<a
							href="#contact"
							className="primary-button mt-6"
							onClick={() => setMenuOpen(false)}>
							Jelentkezem!
						</a>
					</aside>
				</div>
			)}
			{/* Slide-in animation */}
			<style jsx global>{`
				@keyframes slide-in-left {
					from {
						transform: translateX(-100%);
					}
					to {
						transform: translateX(0);
					}
				}
				.animate-slide-in-left {
					animation: slide-in-left 0.25s cubic-bezier(0.4, 0, 0.2, 1);
				}
			`}</style>
		</>
	);
};

export default Header;
