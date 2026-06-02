"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import AnimatedContent from "./gsap/AnimatedContent";

const VIDEO_ID = "pTLleXEf1sw";

export default function VideoSection() {
	const [open, setOpen] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [open]);

	return (
		<section className="w-full py-15 bg-[var(--primary-light)]">
			<div className="max-w-4xl mx-auto px-4 md:px-8">
				<AnimatedContent distance={40} duration={0.7} threshold={0.3} className="w-full">
					{/* Thumbnail trigger */}
					<button
						onClick={() => setOpen(true)}
						className="relative w-full rounded-3xl overflow-hidden shadow-xl group cursor-pointer block"
						aria-label="Videó lejátszása"
						style={{ paddingBottom: "56.25%" }}>
						<Image
							src={`https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`}
							alt="Videó előnézet"
							fill
							className="object-cover transition-transform duration-500 group-hover:scale-105"
						/>
						<span className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
						<span className="absolute inset-0 flex items-center justify-center">
							<span className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
								<i className="fa-solid fa-play text-[var(--primary-color)] text-2xl pl-1" />
							</span>
						</span>
					</button>
				</AnimatedContent>
			</div>

			{/* Modal — portalled to document.body to escape any stacking context */}
			{mounted &&
				open &&
				createPortal(
					<div
						role="dialog"
						aria-modal="true"
						aria-label="Videó lejátszó"
						className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/80 p-4"
						onClick={() => setOpen(false)}>
						<div
							className="w-full max-w-4xl"
							onClick={(e) => e.stopPropagation()}>
							{/* 16:9 responsive wrapper — padding-bottom trick works on all browsers/iOS versions */}
							<div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
								<iframe
									className="absolute inset-0 w-full h-full rounded-2xl"
									src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&playsinline=1&rel=0`}
									title="YouTube video player"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
									referrerPolicy="strict-origin-when-cross-origin"
									allowFullScreen
									loading="lazy"
								/>
							</div>
							<button
								onClick={() => setOpen(false)}
								className="mt-4 flex items-center gap-2 ml-auto text-white/80 hover:text-white transition-colors cursor-pointer"
								aria-label="Bezárás">
								<span className="text-sm">Bezárás</span>
								<i className="fa-solid fa-xmark text-lg" />
							</button>
						</div>
					</div>,
					document.body
				)}
		</section>
	);
}
