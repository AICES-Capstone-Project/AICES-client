import { createBrowserRouter } from "react-router-dom";
import { lazyWithRetry } from "../utils/lazyWithRetry";
import ProtectedRoute from "./ProtectedRoute";
import UserProfileTest from "../pages/UserProfileTest";
import { APP_ROUTES, ROLES } from "../services/config";
import GitHubCallback from "../pages/Login/partials/GitHubCallback";
import Setting from "../pages/CompanyPages/Settings/Setting";
import MyApartmentWrapper from "../pages/CompanyPages/MyApartment/MyApartmentWrapper";
import CompanyList from "../pages/SystemPages/Company";
import CompanyDetail from "../pages/SystemPages/Company/components/CompanyDetail";
import JobDetail from "../pages/SystemPages/Company/JobDetail";
import ResumeDetail from "../pages/SystemPages/Company/ResumeDetail";

const ErrorPage = lazyWithRetry(() => import("../pages/ErrorPage"));
const NotFoundPage = lazyWithRetry(() => import("../pages/NotFoundPage"));

/* ============== Layouts ==============*/
const MainLayout = lazyWithRetry(() => import("../components/Layout/MainLayout"));
const SystemAdminLayout = lazyWithRetry(
  () => import("../components/Layout/SystemAdminLayout")
);
const SystemManagerLayout = lazyWithRetry(
  () => import("../components/Layout/SystemManagerLayout")
);
const SystemStaffLayout = lazyWithRetry(
  () => import("../components/Layout/SystemStaffLayout")
);
const CompanyLayout = lazyWithRetry(() => import("../components/Layout/CompanyLayout"));
const ProfileLayout = lazyWithRetry(() => import("../components/Layout/ProfileLayout"));

/* ============== General Pages ==============*/
const Home = lazyWithRetry(() => import("../pages/Homepage/Homepage"));

/* ============== Legal & Trust Pages ==============*/
const TermsOfService = lazyWithRetry(
  () => import("../pages/Legal/TermsOfService/TermsOfService")
);
const PrivacyPolicy = lazyWithRetry(
  () => import("../pages/Legal/PrivacyPolicy/PrivacyPolicy")
);
const SecurityPrivacy = lazyWithRetry(
  () => import("../pages/Legal/SecurityPrivacy/SecurityPrivacy")
);
/* ============== Product Pages ==============*/
const HowItWorks = lazyWithRetry(() => import("../pages/Product/HowItWorks/HowItWorks"));
const NoAts = lazyWithRetry(() => import("../pages/Product/NoAts/NoAts"));

/* ============== Resources Pages ==============*/
const Blog = lazyWithRetry(() => import("../pages/Resources/Blog/Blog.tsx"));

const HelpCenter = lazyWithRetry(
  () => import("../pages/Resources/HelpCenter/HelpCenter")
);
const ContactUs = lazyWithRetry(() => import("../pages/Resources/ContactUs/ContactUs"));

const Subscriptions = lazyWithRetry(() => import("../pages/Pricing/Subscriptions"));
const Login = lazyWithRetry(() => import("../pages/Login/Login"));
const VerifyEmailPage = lazyWithRetry(() => import("../pages/SignUp/VerifyEmailPage"));
const SignUp = lazyWithRetry(() => import("../pages/SignUp/Signup"));
const ForgetPassword = lazyWithRetry(
  () => import("../pages/Login/partials/ForgetPassword/ForgetPass")
);
const ResetPassword = lazyWithRetry(
  () => import("../pages/Login/partials/ResetPassword/ResetPassword")
);
const ProfileDetail = lazyWithRetry(() => import("../pages/Profile/ProfileDetail"));

