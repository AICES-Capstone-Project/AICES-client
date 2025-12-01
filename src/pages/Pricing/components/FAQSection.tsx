import React from "react";
import { Collapse, Typography } from "antd";
import type { FAQItem } from "../../../types/subscription.types";

const { Paragraph, Text, Title } = Typography;

type Props = {
  faqs: FAQItem[];
};

const FAQSection: React.FC<Props> = ({ faqs }) => {
  // Tạo mảng items phù hợp với cú pháp mới
  const collapseItems = faqs.map((faq, i) => ({
    key: String(i),
    label: <Text className="!text-lg !font-medium">{faq.question}</Text>,
    children: <Paragraph className="!text-slate-600">{faq.answer}</Paragraph>,
  }));

  return (
    <div className="flex items-center justify-center" style={{ padding: "50px" }}>
      <div className="max-w-3xl w-full mx-auto text-center">
        <Title level={2} className="!text-3xl !font-bold !text-primary mb-8">
          Frequently Asked Questions
        </Title>

        <Collapse
          accordion
          bordered={false}
          expandIconPosition="end"
          className="bg-white shadow-sm rounded-xl"
          items={collapseItems} // ✅ dùng items thay vì children
        />
      </div>
    </div>
  );
};

export default FAQSection;
