// src/pages/Homepage/partials/Hero/Hero.tsx
import React, { useCallback, useMemo } from "react";
import { Button } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

import "./Hero.css";
import heroBg from "../../../../assets/homepage/homepage.png";

import { APP_ROUTES, STORAGE_KEYS } from "../../../../services/config";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { fetchUser } from "../../../../stores/slices/authSlice";
import { getRoleBasedRoute } from "../../../../routes/navigation";

const normalizeRoleKey = (raw?: string | null) => {
  if (!raw) return null;
  // "System Manager" | "SYSTEM_MANAGER" | "system manager" -> "system_manager"
  return raw.trim().toLowerCase().replace(/\s+/g, "_");
};

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }, []);

  const handleGetStarted = useCallback(async () => {
    const redirect = location.pathname + location.search + location.hash;

    // Guest -> login
    if (!token) {
      navigate(`${APP_ROUTES.LOGIN}?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    // Logged in but user not loaded yet -> fetch then route
    let roleName = user?.roleName;

    if (!roleName) {
      try {
        const fetched = await dispatch(fetchUser()).unwrap();
        roleName = fetched?.roleName;
      } catch {
        // token có nhưng fetch fail -> đưa về login cho chắc
        navigate(`${APP_ROUTES.LOGIN}?redirect=${encodeURIComponent(redirect)}`);
        return;
      }
    }

    const roleKey = normalizeRoleKey(roleName);
    navigate(getRoleBasedRoute(roleKey));
  }, [dispatch, location, navigate, token, user?.roleName]);

  return (
    <section className="hero-bg" style={{ backgroundImage: `url(${heroBg})` }}>
      <div className="hero-bg-overlay" />

      <div className="hero-bg-content">
        <h1 className="hero-bg-title">
          <span className="hero-bg-accent">10x Faster</span> Resume Screening
        </h1>

        <p className="hero-bg-subtext">
          Automate resume parsing, scoring, and ranking to screen faster.
          <br />
          Make fairer, more data-driven hiring decisions.
        </p>

        <Button
          type="primary"
          className="hero-bg-cta"
          onClick={handleGetStarted}
          loading={!!token && loading}   // có token mà đang fetchUser -> show loading
        >
          Get Started
        </Button>
      </div>
    </section>
  );
};

export default Hero;
