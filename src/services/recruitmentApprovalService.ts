// // In-memory mock (chưa cần backend)
// export type ApprovalStatus = "Pending" | "Approved" | "Rejected";

// export interface ApprovalRequest {
//   requestId: number;
//   fullName: string;
//   email: string;
//   companyName: string;
//   requestedRole: "Recruiter" | "HR_Manager" | "Employer";
//   note?: string | null;
//   status: ApprovalStatus;
//   requestedAt: string; // ISO
// }

// export type ListParams = { page: number; pageSize: number; keyword?: string };
// type Paged<T> = { items: T[]; total: number };
// type ApiResp<T> = { status: "Success" | "Fail" | "Error"; data?: T; message?: string };

// let _id = 2000;
// const now = () => new Date().toISOString();

// let REQUESTS: ApprovalRequest[] = [
//   {
//     requestId: _id++,
//     fullName: "Nguyen Van A",
//     email: "a@example.com",
//     companyName: "AICES Co.",
//     requestedRole: "Recruiter",
//     note: "Experienced in tech hiring",
//     status: "Pending",
//     requestedAt: now(),
//   },
//   {
//     requestId: _id++,
//     fullName: "Tran Thi B",
//     email: "b@example.com",
//     companyName: "Sunrise JSC",
//     requestedRole: "Employer",
//     note: null,
//     status: "Approved",
//     requestedAt: now(),
//   },
//   {
//     requestId: _id++,
//     fullName: "Le Hoang C",
//     email: "c@example.com",
//     companyName: "TalentHub",
//     requestedRole: "Recruiter",
//     status: "Rejected",
//     note: "Insufficient company profile",
//     requestedAt: now(),
//   },
// ];

// const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

// export const recruitmentApprovalService = {
//   list: async ({ page, pageSize, keyword }: ListParams): Promise<ApiResp<Paged<ApprovalRequest>>> => {
//     await delay();
//     const kw = (keyword || "").toLowerCase();
//     const filtered = !kw
//       ? REQUESTS
//       : REQUESTS.filter((r) =>
//           [r.fullName, r.email, r.companyName, r.requestedRole]
//             .join(" ")
//             .toLowerCase()
//             .includes(kw)
//         );

//     const total = filtered.length;
//     const start = (page - 1) * pageSize;
//     const items = filtered.slice(start, start + pageSize);
//     return { status: "Success", data: { items, total } };
//   },

//   approve: async (id: number): Promise<ApiResp<null>> => {
//     await delay();
//     const idx = REQUESTS.findIndex((x) => x.requestId === id);
//     if (idx < 0) return { status: "Fail", message: "Request not found" };
//     REQUESTS[idx] = { ...REQUESTS[idx], status: "Approved" };
//     return { status: "Success", data: null };
//   },

//   reject: async (id: number): Promise<ApiResp<null>> => {
//     await delay();
//     const idx = REQUESTS.findIndex((x) => x.requestId === id);
//     if (idx < 0) return { status: "Fail", message: "Request not found" };
//     REQUESTS[idx] = { ...REQUESTS[idx], status: "Rejected" };
//     return { status: "Success", data: null };
//   },
// };
