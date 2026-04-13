import Image from "next/image";
import Hero from "./components/Hero";
import Symptoms from "./components/Symptoms";
import Symptoms2 from "./components/Symptoms2";
import Testimonials from "./components/Testimonials";
import About from "./components/About";
import Process from "./components/Process";
import Prices from "./components/Prices";
import AboutCure from "./components/AboutCure";
import Stories from "./components/Stories";
import Contact from "./components/Contact";

export default function Home() {
	return (
		<main className="relative z-10">
			<Hero />
			<Symptoms2 />
			<Stories />
			<About />
			<Process />
			<Prices />
			<AboutCure />
			<Testimonials />
			<Contact />
		</main>
	);
}
