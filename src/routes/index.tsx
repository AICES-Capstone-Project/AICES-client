import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

/* ============== Layouts ==============*/
const MainLayout = lazy(() => import("../components/Layout/MainLayout"));
const AdminLayout = lazy(() => import("../components/Layout/AdminLayout"));
const Login = lazy(() => import("../pages/Login/Login"));
const SignUp = lazy(() => import("../pages/SignUp/Signup"));
const ForgetPassword = lazy(() => import("../pages/Login/partials/ForgetPassword/ForgetPass"));
/* ============== Candidates Pages ==============*/
const Home = lazy(() => import("../pages/Homepage/Homepage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

/* ============== Admin Pages ==============*/
const AdminDashboard = lazy(() => import("../pages/AdminPages/Dashboard"));

export const router = createBrowserRouter([
	/* ============== Candidates Pages ==============*/
	{
		path: "/",
		element: <MainLayout />,
		children: [
			{ index: true, element: <Home /> },
		
		],
	},
	{ path: "login", element: <Login /> },
	{ path: "signup", element: <SignUp /> },
	{ path: "forgot-password", element: <ForgetPassword /> },

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
