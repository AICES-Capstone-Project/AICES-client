import { get } from './api';
import { API_ENDPOINTS } from './config';

export const systemService = {
  getCategories: async () => {
    return await get<any[]>(`${API_ENDPOINTS.SYSTEM.CATEGORIES}`);
  },

  getSpecializations: async (categoryId: number) => {
    return await get<any[]>(`${API_ENDPOINTS.SYSTEM.CATEGORIES}/${categoryId}/specializations`);
  },

  getSkills: async () => {
    return await get<any[]>(`${API_ENDPOINTS.SYSTEM.SKILLS}`);
  },

  getEmploymentTypes: async () => {
    return await get<any[]>(`${API_ENDPOINTS.SYSTEM.EMPLOYMENT_TYPES}`);
  },
};

export default systemService;
