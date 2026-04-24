declare module "nodemailer" {
	export type Transporter = {
		sendMail(opts: Record<string, unknown>): Promise<unknown>;
	};

	export function createTransport(opts: Record<string, unknown>): Transporter;

	const nodemailer: {
		createTransport: typeof createTransport;
	};

	export default nodemailer;
}
