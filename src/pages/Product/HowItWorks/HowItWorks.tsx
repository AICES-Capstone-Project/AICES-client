import "../product.css";
import "./HowItWorks.css";

import ProductLayout from "../components/ProductLayout";
import { howItWorksSections, HOW_IT_WORKS_LAST_UPDATED } from "./howitworks.content";
import HowItWorksSection from "../components/HowItWorksSection";

import stepImg from "../../../assets/homepage/step.jpg";

export default function HowItWorks() {
  const getStepLabel = (id: string) => {
    if (id === "step-1") return "Step 1";
    if (id === "step-2") return "Step 2";
    if (id === "step-3") return "Step 3";
    return "Step";
  };

  return (
    <ProductLayout
      title={
        <>
          How <span className="product-title-accent">It Works</span>
        </>
      }
      subtitle="A simple flow from company setup to AI screening—powered by AICES."
      lastUpdated={HOW_IT_WORKS_LAST_UPDATED}
      sections={howItWorksSections as any}
      footerRight="Product • How It Works"
      renderSection={(section: any) => (
        <HowItWorksSection
          key={section.id}
          section={section}
          stepLabel={getStepLabel(section.id)}
          mediaSrc={stepImg} // dùng tạm step.jpg, bạn thay ảnh sau
        />
      )}
    />
  );
}
