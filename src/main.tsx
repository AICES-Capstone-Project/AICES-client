import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

// font
import "@fontsource/inter/400.css"; // Regular
import "@fontsource/inter/500.css"; // Medium
import "@fontsource/inter/600.css"; // Semi-bold
import "@fontsource/inter/700.css"; // Bold

import "./assets/styles/globals.css";

import Loading from "./components/UI/Loading.tsx";
import { router } from "./routes/index.tsx";
import { Bounce, ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Suspense
			fallback={
				<Loading fullScreen size="lg" variant="primary" text="Loading..." />
			}
		>
			<RouterProvider router={router} />
			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick={false}
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
				transition={Bounce}
			/>
		</Suspense>
	</StrictMode>
);
