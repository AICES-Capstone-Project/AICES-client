import { get, post, patch, remove } from "./api";
import { API_ENDPOINTS } from "./config";

export const campaignService = {
  getCampaigns: async (page?: number, size?: number, search?: string, status?: string) => {
    try {
      const queryParams = new URLSearchParams();
      if (page !== undefined) queryParams.append('page', page.toString());
      if (size !== undefined) queryParams.append('size', size.toString());
      if (search) queryParams.append('search', search);
      if (status) queryParams.append('status', status);
      
      const url = queryParams.toString() 
        ? `${API_ENDPOINTS.CAMPAIGN.COMPANY_GET}?${queryParams.toString()}`
        : API_ENDPOINTS.CAMPAIGN.COMPANY_GET;
        
      return await get<any>(url);
    } catch (error) {
      throw error;
    }
  },

  getCampaignById: async (campaignId: number) => {
    try {
      return await get<any>(API_ENDPOINTS.CAMPAIGN.COMPANY_GET_BY_ID(campaignId));
    } catch (error) {
      throw error;
    }
  },

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

  deleteCampaign: async (campaignId: number) => {
    try {
      return await remove<any>(API_ENDPOINTS.CAMPAIGN.COMPANY_DELETE(campaignId));
    } catch (error) {
      throw error;
    }
  },

  addJobsToCampaign: async (campaignId: number, jobsOrIds: any[]) => {
    try {
      const isPrimitive = (arr: any[]) => arr.length > 0 && (typeof arr[0] === 'number' || typeof arr[0] === 'string');
      const body = isPrimitive(jobsOrIds)
        ? { jobIds: jobsOrIds.map((v: any) => Number(v)).filter((n: number) => !isNaN(n)) }
        : { jobs: (jobsOrIds || []).map((j: any) => ({ jobId: Number(j.jobId), targetQuantity: Number(j.targetQuantity) || 1 })) };
      const resp = await post<any, typeof body>(
        API_ENDPOINTS.CAMPAIGN.COMPANY_ADD_JOBS(campaignId),
        body
      );
      // Normalize empty or 204 responses into a success-shaped object
      if (resp === undefined || resp === null) {
        return { status: 'Success', message: 'Jobs added', data: null } as any;
      }
      return resp;
    } catch (error) {
      console.error("Failed to add jobs to campaign:", error);
      throw error;
    }
  },

  getCampaignJobs: async (campaignId: number) => {
    try {
      return await get<any>(API_ENDPOINTS.CAMPAIGN.COMPANY_ADD_JOBS(campaignId));
    } catch (error) {
      throw error;
    }
  },

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
