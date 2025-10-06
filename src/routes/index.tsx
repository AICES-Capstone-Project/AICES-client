import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "./ProtectedRoute";
import UserProfileTest from "../pages/UserProfileTest";
import { APP_ROUTES } from "../services/config";
import GitHubCallback from "../pages/Login/partials/GitHubCallback";

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
const AdminRecruitmentApproval = lazy(
	() => import("../pages/AdminPages/RecruitmentApproval")
);
const AdminJobs = lazy(() => import("../pages/AdminPages/Jobs"));
const AdminAssessments = lazy(() => import("../pages/AdminPages/Assessments"));
const AdminReports = lazy(() => import("../pages/AdminPages/Reports"));
const AdminSettings = lazy(() => import("../pages/AdminPages/Settings"));
const AdminNotifications = lazy(
	() => import("../pages/AdminPages/Notifications")
);
const AdminLogs = lazy(() => import("../pages/AdminPages/Logs"));

export const router = createBrowserRouter([
	/* ============== Candidates Pages ==============*/
	{
		path: APP_ROUTES.HOME,
		element: <MainLayout />,
		errorElement: <ErrorPage />,
		children: [{ index: true, element: <Home /> }],
	},
	{ path: APP_ROUTES.LOGIN, element: <Login /> },
	{ path: APP_ROUTES.SIGN_UP, element: <SignUp /> },
	{ path: APP_ROUTES.VERIFY_EMAIL, element: <VerifyEmailPage /> },
	{ path: APP_ROUTES.FORGOT_PASSWORD, element: <ForgetPassword /> },
	{ path: APP_ROUTES.RESET_PASSWORD, element: <ResetPassword /> },
	{ path: APP_ROUTES.AUTH_CALLBACK, element: <GitHubCallback /> },
	{ path: APP_ROUTES.TEST, element: <UserProfileTest /> },
	/* ============== Admin Pages ==============*/
	{
		path: APP_ROUTES.ADMIN,
		element: (
			<ProtectedRoute allowedRoles={["Admin"]}>
				<AdminLayout />
			</ProtectedRoute>
		),
		children: [
			{ index: true, element: <AdminDashboard /> },
			{ path: APP_ROUTES.ADMIN_DASHBOARD, element: <AdminDashboard /> },
			{ path: APP_ROUTES.ADMIN_USERS, element: <AdminAccounts /> },
			{
				path: APP_ROUTES.ADMIN_RECRUITMENT_APPROVAL,
				element: <AdminRecruitmentApproval />,
			},
			{ path: APP_ROUTES.ADMIN_JOBS, element: <AdminJobs /> },
			{ path: APP_ROUTES.ADMIN_ASSESSMENTS, element: <AdminAssessments /> },
			{ path: APP_ROUTES.ADMIN_REPORTS, element: <AdminReports /> },
			{ path: APP_ROUTES.ADMIN_SETTINGS, element: <AdminSettings /> },
			{ path: APP_ROUTES.ADMIN_NOTIFICATIONS, element: <AdminNotifications /> },
			{ path: APP_ROUTES.ADMIN_LOGS, element: <AdminLogs /> },
		],
	},

	/* ============== Error Pages ==============*/
	{
		path: "*",
		element: <NotFoundPage />,
	},
]);
