// src/pages/Homepage/partials/hero/cvTemplates.ts

export interface CvTemplate {
  id: number;
  img: string;
  link: string;
}

// ✅ import đúng file đang có trong src/assets/images
import cvSample from "../../../../assets/images/CV.jpg";

export const cvTemplates: CvTemplate[] = Array.from({ length: 10 }).map(
  (_, index) => ({
    id: index + 1,
    img: cvSample, // hiện tại 10 cái cùng 1 hình, sau này bạn đổi từng cái cũng được
    link: "/login",
  })
);
