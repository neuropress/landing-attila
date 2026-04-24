"use server";

import nodemailer from "nodemailer";

const LOCATION_EMAILS: Record<string, string> = {
	"Budapest XI. ker": "neuropress11@gmail.com",
	Szeged: "vargha.szeged@gmail.com",
	Kecskemét: "vargha.kecskemet@gmail.com",
};

const THERAPY_OPTIONS = new Set([
	"Neuropress állapotfelmérés",
	"Neuropress kezelések",
	"Neuropress felülvizsgálat",
	"Biorezonancia vizsgálat",
]);

export type ContactInput = {
	name: string;
	phone: string;
	email: string;
	therapy: string;
	location: string;
	message: string;
};

export type ContactResult =
	| { ok: true }
	| {
			ok: false;
			error: string;
			fieldErrors?: Partial<Record<keyof ContactInput, string>>;
	  };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendContactEmail(
	input: ContactInput,
): Promise<ContactResult> {
	const name = (input.name ?? "").trim();
	const phone = (input.phone ?? "").trim();
	const email = (input.email ?? "").trim();
	const therapy = (input.therapy ?? "").trim();
	const location = (input.location ?? "").trim();
	const message = (input.message ?? "").trim();

	const fieldErrors: Partial<Record<keyof ContactInput, string>> = {};
	if (!name) fieldErrors.name = "A név megadása kötelező.";
	if (!phone) fieldErrors.phone = "A telefonszám megadása kötelező.";
	if (!email) fieldErrors.email = "Az e-mail cím megadása kötelező.";
	else if (!EMAIL_REGEX.test(email))
		fieldErrors.email = "Érvényes e-mail címet adj meg.";
	if (!therapy) fieldErrors.therapy = "Kérjük, válassz egy terápiát.";
	else if (!THERAPY_OPTIONS.has(therapy))
		fieldErrors.therapy = "Érvénytelen terápia.";
	if (!location) fieldErrors.location = "Kérjük, válassz egy rendelőt.";
	else if (!(location in LOCATION_EMAILS))
		fieldErrors.location = "Érvénytelen rendelő.";
	if (!message) fieldErrors.message = "Az üzenet megadása kötelező.";

	if (Object.keys(fieldErrors).length > 0) {
		return { ok: false, error: "Érvénytelen űrlap.", fieldErrors };
	}

	const host = process.env.SMTP_HOST;
	const port = process.env.SMTP_PORT;
	const user = process.env.SMTP_USER;
	const pass = process.env.SMTP_PASS;
	if (!host || !port || !user || !pass) {
		console.error("Missing SMTP configuration");
		return { ok: false, error: "Szerverhiba. Próbáld újra később." };
	}

	const portNumber = Number(port);
	const from = process.env.SMTP_FROM ?? user;
	const operatorTo = LOCATION_EMAILS[location];

	const transporter = nodemailer.createTransport({
		host,
		port: portNumber,
		secure: portNumber === 465,
		auth: { user, pass },
	});

	const operatorText = [
		"Új megkeresés érkezett a NeuroPress landing oldalról:",
		"",
		`Név: ${name}`,
		`Telefon: ${phone}`,
		`E-mail: ${email}`,
		`Érdeklődés tárgya: ${therapy}`,
		`Rendelő: ${location}`,
		"",
		"Üzenet:",
		message,
	].join("\n");

	const userText = [
		`Kedves ${name}!`,
		"",
		"Köszönjük, hogy felvetted velünk a kapcsolatot! Az alábbi adatokkal érkezett meg az üzeneted, hamarosan jelentkezünk az időpontegyeztetés érdekében.",
		"",
		`Érdeklődés tárgya: ${therapy}`,
		`Rendelő: ${location}`,
		"",
		"Üzeneted:",
		message,
		"",
		"Üdvözlettel,",
		"NeuroPress csapat",
	].join("\n");

	try {
		await Promise.all([
			transporter.sendMail({
				from,
				to: operatorTo,
				replyTo: email,
				subject: `Új üzenet a NeuroPress honlapról – ${location}`,
				text: operatorText,
			}),
			transporter.sendMail({
				from,
				to: email,
				subject: "Köszönjük a megkeresésed – NeuroPress",
				text: userText,
			}),
		]);
	} catch (err) {
		console.error("Failed to send contact email:", err);
		return {
			ok: false,
			error: "Nem sikerült elküldeni az üzenetet. Próbáld újra később.",
		};
	}

	return { ok: true };
}
