import React, { useEffect, useMemo, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { APP_ROUTES, STORAGE_KEYS } from "../services/config";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchUser } from "../stores/slices/authSlice";
import Loading from "../components/UI/Loading";

interface ProtectedRouteProps {
	allowedRoles?: string[];
	children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	allowedRoles,
	children,
}) => {
	const dispatch = useAppDispatch();
	const { user, loading } = useAppSelector((state) => state.auth);

	// Read token once per render
	const token = useMemo(
		() =>
			typeof window !== "undefined"
				? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
				: null,
		[]
	);

	// Local bootstrap flag to avoid redirecting before we try fetching user on reload
	const [bootstrapping, setBootstrapping] = useState<boolean>(!!token && !user);

	// Fetch user if we have a token but no user yet
	useEffect(() => {
		if (token && !user) {
			setBootstrapping(true);
			// Dispatch and clear bootstrap flag when done
			Promise.resolve(dispatch(fetchUser())).finally(() =>
				setBootstrapping(false)
			);
		}
		// we intentionally omit dependencies to avoid re-fetch loops
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Show loading while bootstrapping or fetching user data
	if (bootstrapping || loading) {
		return <Loading fullScreen size="lg" variant="primary" text="Loading..." />;
	}

	// Check if user is logged in
	if (!token || !user) {
		// Not logged in → redirect to login
		return <Navigate to={APP_ROUTES.LOGIN} replace />;
	}

	// Check if user has required role
	if (
		allowedRoles &&
		!allowedRoles.includes(user.roleName?.toLowerCase() || "")
	) {
		// Wrong role → redirect to not found
		return <Navigate to={APP_ROUTES.NOTFOUND} replace />;
	}

	// User is authenticated and has correct role
	return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
