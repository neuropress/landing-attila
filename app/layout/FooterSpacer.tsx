"use client";
import { useEffect, useState } from "react";

const FooterSpacer = () => {
	const [height, setHeight] = useState(0);

	useEffect(() => {
		const footer = document.getElementById("main-footer");
		if (!footer) return;
		const observer = new ResizeObserver(([entry]) => {
			setHeight(entry.contentRect.height);
		});
		observer.observe(footer);
		return () => observer.disconnect();
	}, []);

	return <div style={{ height }} aria-hidden="true" />;
};

export default FooterSpacer;
