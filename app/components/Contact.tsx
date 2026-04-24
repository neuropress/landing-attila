"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AnimatedContent from "./gsap/AnimatedContent";
import FadeContent from "./gsap/FadeContent";
import { sendContactEmail } from "@/app/actions/contact";

const therapyOptions = [
	"Neuropress állapotfelmérés",
	"Neuropress kezelések",
	"Neuropress felülvizsgálat",
	"Biorezonancia vizsgálat",
];

const locationOptions = ["Budapest XI. ker", "Szeged", "Kecskemét"];

const locations: Record<
	string,
	{
		address: string;
		phone: string;
		phoneHref: string;
		hours: string;
		email: string;
	}
> = {
	"Budapest XI. ker": {
		address: "1117 Budapest, Fehérvári út 23. I/11.",
		phone: "+36-30/434-7094",
		phoneHref: "tel:+36304347094",
		hours: "Hétfő – Péntek 07:00 – 21:00",
		email: "neuropress11@gmail.com",
	},
	Szeged: {
		address: "6724 Szeged, Kálvária tér 16. I/D",
		phone: "+36-30/372-4600",
		phoneHref: "tel:+36303724600",
		hours: "Hétfő – Péntek 07:00 – 21:00",
		email: "vargha.szeged@gmail.com",
	},
	Kecskemét: {
		address: "6000 Kecskemét, Vízöntő u. 9.",
		phone: "+36-30/944-2528",
		phoneHref: "tel:+36309442528",
		hours: "Hétfő – Péntek 07:00 – 21:00",
		email: "vargha.kecskemet@gmail.com",
	},
};

const socialLinks = [
	{
		icon: "fa-brands fa-facebook",
		href: "https://www.facebook.com/NeuroPress",
		label: "Facebook",
	},
	{
		icon: "fa-brands fa-instagram",
		href: "https://www.instagram.com/neuropress",
		label: "Instagram",
	},
	{
		icon: "fa-brands fa-youtube",
		href: "https://www.youtube.com/@neuropressterapia8765",
		label: "YouTube",
	},
];

