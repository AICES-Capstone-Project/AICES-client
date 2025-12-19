import { Outlet } from "react-router-dom";
import Header from "../Header";
import { Footer } from "../Footer";
import ScrollToTop from "../Layout/ScrollToTop";

export default function MainLayout() {
	return (
		<div>
			<ScrollToTop />
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
