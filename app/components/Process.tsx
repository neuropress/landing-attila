import React from "react";
import Link from "next/link";

const steps = [
	{
		icon: "fa-solid fa-file-pen",
		title: "Jelentkezz az űrlapon!",
		description:
			"Töltsd ki a jelentkezési űrlapot, és indítsd el az utadat a tünetmentes élet felé.",
	},
	{
		icon: "fa-solid fa-phone",
		title: "Időpontegyeztetés",
		description:
			"Felvesszük veled a kapcsolatot és időpontot egyeztetünk telefonon.",
	},
	{
		icon: "fa-solid fa-clipboard-list",
		title: "Állapotfelmérés",
		description:
			"Eljössz egy állapotfelmérésre, ahol részletesen feltérképezzük tüneteid és egészségtörténeted.",
	},
	{
		icon: "fa-solid fa-hand-holding-medical",
		title: "Személyre szabott kezelések",
		description:
			"Személyre szabott kezeléseken veszel részt, amelyeket az állapotfelmérés alapján állítunk össze.",
	},
	{
		icon: "fa-solid fa-chart-line",
		title: "Felülvizsgálat",
		description:
			"Állapotod javulását rendszeres felülvizsgálatokkal követjük nyomon és finomhangoljuk a terápiát.",
	},
];

const Process = () => {
	return (
		<section className="w-full pb-20 bg-white">
			<div className="max-w-7xl mx-auto px-4 md:px-8">
				<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-center">
					Hogyan működik a terápia?
				</h2>
				<p className="text-lg font-light text-gray-500 text-center mb-16 w-full lg:w-1/2 mx-auto">
					Öt egyszerű lépésben a tünetmentes, kiegyensúlyozottabb élethez.
				</p>

				{/* Desktop: horizontal stepper */}
				<div className="hidden md:flex items-start">
					{steps.map((step, index) => (
						<React.Fragment key={index}>
							<div className="flex flex-col items-center text-center flex-1">
								{/* Circle */}
								<div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mb-5 ring-2 ring-white shadow-sm shrink-0">
									<i
										className={`${step.icon} text-(--primary-color) text-xl`}
									/>
								</div>
								{/* Step number */}
								<span className="text-xs font-medium text-(--primary-color) uppercase tracking-widest mb-2">
									{String(index + 1).padStart(2, "0")}
								</span>
								<h3 className="text-base font-medium text-gray-900 mb-2">
									{step.title}
								</h3>
								<p className="text-sm font-light text-gray-500 leading-relaxed max-w-45">
									{step.description}
								</p>
							</div>

							{/* Connector line between steps */}
							{index < steps.length - 1 && (
								<div className="flex-1 flex items-start pt-8 max-w-20">
									<div className="w-full border-t-2 border-dashed border-gray-200" />
								</div>
							)}
						</React.Fragment>
					))}
				</div>

				{/* Mobile: vertical stepper */}
				<div className="flex md:hidden flex-col gap-0">
					{steps.map((step, index) => (
						<div key={index} className="flex gap-5">
							{/* Left: circle + connector */}
							<div className="flex flex-col items-center">
								<div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center ring-2 ring-white shadow-sm shrink-0">
									<i
										className={`${step.icon} text-(--primary-color) text-base`}
									/>
								</div>
								{index < steps.length - 1 && (
									<div className="flex-1 w-px border-l-2 border-dashed border-gray-200 my-2" />
								)}
							</div>

							{/* Right: content */}
							<div className="pb-8">
								<span className="text-xs font-medium text-(--primary-color) uppercase tracking-widest">
									{String(index + 1).padStart(2, "0")}
								</span>
								<h3 className="text-base font-medium text-gray-900 mt-1 mb-1">
									{step.title}
								</h3>
								<p className="text-sm font-light text-gray-500 leading-relaxed">
									{step.description}
								</p>
							</div>
						</div>
					))}
				</div>
				<div className="w-full h-16 flex items-center justify-center mt-10">
					<Link
						href="#contact"
						className="primary-button inline-block mx-auto py-2">
						Jelentkezem állapotfelmérésre!
					</Link>
				</div>
			</div>
		</section>
	);
};

export default Process;