/* ============== Company Pages ==============*/
const CompanyDashboard = lazyWithRetry(
  () => import("../pages/CompanyPages/Dashboard/Dashboard")
);
const CompanyStaffs = lazyWithRetry(
  () => import("../pages/CompanyPages/StaffManagement/StaffManagement")
);
const JobManagement = lazyWithRetry(
  () => import("../pages/CompanyPages/JobManagement/JobManagement")
);
const SubmissionPending = lazyWithRetry(
  () => import("../pages/CompanyPages/MyApartment/SubmissionPending")
);
const Campain = lazyWithRetry(
  () => import("../pages/CompanyPages/Campain/CampaignManagement.tsx")
);
const CampaignDetail = lazyWithRetry(
  () => import("../pages/CompanyPages/Campain/component/CampaignDetail")
);
const HiringTracking = lazyWithRetry(
  () => import("../pages/CompanyPages/HiringTracking/HiringTracking")
);
const ResumeList = lazyWithRetry(
  () => import("../pages/CompanyPages/AIScreening/ResumeList")
);
const Notification = lazyWithRetry(
  () => import("../pages/CompanyPages/Notification/NotificationManager")
);
const CandidateManagement = lazyWithRetry(
  () => import("../pages/CompanyPages/Candidate/CandidateManagement")
);
const CandidateDetail = lazyWithRetry(
  () => import("../pages/CompanyPages/Candidate/components/CandidateDetail")
);
const CompareResumes = lazyWithRetry(
  () => import("../pages/CompanyPages/CompareResume/CompareResumes")
);
const CompanySubscription = lazyWithRetry(
  () => import("../pages/CompanyPages/CompanySubsriptions/CompanySubscription")
);
const CompanyFeedbackPage = lazyWithRetry(
  () => import("../pages/CompanyPages/Feedback/FeedbackPage")
);
const PaymentHistory = lazyWithRetry(
  () =>
    import(
      "../pages/CompanyPages/CompanySubsriptions/components/PaymentHistory"
    )
);

/* ============== System Pages ==============*/
const SystemDashboard = lazyWithRetry(() => import("../pages/SystemPages/Dashboard"));
const SystemAccounts = lazyWithRetry(() => import("../pages/SystemPages/Accounts"));
//Subscription Pages
const PlansPage = lazyWithRetry(
  () => import("../pages/SystemPages/Subscriptions/PlansPage")
);
const SubscribedCompaniesPage = lazyWithRetry(
  () => import("../pages/SystemPages/Subscriptions/SubscribedCompaniesPage")
);
//Taxonomy Pages
const CategoryList = lazyWithRetry(
  () => import("../pages/SystemPages/Taxonomy/CategoryList")
);

const SkillList = lazyWithRetry(() => import("../pages/SystemPages/Taxonomy/SkillList"));

const SpecializationList = lazyWithRetry(
  () => import("../pages/SystemPages/Taxonomy/SpecializationList")
);

const RecruitmentTypeList = lazyWithRetry(
  () => import("../pages/SystemPages/Taxonomy/RecruitmentTypeList")
);
const LanguageList = lazyWithRetry(
  () => import("../pages/SystemPages/Taxonomy/LanguageList")
);

const LevelList = lazyWithRetry(() => import("../pages/SystemPages/Taxonomy/LevelList"));

//Content
const BannerList = lazyWithRetry(
  () => import("../pages/SystemPages/Content/Banners/BannerList")
);
const BlogList = lazyWithRetry(
  () => import("../pages/SystemPages/Content/Blogs/BlogList")
);
const BlogDetail = lazyWithRetry(() => import("../pages/Resources/Blog/BlogDetail.tsx"));

//Feedback
const FeedbackList = lazyWithRetry(
  () => import("../pages/SystemPages/Feedback/FeedbackList")
);

const PaymentSuccess = lazyWithRetry(
  () =>
    import(
      "../pages/CompanyPages/CompanySubsriptions/components/PaymentSuccess"
    )
);

// ===== Reports System Pages =====
const ReportsOverview = lazyWithRetry(
  () => import("../pages/SystemPages/Reports/ReportsOverview")
);

// ===== System children routes dùng chung cho Admin / Manager / Staff =====
const systemChildren = [
  { index: true, element: <SystemDashboard /> },
  { path: "dashboard", element: <SystemDashboard /> },

  // User management
  { path: "users", element: <SystemAccounts /> },

  // Subscription plans
  { path: "subscriptions", element: <PlansPage /> },

  // Subscribed companies
  {
    path: "subscriptions/companies",
    element: <SubscribedCompaniesPage />,
  },

  // Taxonomy
  { path: "taxonomy/languages", element: <LanguageList /> },
  { path: "taxonomy/levels", element: <LevelList /> },
  { path: "taxonomy/categories", element: <CategoryList /> },
  { path: "taxonomy/skills", element: <SkillList /> },
  {
    path: "taxonomy/specializations",
    element: <SpecializationList />,
  },
  {
    path: "taxonomy/recruitment-types",
    element: <RecruitmentTypeList />,
  },

  // Content
  {
    path: "content/banners",
    element: <BannerList />,
  },
  {
    path: "content/blogs",
    element: <BlogList />,
  },

  // ================= Reports =================
  { path: "reports", element: <ReportsOverview /> },

  // Company detail pages (System xem & quản lý company)
  { path: "company", element: <CompanyList /> },
  { path: "company/:companyId", element: <CompanyDetail /> },
  { path: "company/:companyId/jobs/:jobId", element: <JobDetail /> },
  {
    path: "company/:companyId/jobs/:jobId/resumes/:resumeId",
    element: <ResumeDetail />,
  },
  { path: "feedbacks", element: <FeedbackList /> },
];

