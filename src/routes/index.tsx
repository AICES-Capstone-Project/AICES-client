import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "./ProtectedRoute";
import UserProfileTest from "../pages/UserProfileTest";
import { APP_ROUTES, ROLES } from "../services/config";
import GitHubCallback from "../pages/Login/partials/GitHubCallback";

const ErrorPage = lazy(() => import("../pages/ErrorPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

/* ============== Layouts ==============*/
const MainLayout = lazy(() => import("../components/Layout/MainLayout"));
const AdminLayout = lazy(() => import("../components/Layout/AdminLayout"));
const ProfileLayout = lazy(() => import("../components/Layout/ProfileLayout"));

/* ============== General Pages ==============*/
const Home = lazy(() => import("../pages/Homepage/Homepage"));
const Pricing = lazy(() => import("../pages/Pricing/Pricing"));
const Login = lazy(() => import("../pages/Login/Login"));
const VerifyEmailPage = lazy(() => import("../pages/SignUp/VerifyEmailPage"));
const SignUp = lazy(() => import("../pages/SignUp/Signup"));
const ForgetPassword = lazy(
	() => import("../pages/Login/partials/ForgetPassword/ForgetPass")
);
const ResetPassword = lazy(
	() => import("../pages/Login/partials/ResetPassword/ResetPassword")
);
const ProfileDetail = lazy(() => import("../pages/Profile/ProfileDetail"));

/* ============== Admin Pages ==============*/
const AdminDashboard = lazy(() => import("../pages/AdminPages/Dashboard"));
const AdminAccounts = lazy(() => import("../pages/AdminPages/Accounts"));
const AdminRecruitmentApproval = lazy(
	() => import("../pages/AdminPages/RecruitmentApproval")
);
const AdminJobs = lazy(() => import("../pages/AdminPages/Jobs"));

export const router = createBrowserRouter([
	/* ============== General Pages ==============*/
	{
		path: APP_ROUTES.HOME,
		element: <MainLayout />,
		errorElement: <ErrorPage />,
		children: [
			{ index: true, element: <Home /> },
			{ path: APP_ROUTES.PRICING, element: <Pricing /> },
			{
				path: APP_ROUTES.PROFILE, // /profile
				element: (
					<ProtectedRoute>
						<ProfileLayout />
					</ProtectedRoute>
				),
				children: [
					// /profile -> chỉ hiện sidebar, không render detail
					{ index: true, element: <div /> },

					// /profile/account-detail
					{ path: "account-detail", element: <ProfileDetail /> },

					// /profile/password-security (placeholder - sau này thay component thật)
					{ path: "password-security", element: <div /> },

					// /profile/privacy (placeholder)
					{ path: "privacy", element: <div /> },

					// /profile/membership (placeholder)
					{ path: "membership", element: <div /> },
				],
			},
		],
	},
	{ path: APP_ROUTES.LOGIN, element: <Login /> },
	{ path: APP_ROUTES.SIGN_UP, element: <SignUp /> },
	{ path: APP_ROUTES.VERIFY_EMAIL, element: <VerifyEmailPage /> },
	{ path: APP_ROUTES.FORGOT_PASSWORD, element: <ForgetPassword /> },
	{ path: APP_ROUTES.RESET_PASSWORD, element: <ResetPassword /> },
	{ path: APP_ROUTES.AUTH_CALLBACK, element: <GitHubCallback /> },
	{ path: APP_ROUTES.TEST, element: <UserProfileTest /> },

	/* ============== System Pages ==============*/
	{
		path: APP_ROUTES.SYSTEM,
		element: (
			<ProtectedRoute
				allowedRoles={[
					ROLES.System_Admin,
					ROLES.System_Manager,
					ROLES.System_Staff,
				]}
			>
				<AdminLayout />
			</ProtectedRoute>
		),
		children: [
			{ index: true, element: <AdminDashboard /> },
			{ path: APP_ROUTES.SYSTEM_DASHBOARD, element: <AdminDashboard /> },
			{ path: APP_ROUTES.SYSTEM_USERS, element: <AdminAccounts /> },
			{
				path: APP_ROUTES.SYSTEM_RECRUITMENT_APPROVAL,
				element: <AdminRecruitmentApproval />,
			},
			{ path: APP_ROUTES.SYSTEM_JOBS, element: <AdminJobs /> },
		],
	},

	/* ============== Error Pages ==============*/
	{
		path: "*",
		element: <NotFoundPage />,
	},
]);
