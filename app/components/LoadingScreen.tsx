"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function LoadingScreen() {
	const [phase, setPhase] = useState<"visible" | "exiting" | "hidden">(
		"visible",
	);

	useEffect(() => {
		document.body.style.overflow = "hidden";

		// 3 full cycles × 1.2 s = 3.6 s animation, then 700 ms fade-out
		const exitTimer = setTimeout(() => setPhase("exiting"), 3600);
		const hideTimer = setTimeout(() => {
			setPhase("hidden");
			document.body.style.overflow = "";
		}, 4300);

		return () => {
			clearTimeout(exitTimer);
			clearTimeout(hideTimer);
			document.body.style.overflow = "";
		};
	}, []);

	if (phase === "hidden") return null;

	return (
		<div
			className={`fixed inset-0 z-[200] bg-black flex items-center justify-center transition-opacity duration-700 ${
				phase === "exiting" ? "opacity-0" : "opacity-100"
			}`}>
			<style>{`
        @keyframes npLeft {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.05; }
        }
        @keyframes npRight {
          0%, 100% { opacity: 0.05; }
          50%       { opacity: 1; }
        }
      `}</style>

			{/*
			 * Both halves are stacked at the same position.
			 * 2.webp (teal, black bg) fades in while 4.webp (gray, white bg) fades out,
			 * creating a dark↔light pulsing effect that matches the brand's two-sided logo.
			 */}
			<div className="relative w-52 h-52">
				<div
					className="absolute inset-0"
					style={{ animation: "npLeft 1.2s ease-in-out 3 forwards" }}>
					<Image
						src="/logos/2.webp"
						fill
						alt="Neuropress"
						className="object-contain"
						priority
					/>
				</div>
				<div
					className="absolute inset-0"
					style={{ animation: "npRight 1.2s ease-in-out 3 forwards" }}>
					<Image
						src="/logos/4.webp"
						fill
						alt=""
						className="object-contain"
						priority
					/>
				</div>
			</div>
		</div>
	);
}
