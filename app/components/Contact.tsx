"use client";
import React, { useState, useEffect } from "react";

const therapyOptions = [
	"Neuropress állapotfelmérés",
	"Neuropress kezelések",
	"Neuropress felülvizsgálat",
	"Biorezonancia vizsgálat",
];

const infoItems = [
	{
		icon: "fa-solid fa-phone",
		label: "Telefon",
		value: "+36 30 123 4567",
		href: "tel:+36301234567",
	},
	{
		icon: "fa-solid fa-envelope",
		label: "E-mail",
		value: "info@neuropress.hu",
		href: "mailto:info@neuropress.hu",
	},
	{
		icon: "fa-solid fa-location-dot",
		label: "Cím",
		value: "Budapest XI. ker., Magyarország",
		href: null,
	},
];

const socialLinks = [
	{ icon: "fa-brands fa-facebook", href: "#", label: "Facebook" },
	{ icon: "fa-brands fa-instagram", href: "#", label: "Instagram" },
	{ icon: "fa-brands fa-youtube", href: "#", label: "YouTube" },
];

type FormState = {
	name: string;
	phone: string;
	email: string;
	therapy: string;
	message: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const emptyForm: FormState = {
	name: "",
	phone: "",
	email: "",
	therapy: "",
	message: "",
};

const Contact = () => {
	const [form, setForm] = useState<FormState>(emptyForm);
	const [errors, setErrors] = useState<Errors>({});
	const [submitted, setSubmitted] = useState(false);

	useEffect(() => {
		const handler = (e: CustomEvent<string>) => {
			setSubmitted(false);
			setForm((prev) => ({ ...prev, therapy: e.detail }));
		};
		window.addEventListener("selectTherapy", handler as EventListener);
		return () => window.removeEventListener("selectTherapy", handler as EventListener);
	}, []);

	const validate = (): Errors => {
		const e: Errors = {};
		if (!form.name.trim()) e.name = "A név megadása kötelező.";
		if (!form.phone.trim()) e.phone = "A telefonszám megadása kötelező.";
		if (!form.email.trim()) {
			e.email = "Az e-mail cím megadása kötelező.";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
			e.email = "Érvényes e-mail címet adj meg.";
		}
		if (!form.therapy) e.therapy = "Kérjük, válassz egy terápiát.";
		if (!form.message.trim()) e.message = "Az üzenet megadása kötelező.";
		return e;
	};

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
		if (errors[name as keyof FormState]) {
			setErrors((prev) => ({ ...prev, [name]: undefined }));
		}
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const e2 = validate();
		if (Object.keys(e2).length > 0) {
			setErrors(e2);
			return;
		}
		// API call will go here
		setSubmitted(true);
	};

	const inputBase =
		"w-full rounded-lg border bg-white px-4 py-3 text-sm font-light text-gray-800 placeholder:text-gray-400 outline-none transition-colors focus:border-(--primary-color) focus:ring-2 focus:ring-(--primary-color)/20";
	const inputNormal = "border-gray-200";
	const inputError = "border-red-400 focus:border-red-400 focus:ring-red-100";

	return (
		<section id="contact" className="w-full py-20 bg-white">
			<div className="max-w-7xl mx-auto px-8 sm:px-4">
				<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-center">
					Vedd fel velünk a kapcsolatot!
				</h2>
				<p className="text-lg font-light text-gray-500 text-center mb-16 w-full lg:w-1/2 mx-auto">
					Töltsd ki az űrlapot és hamarosan felvesszük veled a kapcsolatot az
					időpontegyeztetés érdekében.
				</p>

				<div className="flex flex-col lg:flex-row gap-10 items-start">
					{/* Left: contact info */}
					<div className="w-full lg:w-2/5 bg-primary-light rounded-2xl p-8 flex flex-col gap-8">
						<div>
							<h3 className="text-lg font-medium text-gray-900 mb-6">
								Elérhetőségeink
							</h3>
							<ul className="flex flex-col gap-5">
								{infoItems.map((item) => (
									<li key={item.label} className="flex items-start gap-4">
										<div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
											<i className={`${item.icon} text-(--primary-color) text-sm`} />
										</div>
										<div>
											<p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-0.5">
												{item.label}
											</p>
											{item.href ? (
												<a
													href={item.href}
													className="text-sm font-light text-gray-700 hover:text-(--primary-color) transition-colors">
													{item.value}
												</a>
											) : (
												<p className="text-sm font-light text-gray-700">
													{item.value}
												</p>
											)}
										</div>
									</li>
								))}
							</ul>
						</div>

						<div className="border-t border-gray-200" />

						<div>
							<p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">
								Kövess minket
							</p>
							<div className="flex gap-3">
								{socialLinks.map((s) => (
									<a
										key={s.label}
										href={s.href}
										aria-label={s.label}
										className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-(--primary-color) hover:text-white text-gray-500 transition-colors duration-200">
										<i className={`${s.icon} text-sm`} />
									</a>
								))}
							</div>
						</div>
					</div>

					{/* Right: form */}
					<div className="w-full lg:flex-1">
						{submitted ? (
							<div className="h-full flex flex-col items-center justify-center text-center py-16 gap-4">
								<div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mb-2">
									<i className="fa-solid fa-circle-check text-(--primary-color) text-3xl" />
								</div>
								<h3 className="text-xl font-medium text-gray-900">
									Köszönjük az üzeneted!
								</h3>
								<p className="text-gray-500 font-light">
									Hamarosan felvesszük veled a kapcsolatot.
								</p>
								<button
									onClick={() => {
										setForm(emptyForm);
										setSubmitted(false);
									}}
									className="mt-4 text-sm text-(--primary-color) hover:text-(--primary-dark) font-normal transition-colors">
									Új üzenet küldése
								</button>
							</div>
						) : (
							<form
								onSubmit={handleSubmit}
								noValidate
								className="flex flex-col gap-5">
								{/* Name */}
								<div>
									<label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-1.5">
										Teljes név <span className="text-red-400">*</span>
									</label>
									<input
										type="text"
										name="name"
										value={form.name}
										onChange={handleChange}
										placeholder="Pl. Kovács Anna"
										className={`${inputBase} ${errors.name ? inputError : inputNormal}`}
									/>
									{errors.name && (
										<p className="mt-1 text-xs text-red-500">{errors.name}</p>
									)}
								</div>

								{/* Phone + Email */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
									<div>
										<label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-1.5">
											Telefonszám <span className="text-red-400">*</span>
										</label>
										<input
											type="tel"
											name="phone"
											value={form.phone}
											onChange={handleChange}
											placeholder="+36 30 000 0000"
											className={`${inputBase} ${errors.phone ? inputError : inputNormal}`}
										/>
										{errors.phone && (
											<p className="mt-1 text-xs text-red-500">
												{errors.phone}
											</p>
										)}
									</div>
									<div>
										<label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-1.5">
											E-mail cím <span className="text-red-400">*</span>
										</label>
										<input
											type="email"
											name="email"
											value={form.email}
											onChange={handleChange}
											placeholder="pelda@email.hu"
											className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
										/>
										{errors.email && (
											<p className="mt-1 text-xs text-red-500">
												{errors.email}
											</p>
										)}
									</div>
								</div>

								{/* Therapy picker */}
								<div>
									<label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-1.5">
										Érdeklődés tárgya <span className="text-red-400">*</span>
									</label>
									<select
										name="therapy"
										value={form.therapy}
										onChange={handleChange}
										className={`${inputBase} ${errors.therapy ? inputError : inputNormal} appearance-none`}>
										<option value="">Válassz terápiát…</option>
										{therapyOptions.map((opt) => (
											<option key={opt} value={opt}>
												{opt}
											</option>
										))}
									</select>
									{errors.therapy && (
										<p className="mt-1 text-xs text-red-500">
											{errors.therapy}
										</p>
									)}
								</div>

								{/* Message */}
								<div>
									<label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-1.5">
										Üzenet <span className="text-red-400">*</span>
									</label>
									<textarea
										name="message"
										value={form.message}
										onChange={handleChange}
										rows={5}
										placeholder="Írd le röviden a panaszaidat vagy kérdéseidet…"
										className={`${inputBase} resize-none ${errors.message ? inputError : inputNormal}`}
									/>
									{errors.message && (
										<p className="mt-1 text-xs text-red-500">
											{errors.message}
										</p>
									)}
								</div>

								<button
									type="submit"
									className="primary-button self-start px-8 py-3 rounded-lg">
									Üzenet küldése
									<i className="fa-solid fa-paper-plane ml-2 text-sm" />
								</button>
							</form>
						)}
					</div>
				</div>
			</div>
		</section>
	);
};

export default Contact;
