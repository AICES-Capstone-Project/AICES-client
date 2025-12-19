// src/pages/Homepage/partials/TimeSaving/TimeSaving.tsx
import React, { useCallback } from "react";
import { Button } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

import "./TimeSaving.css";
import clockIcon from "../../../../assets/homepage/clock.png";

import { APP_ROUTES, STORAGE_KEYS } from "../../../../services/config";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { fetchUser } from "../../../../stores/slices/authSlice";
import { getRoleBasedRoute } from "../../../../routes/navigation";

const normalizeRoleKey = (raw?: string | null) => {
  if (!raw) return null;
  return raw.trim().toLowerCase().replace(/\s+/g, "_");
};

const TimeSaving: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      : null;

  const handleGetStarted = useCallback(async () => {
    const redirect = location.pathname + location.search + location.hash;

    // Guest → Login
    if (!token) {
      navigate(`${APP_ROUTES.LOGIN}?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    // Có token nhưng chưa có user → fetch
    let roleName = user?.roleName;

    if (!roleName) {
      try {
        const fetched = await dispatch(fetchUser()).unwrap();
        roleName = fetched?.roleName;
      } catch {
        navigate(`${APP_ROUTES.LOGIN}?redirect=${encodeURIComponent(redirect)}`);
        return;
      }
    }

    const roleKey = normalizeRoleKey(roleName);
    navigate(getRoleBasedRoute(roleKey));
  }, [dispatch, location, navigate, token, user?.roleName]);

  return (
    <section className="time-section">
      {/* LAYER 1 – SOCIAL PROOF */}
      <div className="time-social">
        <p className="time-eyebrow">
          Built for HR Teams, Recruiters, and SMEs
        </p>

        <div className="time-logos">
          <span className="time-logo">AI Parsing</span>
          <span className="time-logo">Scoring</span>
          <span className="time-logo">Ranking</span>
          <span className="time-logo">Matching</span>
          <span className="time-logo">Collaboration</span>
          <span className="time-logo">Reports</span>
          <span className="time-logo">RBAC</span>
        </div>
      </div>

      {/* LAYER 2 – SPOTLIGHT */}
      <div className="time-spotlight-wrapper">
        <div className="time-spotlight" />
        <div className="time-icon">
          <span className="time-icon-glyph">
            <img src={clockIcon} alt="Clock Icon" />
          </span>
        </div>
      </div>

      {/* LAYER 3 – COPY + CTA */}
      <div className="time-copy">
        <h2 className="time-title">
          Hire faster with{" "}
          <span className="time-title-accent">AI-powered</span>{" "}
          <span className="time-title-accent-soft">
            candidate evaluation
          </span>
        </h2>

        <p className="time-subtext">
          AICES automates resume parsing, scoring, and ranking so recruiters can
          make faster, fairer, and more data-driven hiring decisions—while
          reducing manual effort and bias.
        </p>

        <Button
          type="primary"
          className="time-cta-btn"
          onClick={handleGetStarted}
          loading={!!token && loading}
        >
          Get Started with AICES
        </Button>
      </div>
    </section>
  );
};

export default TimeSaving;