export const router = createBrowserRouter([
  /* ============== General Pages ==============*/
  {
    path: APP_ROUTES.HOME,
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: APP_ROUTES.SUBSCRIPTIONS, element: <Subscriptions /> },

      /* ===== Legal & Trust ===== */
      { path: APP_ROUTES.LEGAL_TERMS, element: <TermsOfService /> },
      { path: APP_ROUTES.LEGAL_PRIVACY, element: <PrivacyPolicy /> },
      { path: APP_ROUTES.LEGAL_SECURITY, element: <SecurityPrivacy /> },
      /* ===== Product ===== */
      { path: APP_ROUTES.PRODUCT_HOW_IT_WORKS, element: <HowItWorks /> },
      { path: APP_ROUTES.PRODUCT_NO_ATS, element: <NoAts /> },

      /* ===== Resources ===== */
      { path: APP_ROUTES.RESOURCES_BLOG, element: <Blog /> },
      { path: `${APP_ROUTES.RESOURCES_BLOG}/:id`, element: <BlogDetail /> },
      { path: APP_ROUTES.RESOURCES_HELP_CENTER, element: <HelpCenter /> },
      { path: APP_ROUTES.RESOURCES_CONTACT_US, element: <ContactUs /> },

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
  { path: "/payment/success", element: <PaymentSuccess /> },

  /* ============== Comapany Pages ==============*/
  {
    path: APP_ROUTES.COMPANY,
    element: (
      <ProtectedRoute allowedRoles={[ROLES.Hr_Manager, ROLES.Hr_Recruiter]}>
        <CompanyLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Setting /> },
      { path: APP_ROUTES.COMPANY_DASHBOARD, element: <CompanyDashboard /> },
      { path: APP_ROUTES.COMPANY_STAFFS, element: <CompanyStaffs /> },
      { path: APP_ROUTES.COMPANY_JOBS, element: <JobManagement /> },
      { path: APP_ROUTES.COMPANY_NOTIFICATION, element: <Notification /> },
      { path: APP_ROUTES.COMPANY_CANDIDATE, element: <CandidateManagement /> },
      {
        path: APP_ROUTES.COMPANY_CANDIDATE_DETAIL,
        element: <CandidateDetail />,
      },
      { path: APP_ROUTES.COMPANY_SETTINGS, element: <Setting /> },
      {
        path: APP_ROUTES.COMPANY_MY_APARTMENTS,
        element: <MyApartmentWrapper />,
      },
      {
        path: APP_ROUTES.COMPANY_PENDING_APPROVAL,
        element: <SubmissionPending />,
      },
      {
        path: APP_ROUTES.COMPANY_CAMPAIN,
        element: <Campain />,
      },
      {
        path: APP_ROUTES.COMPANY_CAMPAIN_DETAIL,
        element: <CampaignDetail />,
      },
      { path: APP_ROUTES.HIRING_TRACKING, element: <HiringTracking /> },
      {
        path: APP_ROUTES.COMPANY_AI_SCREENING_RESUMES_COMPARE,
        element: <CompareResumes />,
      },
      {
        path: APP_ROUTES.COMPANY_AI_SCREENING_RESUMES,
        element: <ResumeList />,
      },
      {
        path: APP_ROUTES.COMPANY_SUBSCRIPTIONS,
        element: <CompanySubscription />,
      },
      {
        path: APP_ROUTES.COMPANY_FEEDBACK,
        element: <CompanyFeedbackPage />,
      },
      {
        path: APP_ROUTES.COMPANY_PAYMENT_HISTORY,
        element: <PaymentHistory />,
      },
    ],
  },
  /* ============== System Pages ==============*/
  // Admin
  {
    path: APP_ROUTES.SYSTEM, // "/system"
    element: (
      <ProtectedRoute allowedRoles={[ROLES.System_Admin]}>
        <SystemAdminLayout />
      </ProtectedRoute>
    ),
    children: systemChildren,
  },

  // Manager
  {
    path: APP_ROUTES.SYSTEM_MANAGER,
    element: (
      <ProtectedRoute allowedRoles={[ROLES.System_Manager]}>
        <SystemManagerLayout />
      </ProtectedRoute>
    ),
    children: systemChildren,
  },

  // Staff
  {
    path: APP_ROUTES.SYSTEM_STAFF,
    element: (
      <ProtectedRoute allowedRoles={[ROLES.System_Staff]}>
        <SystemStaffLayout />
      </ProtectedRoute>
    ),
    children: systemChildren,
  },

  /* ============== Error Pages ==============*/
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
