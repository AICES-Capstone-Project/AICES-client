import React from "react";
import { Card, Typography, Image, Tooltip, Button } from "antd";
import { EnvironmentOutlined, StarFilled, StarOutlined } from "@ant-design/icons";
import type { Job } from "../../types/job";

const { Text } = Typography;

/* ================= Helpers ================= */
const formatSalary = (min?: number, max?: number) =>
    typeof min === "number" && typeof max === "number" ? `${min}.000 - ${max}.000 ₫` : "";

/** Badge styles theo label, dùng mapping để tránh Tailwind purge */
const TAG_STYLES: Record<string, string> = {
    "Full Time": "bg-blue-100 text-blue-700 ring-blue-200",
    Private: "bg-green-100 text-green-700 ring-green-200",
    Urgent: "bg-amber-100 text-amber-700 ring-amber-200",
};

function TagBadge({ label }: { label: string }) {
  const color = TAG_STYLES[label] ?? "bg-gray-100 text-gray-700 ring-gray-200";
  return (
    <span
      className={`inline-flex h-8 items-center justify-center px-5 rounded-xl 
                  text-xs font-medium whitespace-nowrap no-underline select-none
                  ring-1 ring-inset ${color}`}
    >
      {label}
    </span>
  );
}

/* ================= Component ================= */
type Props = {
    job: Job;
    onToggleFav: (e: React.MouseEvent, postId: Job["postId"]) => void;
    onCardClick: (postId: Job["postId"]) => void;
};

export default function JobCard({ job, onToggleFav, onCardClick }: Props) {
    const tags = Array.isArray(job.tags) ? job.tags : [];

    return (
        <Card
            hoverable
            bordered={false}
            onClick={() => onCardClick(job.postId)}
            bodyStyle={{ padding: 24 }}
            className="rounded-2xl shadow-sm hover:shadow-md transition"
        >
            <div className="h-full flex gap-4">
                {/* Logo */}
                <Image
                    src={job.logo || "https://via.placeholder.com/96"}
                    alt={`${job.company || "Company"} logo`}
                    width={52}
                    height={52}
                    preview={false}
                    className="rounded-xl object-cover self-start"
                />

                {/* Content */}
                <div className="min-w-0 flex-1 flex flex-col gap-[5px]">
                    {/* Title + bookmark */}
                    <div className="flex items-start justify-between gap-[5px]">
                        <Text
                            strong
                            className="block text-2xl leading-8 font-semibold truncate pr-2"
                        >
                            {job.title}
                        </Text>

                        <Tooltip title={job.isFav ? "Unfavorite" : "Favorite"}>
                            <Button
                                type="text"
                                size="small"
                                className="flex-shrink-0"
                                icon={
                                    job.isFav ? (
                                        <StarFilled style={{ fontSize: 20, color: "#f59e0b" }} />
                                    ) : (
                                        <StarOutlined style={{ fontSize: 20 }} />
                                    )
                                }
                                onClick={(e) => onToggleFav(e, job.postId)}
                            />
                        </Tooltip>
                    </div>

                    {/* Meta (nhỏ hơn title rõ rệt) */}
                    <div className="flex flex-wrap items-center gap-x-[5px] gap-y-[5px] text-sm text-gray-500">
                        {job.company && <span className="no-underline not-italic">{job.company}</span>}
                        {(job.city || job.country) && (
                            <span className="inline-flex items-center gap-1 no-underline not-italic">
                                <EnvironmentOutlined />
                                {[job.city, job.country].filter(Boolean).join(", ")}
                            </span>
                        )}
                        {formatSalary(job.salary_min, job.salary_max) && (
                            <span className="inline-flex items-center gap-1 no-underline not-italic">
                                {formatSalary(job.salary_min, job.salary_max)}
                            </span>
                        )}
                    </div>

                    {/* Tags: pill đẹp, đều; không dính viền; không gạch chân */}
                    {tags.length > 0 && (
                        <div className="mt-auto flex flex-wrap gap-2 mt-[5px]">
                            {tags.map((t) => (
                                <TagBadge key={t} label={t} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
