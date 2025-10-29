import { Outlet } from "react-router-dom";
import Header from "../Header";
import { Footer } from "../Footer";

export default function MainLayout() {
	return (
		<div>
			<header>
				<Header />
			</header>
			<main style={{ marginTop: "60px" }}>
				<Outlet /> {/* renders child route */}
			</main>
			<footer>
				<Footer />
			</footer>
		</div>
	);
}
