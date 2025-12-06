import Hero from "./partials/hero/Hero";
import WhyAicesSection from "./partials/why/WhyAicesSection";
import StepsSection from "./partials/steps/StepsSection";
import BlogSection from "./partials/blog/BlogSection";
import VideoTipsSection from "./partials/video/VideoTipsSection";
import ArticleExpand from "./partials/article/ArticleExpand";

export default function Homepage() {
  return (
    <>
      <Hero />
      <WhyAicesSection />
      <StepsSection />
      <BlogSection />
      <VideoTipsSection />
      <ArticleExpand />
    </>
  );
}
