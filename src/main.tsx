import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";

import Loading from "./components/UI/Loading.tsx";
import { router } from "./routes/appRoutes.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Suspense
			fallback={
				<Loading fullScreen size="lg" variant="primary" text="Loading..." />
			}
		>
			<RouterProvider router={router} />
		</Suspense>
	</StrictMode>
);
