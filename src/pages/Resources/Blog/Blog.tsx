// src/pages/Resources/Blog/Blog.tsx

import "../resources.css";
import "./Blog.css";

import ResourcesLayout from "../components/ResourcesLayout";
import ResourcesSection from "../components/ResourcesSection";
import { blogSections, BLOG_LAST_UPDATED } from "./blog.content";

export default function Blog() {
  return (
    <ResourcesLayout
      title={
        <>
          AICES <span className="resources-title-accent">Blog</span>
        </>
      }
      subtitle="Insights, technology, and best practices for AI-powered recruitment"
      lastUpdated={BLOG_LAST_UPDATED}
      sections={blogSections as any}
      footerRight="Resources • Blog"
      renderSection={(section: any) => (
        <ResourcesSection key={section.id} section={section} />
      )}
    />
  );
}
