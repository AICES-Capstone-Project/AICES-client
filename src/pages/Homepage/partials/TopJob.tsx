import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Pagination } from "antd";
import JobCard from "../../../components/JobCard/JobCard";
import type { Job } from "../../../types/Jobs/job";

const { Title } = Typography;

const baseJobs: Job[] = [
  {
    postId: 1,
    title: "Software Engineer (Android), Libraries",
    company: "Segment",
    logo: "https://via.placeholder.com/96",
    city: "London",
    country: "UK",
    salary_min: 35,
    salary_max: 45,
    currency: "$",
    tags: ["Full Time", "Private", "Urgent"],
    pin: "1",
    isFav: false,
  },
  {
    postId: 2,
    title: "Backend Engineer",
    company: "Acme Corp",
    logo: "https://via.placeholder.com/96",
    city: "Berlin",
    country: "Germany",
    salary_min: 60,
    salary_max: 80,
    currency: "€",
    tags: ["Full Time"],
    pin: "1",
    isFav: true,
  },
];

const makeRepeatedJobs = (repeatCount = 8): Job[] =>
  Array.from({ length: repeatCount }, (_, i) => ({
    ...baseJobs[i % baseJobs.length],
    postId: i + 1,
  }));

export default function TopJob() {
  const [jobs, setJobs] = useState<Job[]>([]);
  useEffect(() => {
    setJobs(makeRepeatedJobs(8));
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;
  const navigate = useNavigate();

  const pinJobs = useMemo(() => jobs.filter((j) => j.pin === "1"), [jobs]);
  const currentPin = useMemo(() => {
    const indexOfLast = currentPage * jobsPerPage;
    return pinJobs.slice(indexOfLast - jobsPerPage, indexOfLast);
  }, [currentPage, pinJobs]);

  const onToggleFav = (e: React.MouseEvent, postId: Job["postId"]) => {
    e.stopPropagation();
    setJobs((prev) =>
      prev.map((j) => (j.postId === postId ? { ...j, isFav: !j.isFav } : j))
    );
  };

  const onCardClick = (postId: Job["postId"]) => {
    navigate(`jobs/job/${postId}`);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-6xl px-4 py-6 flex flex-col gap-5">
        <div className="text-center">
          <Title level={1} className="!m-0 !text-4xl !font-extrabold">
            TOP JOBS
          </Title>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 ites-stretch">
          {currentPin.map((job) => (
            <JobCard
              key={job.postId}
              job={job}
              onToggleFav={onToggleFav}
              onCardClick={onCardClick}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <Pagination
            total={pinJobs.length}
            pageSize={jobsPerPage}
            current={currentPage}
            onChange={setCurrentPage}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
}
