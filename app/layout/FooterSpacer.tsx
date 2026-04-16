"use client";
import { useEffect, useState } from "react";

const FooterSpacer = () => {
	const [height, setHeight] = useState(0);

	useEffect(() => {
		const footer = document.getElementById("main-footer") as HTMLElement | null;
		if (!footer) return;
		const update = () => setHeight(footer.offsetHeight);
		update();
		const observer = new ResizeObserver(update);
		observer.observe(footer);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (!height) return;

		const snapToBottom = () => {
			const active = document.activeElement;
			const keyboardOpen =
				active instanceof HTMLInputElement ||
				active instanceof HTMLTextAreaElement ||
				active instanceof HTMLSelectElement;
			if (keyboardOpen) return;

			const maxScroll =
				document.documentElement.scrollHeight - window.innerHeight;
			const remaining = maxScroll - window.scrollY;
			if (remaining > 0 && remaining < height * 0.2) {
				window.scrollTo({ top: maxScroll, behavior: "smooth" });
			}
		};

		let timer: ReturnType<typeof setTimeout>;
		const onScroll = () => {
			clearTimeout(timer);
			timer = setTimeout(snapToBottom, 120);
		};

		window.addEventListener("scrollend", snapToBottom);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			window.removeEventListener("scrollend", snapToBottom);
			window.removeEventListener("scroll", onScroll);
			clearTimeout(timer);
		};
	}, [height]);

	return <div style={{ height }} aria-hidden="true" />;
};

export default FooterSpacer;
