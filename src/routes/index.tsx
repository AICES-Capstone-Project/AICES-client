import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "./ProtectedRoute";
import UserProfileTest from "../pages/UserProfileTest";
const ErrorPage = lazy(() => import("../pages/ErrorPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

/* ============== Layouts ==============*/
const MainLayout = lazy(() => import("../components/Layout/MainLayout"));
const AdminLayout = lazy(() => import("../components/Layout/AdminLayout"));

/* ============== Candidates Pages ==============*/
const Home = lazy(() => import("../pages/Homepage/Homepage"));
const Login = lazy(() => import("../pages/Login/Login"));
const VerifyEmailPage = lazy(() => import("../pages/SignUp/VerifyEmailPage"));
const SignUp = lazy(() => import("../pages/SignUp/Signup"));
const ForgetPassword = lazy(
	() => import("../pages/Login/partials/ForgetPassword/ForgetPass")
);
const ResetPassword = lazy(
	() => import("../pages/Login/partials/ResetPassword/ResetPassword")
);

/* ============== Admin Pages ==============*/
const AdminDashboard = lazy(() => import("../pages/AdminPages/Dashboard"));
const AdminAccounts = lazy(() => import("../pages/AdminPages/Accounts"));

export const router = createBrowserRouter([
	/* ============== Candidates Pages ==============*/
	{
		path: "/",
		element: <MainLayout />,
		errorElement: <ErrorPage />,
		children: [{ index: true, element: <Home /> }],
	},
	{ path: "login", element: <Login /> },
	{ path: "sign-up", element: <SignUp /> },
	{ path: "verify-email", element: <VerifyEmailPage /> },
	{ path: "forgot-password", element: <ForgetPassword /> },
	{ path: "reset-password", element: <ResetPassword /> },
	{ path: "test", element: <UserProfileTest /> },
	/* ============== Admin Pages ==============*/
	{
		path: "/admin",
		element: <ProtectedRoute allowedRoles={["Admin"]} />,
		children: [
			{
				index: true,
				element: <AdminLayout />,
			},
			{ path: "dashboard", element: <AdminDashboard /> },
			{ path: "accounts", element: <AdminAccounts /> },
		],
	},

	/* ============== Error Pages ==============*/
	{
		path: "*",
		element: <NotFoundPage />,
	},
]);