type FormState = {
	name: string;
	phone: string;
	email: string;
	therapy: string;
	location: string;
	message: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const emptyForm: FormState = {
	name: "",
	phone: "",
	email: "",
	therapy: "",
	location: "Budapest XI. ker",
	message: "",
};

const Contact = () => {
	const router = useRouter();
	const [form, setForm] = useState<FormState>(emptyForm);
	const [errors, setErrors] = useState<Errors>({});
	const [sending, setSending] = useState(false);
	const [cardLocation, setCardLocation] = useState<string>("Budapest XI. ker");

	useEffect(() => {
		const handler = (e: CustomEvent<string>) => {
			setForm((prev) => ({ ...prev, therapy: e.detail }));
		};
		window.addEventListener("selectTherapy", handler as EventListener);
		return () =>
			window.removeEventListener("selectTherapy", handler as EventListener);
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
		if (!form.location) e.location = "Kérjük, válassz egy rendelőt.";
		if (!form.message.trim()) e.message = "Az üzenet megadása kötelező.";
		return e;
	};

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
		if (name === "location" && value) setCardLocation(value);
		if (errors[name as keyof FormState]) {
			setErrors((prev) => ({ ...prev, [name]: undefined }));
		}
	};

	const [submitError, setSubmitError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const e2 = validate();
		if (Object.keys(e2).length > 0) {
			setErrors(e2);
			return;
		}
		setSubmitError(null);
		setSending(true);
		try {
			const result = await sendContactEmail(form);
			if (result.ok) {
				router.push("/koszonjuk");
				return;
			}
			if (result.fieldErrors) {
				setErrors(result.fieldErrors);
			}
			setSubmitError(result.error);
		} catch (err) {
			console.error(err);
			setSubmitError(
				"Nem sikerült elküldeni az üzenetet. Próbáld újra később.",
			);
		} finally {
			setSending(false);
		}
	};

	const inputBase =
		"w-full rounded-lg border bg-white px-4 py-3 text-base font-light text-gray-800 placeholder:text-gray-400 outline-none transition-colors focus:border-(--primary-color) focus:ring-2 focus:ring-(--primary-color)/20";
	const inputNormal = "border-gray-200";
	const inputError = "border-red-400 focus:border-red-400 focus:ring-red-100";

	return (
		<section className="w-full py-20 bg-white">
			<div className="max-w-7xl mx-auto px-4 md:px-8">
				<AnimatedContent
					distance={40}
					duration={0.7}
					threshold={0.3}
					className="w-full">
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-center">
						Vedd fel velünk a kapcsolatot!
					</h2>
				</AnimatedContent>
				<AnimatedContent
					distance={40}
					duration={0.7}
					threshold={0.3}
					className="w-full">
					<p className="text-lg font-light text-gray-500 text-center mb-16 w-full lg:w-1/2 mx-auto">
						{
							"Töltsd ki az \u0171rlapot és hamarosan felvesszük veled a kapcsolatot az id\u0151pontegyeztetés érdekében."
						}
					</p>
				</AnimatedContent>

				<div className="flex flex-col lg:flex-row gap-10 items-start">
					{/* Left: contact info */}
					<AnimatedContent
						distance={40}
						duration={0.7}
						threshold={0.3}
						className="w-full lg:w-2/5 bg-primary-light rounded-2xl p-8 flex flex-col gap-8">
						<div>
							<h3 className="text-lg font-medium text-gray-900 mb-4">
								{"Elérhet\u0151ségeink"}
							</h3>
							{/* Location badge picker */}
							<div className="flex flex-wrap gap-2 mb-6">
								{locationOptions.map((loc) => (
									<button
										key={loc}
										type="button"
										onClick={() => setCardLocation(loc)}
										className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
											cardLocation === loc
												? "bg-(--primary-color) text-white"
												: "bg-white text-gray-500 hover:text-gray-800"
										}`}>
										{loc}
									</button>
								))}
							</div>
							<ul className="flex flex-col gap-5">
								<li className="flex items-start gap-4">
									<div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
										<i className="fa-solid fa-location-dot text-(--primary-color) text-sm" />
									</div>
									<div>
										<p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-0.5">
											{cardLocation}
										</p>
										<p className="text-sm font-light text-gray-700">
											{locations[cardLocation].address}
										</p>
									</div>
								</li>
								<li className="flex items-start gap-4">
									<div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
										<i className="fa-solid fa-phone text-(--primary-color) text-sm" />
									</div>
									<div>
										<p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-0.5">
											{"Telefon"}
										</p>
										<a
											href={locations[cardLocation].phoneHref}
											className="text-sm font-light text-gray-700 hover:text-(--primary-color) transition-colors">
											{locations[cardLocation].phone}
										</a>
									</div>
								</li>
								<li className="flex items-start gap-4">
									<div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
										<i className="fa-solid fa-clock text-(--primary-color) text-sm" />
									</div>
									<div>
										<p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-0.5">
											{"Nyitvatartás"}
										</p>
										<p className="text-sm font-light text-gray-700">
											{locations[cardLocation].hours}
										</p>
									</div>
								</li>
								<li className="flex items-start gap-4">
									<div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
										<i className="fa-solid fa-envelope text-(--primary-color) text-sm" />
									</div>
									<div>
										<p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-0.5">
											{"E-mail"}
										</p>
										<a
											href={`mailto:${locations[cardLocation].email}`}
											className="text-sm font-light text-gray-700 hover:text-(--primary-color) transition-colors">
											{locations[cardLocation].email}
										</a>
									</div>
								</li>
							</ul>
						</div>

						<div className="border-t border-gray-200" />

						<div>
							<p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">
								{"Kövess minket"}
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
					</AnimatedContent>

					{/* Right: form */}
					<FadeContent className="w-full lg:flex-1">
						<form
							id="contact"
							onSubmit={handleSubmit}
							noValidate
							className="flex flex-col gap-5">
							{/* Name */}
							<div>
								<label className="section-label block mb-1.5">
									{"Teljes név"} <span className="text-red-400">*</span>
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
									<label className="section-label block mb-1.5">
										{"Telefonszám"} <span className="text-red-400">*</span>
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
										<p className="mt-1 text-xs text-red-500">{errors.phone}</p>
									)}
								</div>
								<div>
									<label className="section-label block mb-1.5">
										{"E-mail cím"} <span className="text-red-400">*</span>
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
										<p className="mt-1 text-xs text-red-500">{errors.email}</p>
									)}
								</div>
							</div>

							{/* Therapy picker */}
							<div>
								<label className="section-label block mb-1.5">
									{"Érdeklődés tárgya"} <span className="text-red-400">*</span>
								</label>
								<select
									name="therapy"
									value={form.therapy}
									onChange={handleChange}
									className={`${inputBase} ${errors.therapy ? inputError : inputNormal} appearance-none`}>
									<option value="">{"Válassz terápiát\u2026"}</option>
									{therapyOptions.map((opt) => (
										<option key={opt} value={opt}>
											{opt}
										</option>
									))}
								</select>
								{errors.therapy && (
									<p className="mt-1 text-xs text-red-500">{errors.therapy}</p>
								)}
							</div>

							{/* Location picker */}
							<div>
								<label className="section-label block mb-1.5">
									{"Melyik rendelőben szeretnéd igénybe venni a szolgáltatást?"}{" "}
									<span className="text-red-400">*</span>
								</label>
								<select
									name="location"
									value={form.location}
									onChange={handleChange}
									className={`${inputBase} ${errors.location ? inputError : inputNormal} appearance-none`}>
									<option value="">{"Válassz rendelőt\u2026"}</option>
									{locationOptions.map((opt) => (
										<option key={opt} value={opt}>
											{opt}
										</option>
									))}
								</select>
								{errors.location && (
									<p className="mt-1 text-xs text-red-500">{errors.location}</p>
								)}
							</div>

							{/* Message */}
							<div>
								<label className="section-label block mb-1.5">
									{"Üzenet"} <span className="text-red-400">*</span>
								</label>
								<textarea
									name="message"
									value={form.message}
									onChange={handleChange}
									rows={5}
									placeholder={
										"Írd le röviden a panaszaidat vagy kérdéseidet\u2026"
									}
									className={`${inputBase} resize-none ${errors.message ? inputError : inputNormal}`}
								/>
								{errors.message && (
									<p className="mt-1 text-xs text-red-500">{errors.message}</p>
								)}
							</div>

							{submitError && (
								<p className="text-sm text-red-500" aria-live="polite">
									{submitError}
								</p>
							)}

							<button
								type="submit"
								disabled={sending}
								className="primary-button self-start px-8 py-3 rounded-lg flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-opacity">
								{sending ? (
									<>
										<i className="fa-solid fa-circle-notch animate-spin text-sm" />
										{"Küldés..."}
									</>
								) : (
									<>
										{"Üzenet küldése"}
										<i className="fa-solid fa-paper-plane text-sm" />
									</>
								)}
							</button>
						</form>
					</FadeContent>
				</div>
			</div>
		</section>
	);
};

export default Contact;
