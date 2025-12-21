export interface Resume {
  resumeId: number;
  queueJobId?: string;
  fileUrl?: string;
  status: "Completed" | "Pending" | "Failed" | string;
  createdAt?: string;
  candidateId?: number;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
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
  status?: string;
  applicationId?: number;
  applicationStatus?: string;
  campaignId?: number;
  matchSkills?: string;
  missingSkills?: string;
  score?: number | null;
  adjustedScore?: number | null;
  totalResumeScore?: number | null;
  aiExplanation?: string | null;
  errorMessage?: string | null;
  scoreDetails?: ScoreDetail[];
  aiScores?: AiScore[] | undefined;
  note?: string | null;
};
