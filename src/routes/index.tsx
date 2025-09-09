import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

const Home = lazy(() => import("../App"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

export const router = createBrowserRouter([
	{ path: "/", element: <Home /> },
	{ path: "*", element: <NotFoundPage /> },
]);
