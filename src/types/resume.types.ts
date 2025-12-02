export interface Resume {
  resumeId: number;
  queueJobId: string;
  fileUrl: string;
  status: "Completed" | "Pending" | "Failed" | string;
  createdAt: string;
  candidateId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  aiScores: AiScore[];
}

export interface AiScore {
  scoreId: number;
  totalResumeScore: number;
  aiExplanation: string;
  createdAt: string;
  scoreDetails: ScoreDetail[];
}

export interface ScoreDetail {
  criteriaId: number;
  criteriaName: string;
  matched: number;
  score: number;
  aiNote: string;
}
