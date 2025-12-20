import {get } from "./api";
import { API_ENDPOINTS } from "./config";
import type { ApiResponse } from "../types/api.types";
import type { Resume, Paginated } from "../types/company.types";

export const hiringTrackingService = {
  // Fetch resumes for campaign/job and return only those with status != 'failed'
  getByJob: async (
      idOrCampaignId: number,
      maybeJobIdOrParams?: number | { page?: number; pageSize?: number },
      maybeParams?: { page?: number; pageSize?: number }
    ): Promise<ApiResponse<Paginated<Resume>>> => {
      let campaignId: number | null = null;
      let jobId: number;
      let params: { page?: number; pageSize?: number } | undefined;
  
      if (typeof maybeJobIdOrParams === "number") {
        // Called as (campaignId, jobId, params?)
        campaignId = idOrCampaignId;
        jobId = maybeJobIdOrParams;
        params = maybeParams;
      } else {
        // Called as (jobId, params?)
        jobId = idOrCampaignId;
        params = maybeJobIdOrParams as { page?: number; pageSize?: number } | undefined;
      }
  
      const q = params ? `?page=${params.page || 1}&pageSize=${params.pageSize || 10}` : "";
  
      if (campaignId != null) {
        return await get<Paginated<Resume>>(`${API_ENDPOINTS.RESUME.COMPANY_GET(campaignId, jobId)}${q}`);
      }
  
      // Fallback to legacy route if campaignId not provided
      return await get<Paginated<Resume>>(`/jobs/${jobId}/resumes${q}`);
    },
    // Normalize response list helper
    _normalizeList: (raw: any): any[] => {
      if (!raw) return [];
      if (Array.isArray(raw)) return raw;
      if (Array.isArray(raw.data)) return raw.data;
      if (Array.isArray(raw.resumes)) return raw.resumes;
      if (Array.isArray(raw.items)) return raw.items;
      return [];
    },

    // Fetch resumes for campaign/job using existing getByJob wrapper and return only those with computed score > 0
    fetchResumesScored: async (campaignId: number, jobId: number): Promise<{ ok: boolean; data?: any[]; message?: string }> => {
      try {
        const resp = await hiringTrackingService.getByJob(campaignId, jobId);
        const payload = resp && (resp as any).data ? (resp as any).data : resp;
        const list = hiringTrackingService._normalizeList(payload);

        // Note: we intentionally do not require a positive score here. We'll only exclude 'failed' resumes.

        const mapped = (list || [])
          .map((r: any) => ({
            resumeId: Number(r.resumeId ?? r.applicationId ?? 0),
            applicationId: r.applicationId ?? r.resumeId,
            fullName: r.fullName ?? r.candidateName ?? 'Unknown',
            status: String(r.applicationStatus ?? r.status ?? r.stage ?? 'Unknown'),
            appliedAt: r.createdAt ?? r.appliedAt ?? r.submittedAt ?? null,
            email: r.email ?? null,
            phone: r.phone ?? r.phoneNumber ?? null,
            fileUrl: r.fileUrl ?? null,
            // expose score fields so UI can render correctly
            totalScore: r.totalScore ?? null,
            adjustedScore: r.adjustedScore ?? null,
            totalResumeScore: r.totalResumeScore ?? (r.totalScore ?? r.adjustedScore ?? null),
            raw: r,
          }))
          .filter((m: any) => {
            const raw = m.raw;
            // Normalize status and exclude failed/pending resumes
            const statusKey = String(raw?.applicationStatus ?? raw?.status ?? raw?.stage ?? '')
              .trim()
              .toLowerCase()
              .replace(/[\s_-]+/g, '');
            if (statusKey === 'failed' || statusKey === 'pending') return false;

            // Compute effective score: prefer adjustedScore, then totalScore, then totalResumeScore
            const effective = (m.adjustedScore ?? m.totalScore ?? m.totalResumeScore);
            // Only include resumes with an effective score >= 50
            if (effective == null) return false;
            return Number(effective) >= 50;
          });

        return { ok: true, data: mapped };
      } catch (err: any) {
        console.error('hiringTrackingService.fetchResumesScored error', err);
        return { ok: false, message: (err && err.message) || 'Failed to fetch scored resumes' };
      }
    },
  
};

export default hiringTrackingService;
