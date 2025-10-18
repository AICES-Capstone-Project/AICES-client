import api from "./api";

// Payload có thể điều chỉnh theo backend của bạn
export type ProfileUpdatePayload = {
  fullName?: string;
  birthday?: string | null;     // ISO 8601 hoặc null
  optNews?: boolean;
  optSummary?: boolean;
  showDayMonth?: boolean;
  showYear?: boolean;
  address?: string;
};

export const profileService = {
  updateMultipart: (form: FormData) =>
    api.patch("/Profile/update", form, {
      headers: { "Content-Type": "multipart/form-data" }, // optional, browser tự set boundary
    }),
};
