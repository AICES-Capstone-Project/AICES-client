// src/components/Layout/system/systemMenu.config.tsx
import { Link } from "react-router-dom";
import type { MenuProps } from "antd";

import {
  DashboardOutlined,
  TeamOutlined,
  GlobalOutlined,
  BranchesOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  ApartmentOutlined,
  PartitionOutlined,
  RiseOutlined,
  TagsOutlined,
  // MessageOutlined,
} from "@ant-design/icons";

import type { SystemRoleConfig } from "./systemRole.config";

type ItemType = NonNullable<MenuProps["items"]>[number];

const join = (basePath: string, child: string) => {
  const b = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
  const c = child.startsWith("/") ? child : `/${child}`;
  return `${b}${c}`;
};

// NOTE: children route paths in router are relative, but menu keys are absolute URL paths.
// We build absolute keys using basePath + relative child path (e.g. "/system" + "/dashboard").
export const buildSystemMenuItems = (cfg: SystemRoleConfig): ItemType[] => {
  const bp = cfg.basePath;

  const items: ItemType[] = [
    {
      key: join(bp, "dashboard"),
      icon: <DashboardOutlined />,
      label: <Link to={join(bp, "dashboard")}>Dashboard</Link>,
    },

    // Users (admin only)
    ...(cfg.showUsers
      ? ([
          {
            key: join(bp, "users"),
            icon: <TeamOutlined />,
            label: <Link to={join(bp, "users")}>Users</Link>,
          },
        ] as ItemType[])
      : []),

    // Companies group
    {
      key: "companies",
      icon: <ApartmentOutlined />,
      label: "Companies",
      children: [
        {
          key: join(bp, "company"),
          label: <Link to={join(bp, "company")}>Company Management</Link>,
        },
        {
          key: join(bp, "subscriptions/companies"),
          label: (
            <Link to={join(bp, "subscriptions/companies")}>
              Subscribed Companies
            </Link>
          ),
        },
      ],
    },

    // Subscriptions (Plans)
    {
      key: join(bp, "subscriptions"),
      icon: <BarChartOutlined />,
      label: <Link to={join(bp, "subscriptions")}>Subscriptions</Link>,
    },

    // Taxonomy
    {
      key: "taxonomy",
      icon: <PartitionOutlined />,
      label: "Taxonomy Management",
      children: [
        {
          key: join(bp, "taxonomy/languages"),
          icon: <GlobalOutlined />,
          label: <Link to={join(bp, "taxonomy/languages")}>Languages</Link>,
        },
        {
          key: join(bp, "taxonomy/levels"),
          icon: <RiseOutlined />,
          label: <Link to={join(bp, "taxonomy/levels")}>Levels</Link>,
        },
        {
          key: join(bp, "taxonomy/categories"),
          icon: <AppstoreOutlined />,
          label: <Link to={join(bp, "taxonomy/categories")}>Categories</Link>,
        },
        {
          key: join(bp, "taxonomy/skills"),
          icon: <TagsOutlined />,
          label: <Link to={join(bp, "taxonomy/skills")}>Skills</Link>,
        },
        {
          key: join(bp, "taxonomy/specializations"),
          icon: <ApartmentOutlined />,
          label: (
            <Link to={join(bp, "taxonomy/specializations")}>
              Specializations
            </Link>
          ),
        },
        {
          key: join(bp, "taxonomy/recruitment-types"),
          icon: <BranchesOutlined />,
          label: (
            <Link to={join(bp, "taxonomy/recruitment-types")}>
              Recruitment Types
            </Link>
          ),
        },
      ],
    },

    // Content
    {
      key: "content",
      icon: <AppstoreOutlined />,
      label: "Content",
      children: [
        {
          key: join(bp, "content/blogs"),
          label: <Link to={join(bp, "content/blogs")}>Blogs</Link>,
        },

        ...(cfg.showFeedbacks
          ? ([
              {
                key: join(bp, "feedbacks"),
                label: <Link to={join(bp, "feedbacks")}>Feedbacks</Link>,
              },
            ] as ItemType[])
          : []),
      ],
    },

    // Reports (all 3 roles) - single page
    {
      key: join(bp, "reports"),
      icon: <BarChartOutlined />,
      label: <Link to={join(bp, "reports")}>Reports</Link>,
    },
  ];

  return items;
};
