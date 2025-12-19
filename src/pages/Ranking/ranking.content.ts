export const RANKING_LAST_UPDATED = "December 2025";

export type RankingStatus = "All" | "Shortlisted" | "Reviewing" | "Interview" | "Rejected";

export type RankingRow = {
  id: string;
  candidateName: string;
  email?: string;
  jobTitle?: string;
  matchScore: number;
  status: Exclude<RankingStatus, "All">;
  updatedAt?: string;
};

export const RANKING_STATUS_OPTIONS: RankingStatus[] = [
  "All",
  "Shortlisted",
  "Reviewing",
  "Interview",
  "Rejected",
];

export const mockRankingRows: RankingRow[] = [
  {
    id: "c-001",
    candidateName: "Nguyen Van A",
    email: "a@example.com",
    jobTitle: "Frontend Engineer",
    matchScore: 92,
    status: "Shortlisted",
    updatedAt: "2025-12-18",
  },
  {
    id: "c-002",
    candidateName: "Tran Thi B",
    email: "b@example.com",
    jobTitle: "Frontend Engineer",
    matchScore: 86,
    status: "Reviewing",
    updatedAt: "2025-12-17",
  },
  {
    id: "c-003",
    candidateName: "Le Van C",
    email: "c@example.com",
    jobTitle: "Backend Engineer",
    matchScore: 78,
    status: "Interview",
    updatedAt: "2025-12-16",
  },
  {
    id: "c-004",
    candidateName: "Pham Thi D",
    email: "d@example.com",
    jobTitle: "QA Engineer",
    matchScore: 61,
    status: "Rejected",
    updatedAt: "2025-12-15",
  },
];
