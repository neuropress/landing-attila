import type { Metadata } from "next";
import KoszonjukContent from "./KoszonjukContent";

export const metadata: Metadata = {
	title: "Köszönjük",
	robots: { index: false, follow: false },
};

export default function KoszonjukPage() {
	return <KoszonjukContent />;
}
