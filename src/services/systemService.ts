import { get } from './api';
import { API_ENDPOINTS } from './config';

export const systemService = {
  getCategories: async () => {
    return await get<any[]>(API_ENDPOINTS.CATEGORY.PUBLIC_GET);
  },

  getSpecializations: async (categoryId: number) => {
    return await get<any[]>(API_ENDPOINTS.CATEGORY.PUBLIC_GET_SPECIALIZATIONS(categoryId));
  },

  getSkills: async () => {
    return await get<any[]>(API_ENDPOINTS.SKILL.PUBLIC_GET);
  },

  getEmploymentTypes: async () => {
    return await get<any[]>(API_ENDPOINTS.EMPLOYMENT_TYPE.PUBLIC_GET);
  },
};

export default systemService;
