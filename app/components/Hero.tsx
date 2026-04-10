import React from "react";
import Image from "next/image";

const Hero = () => {
	return (
		<div className="min-h-screen flex flex-col bg-primary-light justify-center items-start relative overflow-hidden">
			<div className="max-w-7xl mx-auto flex flex-col text-left px-8 md:px-0 z-10 w-full md:w-2/5 md:ml-8 lg:ml-20 xl:ml-32">
				<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
					Feltárjuk szűnni nem akaró kellemetlen tüneteid okait és célzottan
					kezeljük azokat!
				</h1>
				<p className="text-lg md:text-xl text-gray-700 mb-8 font-light">
					Neuropress - egyedileg továbbfejlesztett, reflexológián alapuló
					komplex terápia
				</p>
				<div>
					<a href="#contact" className="primary-button inline-block">
						Jelentkezem állapotfelmérésre!
					</a>
				</div>
			</div>
			<div
				className="hidden sm:block absolute bg-primary rounded-[100px] w-[500px] h-[500px] md:w-[700px] md:h-[700px] lg:w-[800px] lg:h-[800px]  right-[-60px] md:right-[-80px] lg:right-[-100px]  top-[-120px] md:top-[-160px] lg:top-[-200px]  rotate-[-12deg] overflow-hidden"
				aria-hidden="true">
				<Image
					src="/images/attila.webp"
					alt="Vargha Attila, a Neuropress Terápia alapítója"
					className="w-[130%] h-[130%] object-cover object-center rotate-[12deg] left-[-15%] top-[20%] absolute"
					draggable="false"
					style={{ pointerEvents: "none", userSelect: "none" }}
					width={2000}
					height={2000}
					priority
				/>
			</div>
		</div>
	);
};

export default Hero;
