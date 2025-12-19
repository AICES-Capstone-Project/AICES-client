// src/pages/Homepage/partials/RecruiterDesigned/RecruiterDesigned.tsx
import React, { useCallback } from "react";
import { Button } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

import "./RecruiterDesigned.css";
import recruiterVisual from "../../../../assets/homepage/page2.png";

import { APP_ROUTES, STORAGE_KEYS } from "../../../../services/config";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { fetchUser } from "../../../../stores/slices/authSlice";
import { getRoleBasedRoute } from "../../../../routes/navigation";

const normalizeRoleKey = (raw?: string | null) => {
  if (!raw) return null;
  return raw.trim().toLowerCase().replace(/\s+/g, "_");
};

const RecruiterDesigned: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      : null;

  const handleExploreFeatures = useCallback(async () => {
    const redirect = location.pathname + location.search + location.hash;

    // Guest → Login
    if (!token) {
      navigate(`${APP_ROUTES.LOGIN}?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    // Logged in but user not loaded yet
    let roleName = user?.roleName;

    if (!roleName) {
      try {
        const fetched = await dispatch(fetchUser()).unwrap();
        roleName = fetched?.roleName;
      } catch {
        navigate(
          `${APP_ROUTES.LOGIN}?redirect=${encodeURIComponent(redirect)}`
        );
        return;
      }
    }

    const roleKey = normalizeRoleKey(roleName);
    navigate(getRoleBasedRoute(roleKey));
  }, [dispatch, location, navigate, token, user?.roleName]);

  return (
    <section className="recruit-section">
      <div className="recruit-inner">
        {/* LEFT – TEXT CONTENT */}
        <div className="recruit-left">
          <h2 className="recruit-title">
            <span className="recruit-title-accent">
              Designed for Recruiters
            </span>{" "}
            to streamline screening and selection.
          </h2>

          <ul className="recruit-list">
            <li className="recruit-item">
              <span className="recruit-item-title">Resume Parsing:</span>{" "}
              Automatically extract and structure candidate information from
              uploaded resumes for faster review.
            </li>

            <li className="recruit-item">
              <span className="recruit-item-title">Scoring & Ranking:</span>{" "}
              Evaluate candidates against job requirements and rank them to
              support quicker shortlisting.
            </li>

            <li className="recruit-item">
              <span className="recruit-item-title">
                Criteria-Based Screening:
              </span>{" "}
              Use consistent evaluation criteria to reduce manual effort and
              improve screening consistency.
            </li>

            <li className="recruit-item">
              <span className="recruit-item-title">Centralized Workflow:</span>{" "}
              Manage job postings, applications, and candidate profiles in one
              place for easier tracking.
            </li>

            <li className="recruit-item">
              <span className="recruit-item-title">Decision Support:</span>{" "}
              Provide clearer, more data-driven insights to help recruiters and
              hiring managers make hiring decisions faster.
            </li>
          </ul>

          <Button
            type="primary"
            className="recruit-cta-btn"
            onClick={handleExploreFeatures}
            loading={!!token && loading}
          >
            <span className="recruit-cta-icon">✦</span>
            Explore AICES Features
          </Button>
        </div>

        {/* RIGHT – VISUAL */}
        <div className="recruit-right">
          <div className="recruit-visual-wrapper">
            <img
              src={recruiterVisual}
              alt="Recruitment workflow with AICES"
              className="recruit-visual-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecruiterDesigned;
