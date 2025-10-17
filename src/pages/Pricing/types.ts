export type PlanType = {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonType: "default" | "primary" | "link" | "text" | "dashed";
  link: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};
