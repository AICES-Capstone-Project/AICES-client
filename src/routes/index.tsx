import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

/* ============== Layouts ==============*/
const MainLayout = lazy(() => import("../components/Layout/MainLayout"));
const AdminLayout = lazy(() => import("../components/Layout/AdminLayout"));

/* ============== Candidates Pages ==============*/
const Home = lazy(() => import("../App"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

/* ============== Admin Pages ==============*/
const AdminDashboard = lazy(() => import("../pages/AdminPages/Dashboard"));

export const router = createBrowserRouter([
	/* ============== Candidates Pages ==============*/
	{
		path: "/",
		element: <MainLayout />,
		children: [{ path: "", element: <Home /> }],
	},

	/* ============== Admin Pages ==============*/
	{
		path: "/admin",
		element: <AdminLayout />,
		children: [{ path: "dashboard", element: <AdminDashboard /> }],
	},

	/* ============== Error Pages ==============*/
	{
		path: "*",
		element: <NotFoundPage />,
	},
]);
