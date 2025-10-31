export interface Company {
  companyId: number;
  name: string;
  domain?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  size?: string | null; // e.g. "51-200"
  logoUrl?: string | null;
  isActive: boolean;
  createdAt: string; // ISO
}

export interface CompanyMember {
  userId: number;
  fullName?: string | null;
  email: string;
  roleName: string; // HR Manager / HR Recruiter / System Staff...
  joinedAt: string; // ISO
  isActive: boolean;
}

export interface CreateCompanyRequest {
  name: string;
  description: string;
  address: string;
  website: string;
  taxCode: string;
  logoFile: string;
  documentFiles: boolean;
  documentTypes: boolean;
}

export interface Job {
  jobId: number;
  companyId: number;
  title: string;
  location?: string | null;
  department?: string | null;
  status: "Open" | "Closed" | "Draft";
  createdAt: string;
  updatedAt: string;
  openings?: number;
}

export interface Resume {
  resumeId: number;
  jobId: number;
  candidateName: string;
  email?: string | null;
  phone?: string | null;
  score?: number; // match score %
  stage: "Applied" | "Screening" | "Interview" | "Offer" | "Rejected" | "Hired";
  submittedAt: string;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}
