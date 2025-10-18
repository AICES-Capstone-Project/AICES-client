// src/pages/Profile/ProfileLayout.tsx
import React, { useEffect } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import {
  Card,
  Avatar,
  Typography,
  Menu,
  Spin,
  Button,
  Descriptions,
} from "antd";
import type { MenuProps } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import defaultAvatar from "../../assets/images/Avatar_Default.jpg";
import { STORAGE_KEYS, APP_ROUTES } from "../../services/config";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchUser, logoutUser } from "../../stores/slices/authSlice";
import dayjs from "dayjs";

// 👉 import form chi tiết
import ProfileDetail from "./ProfileDetail";

const { Title, Text } = Typography;

const ProfileLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((s) => s.auth);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token && !user) dispatch(fetchUser());
  }, [dispatch, user]);

  // Menu trái
  const items: MenuProps["items"] = [
    {
      key: "account-detail",
      label: (
        <NavLink to="account-detail" className="block">
          Account detail
        </NavLink>
      ),
    },
    {
      key: "password-security",
      label: (
        <NavLink to="password-security" className="block">
          Password & security
        </NavLink>
      ),
    },
    {
      key: "privacy",
      label: (
        <NavLink to="privacy" className="block">
          Privacy
        </NavLink>
      ),
    },
    {
      key: "membership",
      label: (
        <NavLink to="membership" className="block">
          Paid membership
        </NavLink>
      ),
    },
  ];

  // xác định tab hiện tại từ URL
  const path = location.pathname;
  const isAccountDetail = path.endsWith("/account-detail");
  const selectedKey = path.endsWith("/account-detail")
    ? ["account-detail"]
    : path.endsWith("/password-security")
    ? ["password-security"]
    : path.endsWith("/privacy")
    ? ["privacy"]
    : path.endsWith("/membership")
    ? ["membership"]
    : []; // 👉 Không chọn gì khi đang ở /profile (overview)

  const handleSignOut = () => {
    dispatch(logoutUser());
    navigate(APP_ROUTES.HOME);
  };

  // 👉 tách Overview thành component nhỏ trong file này cho gọn
  const Overview = () => (
    <Card title="Account overview" className="shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <Avatar
          size={64}
          src={user?.avatarUrl || defaultAvatar}
          icon={<UserOutlined />}
        />
        <div>
          <div className="text-base font-semibold">{user?.fullName || "-"}</div>
          <Text type="secondary">{user?.email}</Text>
        </div>
      </div>

      <Descriptions
        column={{ xs: 1, sm: 2 }}
        bordered
        size="middle"
        labelStyle={{ width: 180, fontWeight: 600 }}
      >
        <Descriptions.Item label="Phone number">
          {user?.phoneNumber || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Birthday">
          {user?.dateOfBirth
            ? dayjs(user.dateOfBirth).format("DD/MM/YYYY")
            : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Address" span={2}>
          {user?.address || "-"}
        </Descriptions.Item>
      </Descriptions>

      <Text type="secondary" className="block mt-3">
        * Các mục trên phản ánh dữ liệu hiện tại sau khi bạn chỉnh sửa trong
        trang <b>Account detail</b>.
      </Text>
    </Card>
  );

  return (
    <div className="flex justify-center w-full py-8 px-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <Card
          className="mb-6 shadow-sm hover:bg-gray-50 transition cursor-pointer"
          onClick={() => navigate("/profile")} // 👈 Khi bấm khung xanh → về Overview
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Avatar
              size={80}
              src={user?.avatarUrl || defaultAvatar}
              icon={<UserOutlined />}
            />
            <div className="flex-1 text-center sm:text-left">
              <Title level={4} style={{ margin: 0 }}>
                {user?.fullName || user?.email || "Your profile"}
              </Title>
              <Text type="secondary">
                Manage your account info and display preferences.
              </Text>
            </div>
            <Button disabled>Actions</Button>
          </div>
        </Card>

        {/* Body */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <Card
            className="w-full md:w-1/4 shadow-sm"
            bodyStyle={{ padding: "12px 0" }}
          >
            <Menu
              mode="inline"
              selectedKeys={selectedKey}
              items={items}
              style={{ borderRight: "none" }}
            />
            <div className="px-3 pt-3">
              <Button block icon={<LogoutOutlined />} onClick={handleSignOut}>
                Sign out
              </Button>
            </div>
          </Card>

          {/* Content: nếu đang ở /account-detail → hiện form; ngược lại → Overview */}
          <div className="flex-1">
            {loading ? (
              <Spin className="block mx-auto mt-10" />
            ) : isAccountDetail ? (
              <ProfileDetail />
            ) : (
              <Overview />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
