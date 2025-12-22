// Resume Status Enums (based on new API response structure)
export type ResumeStatus = 
  | "Pending" 
  | "Completed" 
  | "Failed" 
  | "InvalidResumeData" 
  | "CorruptedFile" 
  | "Timeout" 
  | "Canceled"
  | string;

export type ApplicationStatus = 
  | "Pending" 
  | "Failed" 
  | "Reviewed" 
  | "Shortlisted" 
  | "Interview" 
  | "Rejected" 
  | "Hired"
  | string;

export type ApplicationErrorType = 
  | "InvalidJobData" 
  | "JobTitleNotMatched" 
  | "TechnicalError" 
  | null;

export interface Resume {
  resumeId: number;
  queueJobId?: string;
  fileUrl?: string;
  // New status structure
  resumeStatus?: ResumeStatus;
  applicationStatus?: ApplicationStatus;
  applicationErrorType?: ApplicationErrorType;
  // Backward compatibility for old API responses
  status?: string; // Will be mapped to resumeStatus/applicationStatus
  createdAt?: string;
  candidateId?: number;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  errorMessage?: string;
  aiScores?: AiScore[];
  // allow extra fields from backend
  [key: string]: any;
}

export interface AiScore {
  scoreId: number;
  totalResumeScore?: number;
  aiExplanation?: string;
  createdAt?: string;
  scoreDetails?: ScoreDetail[];
}

export interface ScoreDetail {
  criteriaId: number;
  criteriaName: string;
  matched: number;
  score: number;
  aiNote: string;
}

// Local UI-facing resume shape (previously defined inline in ResumeList)
export type ResumeLocal = Partial<Resume> & {
  // required locally
  resumeId: number;
  fullName?: string;
  // New status fields from API
  resumeStatus?: ResumeStatus;
  applicationStatus?: ApplicationStatus;
  applicationErrorType?: ApplicationErrorType;
  // Backward compatibility
  status?: string;
  applicationId?: number;
  campaignId?: number;
  matchSkills?: string;
  missingSkills?: string;
  score?: number | null;
  totalScore?: number | null;
  adjustedScore?: number | null;
  totalResumeScore?: number | null;
  aiExplanation?: string | null;
  errorMessage?: string | null;
  scoreDetails?: ScoreDetail[];
  aiScores?: AiScore[] | undefined;
  note?: string | null;
};
