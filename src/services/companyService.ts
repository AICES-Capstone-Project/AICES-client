// src/services/companyService.ts
// ✅ PURE MOCK SERVICE – KHÔNG CẦN API

import type {
  Company,
  CompanyMember,
  Job,
  Resume,
  Paginated,
} from "../types/company.types";

// --- helpers ---
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

function paginate<T>(arr: T[], page = 1, pageSize = 10): Paginated<T> {
  const start = (page - 1) * pageSize;
  const items = arr.slice(start, start + pageSize);
  const totalItems = arr.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  return { items, page, pageSize, totalPages, totalItems };
}

type ListParams = { page?: number; pageSize?: number; search?: string };

// --- mock data ---
const companies: Company[] = [
  {
    companyId: 1,
    name: "AICES Co.",
    domain: "aices.vn",
    email: "contact@aices.vn",
    phone: "0901 234 567",
    address: "Hà Nội",
    size: "51-200",
    logoUrl: "",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    companyId: 2,
    name: "FPT Software",
    domain: "fsoft.com",
    email: "hr@fsoft.com",
    phone: "028 1234 5678",
    address: "HCM",
    size: "1000+",
    logoUrl: "",
    isActive: true,
    createdAt: new Date(Date.now() - 86400e3).toISOString(),
  },
  {
    companyId: 3,
    name: "Startup ABC",
    domain: "abc.io",
    email: "hello@abc.io",
    phone: null as any,
    address: "Đà Nẵng",
    size: "11-50",
    logoUrl: "",
    isActive: false,
    createdAt: new Date(Date.now() - 5 * 86400e3).toISOString(),
  },
];

const membersByCompany: Record<number, CompanyMember[]> = {
  1: [
    {
      userId: 1001,
      fullName: "Minh HR",
      email: "minh.hr@aices.vn",
      roleName: "HR Manager",
      joinedAt: new Date().toISOString(),
      isActive: true,
    },
    {
      userId: 1002,
      fullName: "Lan Recruiter",
      email: "lan.r@aices.vn",
      roleName: "HR Recruiter",
      joinedAt: new Date().toISOString(),
      isActive: true,
    },
  ],
  2: [
    {
      userId: 2001,
      fullName: "Tùng HR",
      email: "tung.hr@fsoft.com",
      roleName: "HR Manager",
      joinedAt: new Date().toISOString(),
      isActive: true,
    },
  ],
  3: [],
};

const jobsByCompany: Record<number, Job[]> = {
  1: [
    {
      jobId: 101,
      companyId: 1,
      title: "Backend Engineer (Node.js)",
      location: "Hà Nội",
      department: "Engineering",
      status: "Open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      openings: 2,
    },
    {
      jobId: 102,
      companyId: 1,
      title: "QA Engineer",
      location: "Remote",
      department: "Quality",
      status: "Draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      openings: 1,
    },
  ],
  2: [
    {
      jobId: 201,
      companyId: 2,
      title: "Data Engineer",
      location: "HCM",
      department: "Data",
      status: "Open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      openings: 5,
    },
  ],
  3: [],
};

const resumesByJob: Record<string, Resume[]> = {
  // key = `${companyId}-${jobId}`
  "1-101": [
    {
      resumeId: 10001,
      jobId: 101,
      candidateName: "Nguyễn Văn A",
      email: "a@example.com",
      phone: "0909 111 222",
      score: 78,
      stage: "Screening",
      submittedAt: new Date().toISOString(),
    },
    {
      resumeId: 10002,
      jobId: 101,
      candidateName: "Trần Thị B",
      email: "b@example.com",
      phone: "0909 333 444",
      score: 86,
      stage: "Interview",
      submittedAt: new Date().toISOString(),
    },
  ],
  "1-102": [],
  "2-201": [
    {
      resumeId: 20001,
      jobId: 201,
      candidateName: "Lê C",
      email: "c@example.com",
      phone: null as any,
      score: 92,
      stage: "Offer",
      submittedAt: new Date().toISOString(),
    },
  ],
};

// --- response helper to mimic your existing shape ---
function ok<T>(data: T) {
  return { status: "Success" as const, message: undefined as string | undefined, data };
}

// --- service (mocked) ---
export const companyService = {
  async getAll(params: ListParams) {
    await delay();
    const kw = (params.search || "").toLowerCase();
    const filtered = kw
      ? companies.filter(
          (c) =>
            c.name.toLowerCase().includes(kw) ||
            (c.domain ?? "").toLowerCase().includes(kw)
        )
      : companies;
    const data = paginate(filtered, params.page ?? 1, params.pageSize ?? 10);
    return ok<Paginated<Company>>(data);
  },

  async getById(companyId: number) {
    await delay();
    const found = companies.find((c) => c.companyId === companyId) || null;
    return ok<Company | null>(found);
  },

  async getMembers(companyId: number, params: ListParams) {
    await delay();
    const list = membersByCompany[companyId] ?? [];
    const data = paginate(list, params.page ?? 1, params.pageSize ?? 10);
    return ok<Paginated<CompanyMember>>(data);
  },

  async getJobs(companyId: number, params: ListParams) {
    await delay();
    const list = jobsByCompany[companyId] ?? [];
    const data = paginate(list, params.page ?? 1, params.pageSize ?? 10);
    return ok<Paginated<Job>>(data);
  },

  async getJobDetail(companyId: number, jobId: number) {
    await delay();
    const job = (jobsByCompany[companyId] ?? []).find((j) => j.jobId === jobId) || null;
    return ok<Job | null>(job);
  },

  async getResumes(companyId: number, jobId: number, params: ListParams) {
    await delay();
    const key = `${companyId}-${jobId}`;
    const list = resumesByJob[key] ?? [];
    const data = paginate(list, params.page ?? 1, params.pageSize ?? 10);
    return ok<Paginated<Resume>>(data);
  },

  async getResumeDetail(companyId: number, jobId: number, resumeId: number) {
    await delay();
    const key = `${companyId}-${jobId}`;
    const r = (resumesByJob[key] ?? []).find((x) => x.resumeId === resumeId) || null;
    return ok<Resume | null>(r);
  },
};
