import "../product.css";
import "./HowItWorks.css";

import ProductLayout from "../components/ProductLayout";
import {
  howItWorksSections,
  HOW_IT_WORKS_LAST_UPDATED,
} from "./howitworks.content";
import HowItWorksSection from "../components/HowItWorksSection";

// ✅ How It Works images
import step1Img from "../../../assets/images/how-it-works/huhu.png";
import step2Img from "../../../assets/images/how-it-works/hehe.png";
import step3Img from "../../../assets/images/how-it-works/haha.png";

const STEP_MEDIA_MAP: Record<string, string> = {
  "step-1": step1Img,
  "step-2": step2Img,
  "step-3": step3Img,
};

export default function HowItWorks() {
  const getStepLabel = (id: string) => {
    if (id === "step-1") return "Step 1";
    if (id === "step-2") return "Step 2";
    if (id === "step-3") return "Step 3";
    return "Step";
  };

  return (
    <ProductLayout
      pageClassName="howitworks-page"
      hideSidebar
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
          mediaSrc={STEP_MEDIA_MAP[section.id]}
        />
      )}
    />
  );
}
