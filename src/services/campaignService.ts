import { get, post, patch, remove } from "./api";
import { API_ENDPOINTS } from "./config";

export const campaignService = {
  // Get all campaigns for company
  getCampaigns: async () => {
    try {
      return await get<any>(API_ENDPOINTS.CAMPAIGN.COMPANY_GET);
    } catch (error) {
      throw error;
    }
  },

  // Get campaign by ID
  getCampaignById: async (campaignId: number) => {
    try {
      return await get<any>(API_ENDPOINTS.CAMPAIGN.COMPANY_GET_BY_ID(campaignId));
    } catch (error) {
      throw error;
    }
  },

  // Create new campaign
  createCampaign: async (data: {
    title: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    department?: string;
    owner?: string;
    jobIds?: number[];
  }) => {
    try {
      return await post<any, typeof data>(
        API_ENDPOINTS.CAMPAIGN.COMPANY_POST,
        data
      );
    } catch (error) {
      throw error;
    }
  },

  // Update campaign status
  updateCampaignStatus: async (
    campaignId: number,
    status: string
  ) => {
    try {
      return await patch<any, { status: string }>(
        API_ENDPOINTS.CAMPAIGN.COMPANY_UPDATE_STATUS(campaignId),
        { status }
      );
    } catch (error) {
      throw error;
    }
  },

  // Update campaign (partial)
  updateCampaign: async (campaignId: number, data: any) => {
    try {
      return await patch<any, typeof data>(
        API_ENDPOINTS.CAMPAIGN.COMPANY_UPDATE(campaignId),
        data
      );
    } catch (error) {
      throw error;
    }
  },

  // Patch campaign (full/partial update) with normalized response
  patchCampaign: async (
    campaignId: number,
    data: {
      title?: string;
      description?: string;
      startDate?: string;
      endDate?: string;
      status?: string;
      jobs?: Array<{ jobId: number; targetQuantity?: number }>;
      jobIds?: number[];
    }
  ) => {
    try {
      return await patch<any, typeof data>(
        API_ENDPOINTS.CAMPAIGN.COMPANY_UPDATE(campaignId),
        data
      );
    } catch (error) {
      throw error;
    }
  },

  // Delete campaign
  deleteCampaign: async (campaignId: number) => {
    try {
      return await remove<any>(API_ENDPOINTS.CAMPAIGN.COMPANY_DELETE(campaignId));
    } catch (error) {
      throw error;
    }
  },

  // Add jobs to campaign. Accepts either an array of jobIds (number[])
  // or an array of job objects [{ jobId, targetQuantity }].
  addJobsToCampaign: async (campaignId: number, jobsOrIds: any[]) => {
    try {
      const isPrimitive = (arr: any[]) => arr.length > 0 && (typeof arr[0] === 'number' || typeof arr[0] === 'string');
      const body = isPrimitive(jobsOrIds)
        ? { jobIds: jobsOrIds.map((v: any) => Number(v)).filter((n: number) => !isNaN(n)) }
        : { jobs: (jobsOrIds || []).map((j: any) => ({ jobId: Number(j.jobId), targetQuantity: Number(j.targetQuantity) || 1 })) };
      return await post<any, typeof body>(
        API_ENDPOINTS.CAMPAIGN.COMPANY_ADD_JOBS(campaignId),
        body
      );
    } catch (error) {
      console.error("Failed to add jobs to campaign:", error);
      throw error;
    }
  },

  // Get jobs that belong to a campaign
  getCampaignJobs: async (campaignId: number) => {
    try {
      return await get<any>(API_ENDPOINTS.CAMPAIGN.COMPANY_ADD_JOBS(campaignId));
    } catch (error) {
      throw error;
    }
  },

  // Remove jobs from campaign
  removeJobsFromCampaign: async (campaignId: number, jobIds: number[]) => {
    try {
      return await remove<any>(
        API_ENDPOINTS.CAMPAIGN.COMPANY_REMOVE_JOBS(campaignId),
        { data: { jobIds } }
      );
    } catch (error) {
      throw error;
    }
  },
};
