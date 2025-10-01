import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { APP_ROUTES, STORAGE_KEYS } from "../services/config";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchUser } from "../stores/slices/authSlice";
import Loading from "../components/UI/Loading";

interface ProtectedRouteProps {
	allowedRoles: string[];
	children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	allowedRoles,
	children,
}) => {
	const dispatch = useAppDispatch();
	const { user, loading } = useAppSelector((state) => state.auth);

	// Check for token and fetch user if needed
	useEffect(() => {
		const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
		if (token && !user && !loading) {
			dispatch(fetchUser());
		}
	}, [dispatch, user, loading]);

	// Show loading while fetching user data
	if (loading) {
		return <Loading fullScreen size="lg" variant="primary" text="Loading..." />;
	}

	// Check if user is logged in
	const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
	if (!token || !user) {
		// Not logged in → redirect to login
		return <Navigate to={APP_ROUTES.LOGIN} replace />;
	}

	// Check if user has required role
	if (!allowedRoles.includes(user.roleName || "")) {
		// Wrong role → redirect to homepage
		return <Navigate to={APP_ROUTES.HOME} replace />;
	}

	// User is authenticated and has correct role
	return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
