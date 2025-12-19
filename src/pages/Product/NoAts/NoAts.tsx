// src/pages/Product/NoAts/NoAts.tsx

import "../product.css";
import "./NoAts.css";

import ProductLayout from "../components/ProductLayout";
import ProductSection from "../components/ProductSection";
import { noAtsSections, NO_ATS_LAST_UPDATED } from "./noats.content";

export default function NoAts() {
  return (
    <ProductLayout
      title={
        <>
          No ATS? <span className="product-title-accent">No Problem!</span>
        </>
      }
      subtitle="AICES is your all-in-one AI-driven recruitment hub for teams without a traditional ATS."
      lastUpdated={NO_ATS_LAST_UPDATED}
      sections={noAtsSections as any}
      footerRight="Product • No ATS? No Problem!"
      renderSection={(section) => <ProductSection key={section.id} section={section} />}
    />
  );
}
