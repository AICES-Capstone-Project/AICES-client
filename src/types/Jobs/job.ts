export type JobTag = "Full Time" | "Part Time" | "Private" | "Urgent" | "Contract";

export type Job = {
  postId: number | string;
  title: string;
  company?: string;
  logo?: string;
  city?: string;
  country?: string;
  salary_min?: number;
  salary_max?: number;
  currency?: "$" | "€" | "£";
  tags?: JobTag[];
  pin: "0" | "1";
  isFav: boolean;
};
