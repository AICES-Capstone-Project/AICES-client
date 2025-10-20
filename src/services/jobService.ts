// // Mock service: giữ data trên bộ nhớ, giả lập API latency
// export type JobStatus = "Open" | "Draft" | "Closed";
// export type EmploymentType =
//   | "Full-time"
//   | "Part-time"
//   | "Contract"
//   | "Internship";

// export interface Job {
//   jobId: number;
//   title: string;
//   department?: string | null;
//   employmentType: EmploymentType;
//   location?: string | null;
//   salaryMin?: number | null;
//   salaryMax?: number | null;
//   status: JobStatus;
//   isRemote?: boolean;
//   createdAt?: string;
// }

// export interface CreateJobRequest extends Omit<Job, "jobId" | "createdAt"> {}
// export interface UpdateJobRequest
//   extends Partial<Omit<Job, "jobId" | "createdAt">> {}

// type ApiResp<T> = {
//   status: "Success" | "Fail" | "Error";
//   data?: T;
//   message?: string;
// };
// type ListParams = { page: number; pageSize: number; keyword?: string };
// type PagedJobs = { items: Job[]; total: number };

// // seed data
// let _id = 1000;
// const now = () => new Date().toISOString();
// let JOBS: Job[] = [
//   {
//     jobId: _id++,
//     title: "Frontend Engineer",
//     department: "Engineering",
//     employmentType: "Full-time",
//     location: "Ho Chi Minh",
//     salaryMin: 1200,
//     salaryMax: 2000,
//     status: "Open",
//     isRemote: true,
//     createdAt: now(),
//   },
//   {
//     jobId: _id++,
//     title: "Data Analyst (Intern)",
//     department: "Data",
//     employmentType: "Internship",
//     location: "Remote",
//     salaryMin: 0,
//     salaryMax: 0,
//     status: "Draft",
//     isRemote: true,
//     createdAt: now(),
//   },
//   {
//     jobId: _id++,
//     title: "HR Generalist",
//     department: "HR",
//     employmentType: "Full-time",
//     location: "Hanoi",
//     salaryMin: 800,
//     salaryMax: 1200,
//     status: "Closed",
//     isRemote: false,
//     createdAt: now(),
//   },
// ];

// const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// export const jobService = {
//   list: async ({
//     page,
//     pageSize,
//     keyword,
//   }: ListParams): Promise<ApiResp<PagedJobs>> => {
//     await delay();
//     const kw = (keyword || "").trim().toLowerCase();
//     const filtered = !kw
//       ? JOBS
//       : JOBS.filter((j) =>
//           [j.title, j.department || "", j.location || ""]
//             .join(" ")
//             .toLowerCase()
//             .includes(kw)
//         );
//     const total = filtered.length;
//     const start = (page - 1) * pageSize;
//     const items = filtered.slice(start, start + pageSize);
//     return { status: "Success", data: { items, total } };
//   },

//   create: async (payload: CreateJobRequest): Promise<ApiResp<Job>> => {
//     await delay();
//     const job: Job = { ...payload, jobId: _id++, createdAt: now() };
//     JOBS.unshift(job);
//     return { status: "Success", data: job };
//   },

//   update: async (
//     id: number,
//     payload: UpdateJobRequest
//   ): Promise<ApiResp<Job>> => {
//     await delay();
//     const idx = JOBS.findIndex((j) => j.jobId === id);
//     if (idx < 0) return { status: "Fail", message: "Job not found" };
//     JOBS[idx] = { ...JOBS[idx], ...payload };
//     return { status: "Success", data: JOBS[idx] };
//   },

//   remove: async (id: number): Promise<ApiResp<null>> => {
//     await delay();
//     const prevLen = JOBS.length;
//     JOBS = JOBS.filter((j) => j.jobId !== id);
//     if (JOBS.length === prevLen)
//       return { status: "Fail", message: "Job not found" };
//     return { status: "Success", data: null };
//   },
// };
