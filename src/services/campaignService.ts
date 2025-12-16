import { API_CONFIG, API_ENDPOINTS } from "./config";

export const campaignService = {
  // Get all campaigns for company
  getCampaigns: async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CAMPAIGN.COMPANY_GET}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
      throw error;
    }
  },

  // Get campaign by ID
  getCampaignById: async (campaignId: number) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CAMPAIGN.COMPANY_GET_BY_ID(campaignId)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch campaign:", error);
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
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CAMPAIGN.COMPANY_POST}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(data),
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Failed to create campaign:", error);
      throw error;
    }
  },

  // Get pending campaigns (for HR_Manager)
  getPendingCampaigns: async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CAMPAIGN.COMPANY_PENDING}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch pending campaigns:", error);
      throw error;
    }
  },

  // Get a single pending campaign by ID
  getPendingCampaignById: async (campaignId: number) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CAMPAIGN.COMPANY_PENDING_BY_ID(campaignId)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch pending campaign:", error);
      throw error;
    }
  },

  // Update campaign status
  updateCampaignStatus: async (
    campaignId: number,
    status: string
  ) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CAMPAIGN.COMPANY_UPDATE_STATUS(campaignId)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Failed to update campaign status:", error);
      throw error;
    }
  },

  // Update campaign (partial)
  updateCampaign: async (campaignId: number, data: any) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CAMPAIGN.COMPANY_UPDATE(campaignId)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(data),
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Failed to update campaign:", error);
      throw error;
    }
  },

  // Delete campaign
  deleteCampaign: async (campaignId: number) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CAMPAIGN.COMPANY_DELETE(campaignId)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Failed to delete campaign:", error);
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

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CAMPAIGN.COMPANY_ADD_JOBS(campaignId)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(body),
        }
      );
      const text = await response.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (e) {
        data = text;
      }
      const message = (data && (data.message || data.error)) || null;
      return {
        ok: response.ok,
        statusCode: response.status,
        data,
        message,
      };
    } catch (error) {
      console.error("Failed to add jobs to campaign:", error);
      throw error;
    }
  },

  // Remove jobs from campaign
  removeJobsFromCampaign: async (campaignId: number, jobIds: number[]) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CAMPAIGN.COMPANY_REMOVE_JOBS(campaignId)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({ jobIds }),
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Failed to remove jobs from campaign:", error);
      throw error;
    }
  },
};
