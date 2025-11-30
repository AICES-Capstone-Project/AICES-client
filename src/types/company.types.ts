export interface Company {
  logoUrl: string | undefined;
  companyId: number;
  name: string;

  address?: string | null;

  companyStatus?: "Approved" | "Pending" | "Rejected" | string | null;
  rejectionReason?: string | null;

  description?: string | null;
  websiteUrl?: string | null;
  taxCode?: string | null;

  createdBy?: number;
  approvalBy?: number;
  createdAt?: string; // ISO

  
  documents?: CompanyDocument[];

}
export interface CompanyDocument {
  documentType: string;
  fileUrl: string;
  logoUrl?: string | null;
}



export interface CompanyMember {
  comUserId: number;
  userId: number;
  fullName?: string | null;
  email: string;
  roleName: string; // HR_Manager / HR_Recruiter / System_Staff...
  avatarUrl?: string | null;
  phoneNumber?: string | null;
  joinStatus: string; // Approved / Pending / Rejected
  createdAt?: string; // ISO
}

export interface CreateCompanyRequest {
  name: string;
  description: string;
  address: string;
  websiteUrl: string;
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
export interface CompaniesListData {
  companies: Company[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface ApiEnvelope<T> {
  status: string;  // "Success" | "Error" | ...
  message: string;
  data: T;
}
