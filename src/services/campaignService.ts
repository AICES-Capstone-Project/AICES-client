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
        `${API_CONFIG.BASE_URL}/campaigns/${campaignId}`,
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

  // Add jobs to campaign
  addJobsToCampaign: async (campaignId: number, jobIds: number[]) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CAMPAIGN.COMPANY_ADD_JOBS(campaignId)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({ jobIds }),
        }
      );
      return await response.json();
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
