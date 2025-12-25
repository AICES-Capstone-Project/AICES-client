import "@ant-design/v5-patch-for-react-19";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";

// font
import "@fontsource/inter/400.css"; // Regular
import "@fontsource/inter/500.css"; // Medium
import "@fontsource/inter/600.css"; // Semi-bold
import "@fontsource/inter/700.css"; // Bold

import "./assets/styles/globals.css";
import "./i18n";

import Loading from "./components/UI/Loading.tsx";
import i18n from "./i18n";
import { router } from "./routes/index.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "./stores/store.ts";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ErrorBoundary>
			<Provider store={store}>
				<Suspense
					fallback={
						<Loading
							fullScreen
							size="lg"
							variant="primary"
							text={i18n.t("app.loading")}
						/>
					}
				>
					<GoogleOAuthProvider clientId={import.meta.env.VITE_AUTH_GOOGLE_ID}>
						<RouterProvider router={router} />
					</GoogleOAuthProvider>
				</Suspense>
			</Provider>
		</ErrorBoundary>
	</StrictMode>
);
