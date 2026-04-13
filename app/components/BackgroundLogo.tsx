import Image from "next/image";
import React from "react";

const BackgroundLogo = () => {
	return (
		<div className="absolute bottom-0 right-0 w-full h-full opacity-7 pointer-events-none select-none transform translate-x-[30%] translate-y-[10%] rotate-30">
			<Image
				src="/logos/1.webp"
				alt="Neuropress logó vízjeles háttérben"
				fill
				className="object-contain object-center"
				draggable="false"
				style={{ pointerEvents: "none", userSelect: "none" }}
			/>
		</div>
	);
};

export default BackgroundLogo;
