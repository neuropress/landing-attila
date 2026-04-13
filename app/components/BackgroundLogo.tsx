import Image from "next/image";
import React from "react";

interface BackgroundLogoProps {
	orientation?: "left" | "right";
}

const BackgroundLogo = ({ orientation }: BackgroundLogoProps) => {
	return (
		<>
			{orientation === "left" ? (
				<div className="absolute bottom-0 left-0 w-full h-full opacity-7 pointer-events-none select-none transform -translate-x-[50%]">
					<Image
						src="/logos/4.webp"
						alt="Neuropress logó vízjeles háttérben"
						fill
						className="object-contain object-center"
						draggable="false"
						style={{ pointerEvents: "none", userSelect: "none" }}
					/>
				</div>
			) : (
				<div className="absolute bottom-0 right-0 w-full h-full opacity-7 pointer-events-none select-none transform translate-x-[50%]">
					<Image
						src="/logos/2.webp"
						alt="Neuropress logó vízjeles háttérben"
						fill
						className="object-contain object-center"
						draggable="false"
						style={{ pointerEvents: "none", userSelect: "none" }}
					/>
				</div>
			)}
		</>
	);
};

export default BackgroundLogo;
