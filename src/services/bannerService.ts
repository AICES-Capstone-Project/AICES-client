import api from "./api";

export const bannerService = {
  getAll: (params: any) =>
    api.get("/banner-configs", { params }),

  getById: (id: number) =>
    api.get(`/banner-configs/${id}`),

  create: (formData: FormData) =>
    api.post("/banner-configs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  update: (id: number, formData: FormData) =>
    api.patch(`/banner-configs/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  delete: (id: number) =>
    api.delete(`/banner-configs/${id}`)
};
