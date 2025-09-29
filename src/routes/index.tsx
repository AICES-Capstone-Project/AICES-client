import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

/* ============== Layouts ==============*/
const MainLayout = lazy(() => import("../components/Layout/MainLayout"));
const AdminLayout = lazy(() => import("../components/Layout/AdminLayout"));

/* ============== Candidates Pages ==============*/
const Home = lazy(() => import("../pages/Homepage/Homepage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const Login = lazy(() => import("../pages/Login/Login"));
const VerifyEmailPage = lazy(() => import("../pages/SignUp/VerifyEmailPage"));
const SignUp = lazy(() => import("../pages/SignUp/Signup"));
const ForgetPassword = lazy(
	() => import("../pages/Login/partials/ForgetPassword/ForgetPass")
);

/* ============== Admin Pages ==============*/
const AdminDashboard = lazy(() => import("../pages/AdminPages/Dashboard"));

export const router = createBrowserRouter([
	/* ============== Candidates Pages ==============*/
	{
		path: "/",
		element: <MainLayout />,
		children: [{ index: true, element: <Home /> }],
	},
	{ path: "login", element: <Login /> },
	{ path: "sign-up", element: <SignUp /> },
	{ path: "verify-email", element: <VerifyEmailPage /> },
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
