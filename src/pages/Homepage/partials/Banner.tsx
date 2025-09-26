import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Button, Card } from "antd";

const tags = [
  { text: "Work Inquiry From Ali Tufan", type: "inquiry" },
  { text: "10k+ Candidates", type: "candidates" },
  { text: "Creative Agency - Startup", type: "agency" },
];

export default function Banner() {
  const [visibleTag, setVisibleTag] = useState(0);
  const [inView, setInView] = useState(false);

  // Controlled inputs for the search form
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const bannerId = "banner-hero";

  useEffect(() => {
    const el = document.getElementById(bannerId);
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      setVisibleTag((prev) => (prev + 1) % tags.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [inView]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Searching with:", { query, location });
  };

  return (
    <div
      id={bannerId}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(1200px 600px at 85% 20%, rgba(59,130,246,0.08), transparent), linear-gradient(180deg, #fbfbff 0%, #ffffff 100%)",
      }}
    >
      <div style={{ width: "min(1100px, 92vw)", margin: "0 auto" }}>
        <div style={{ textAlign: "left", maxWidth: 720 }}>
          <h1
            style={{
              fontSize: "clamp(24px, 3.6vw, 44px)",
              fontWeight: 800,
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            There Are <span style={{ color: "#1677ff" }}>8,386</span> Postings Here
            <br />
            For you!
          </h1>
          <p style={{ color: "#64748b", fontSize: 18, marginTop: 16 }}>
            Find Jobs, Employment & Career Opportunities
          </p>

          {/* Highlighted wrapper around search box */}
          <Card
            style={{
              marginTop: 20,
              padding: "2px 0",
              borderRadius: 16,
              boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
              border: "1px solid #e5e7eb",
            }}
          >
            <form
              role="search"
              onSubmit={handleSearchSubmit}
              style={{ display: "flex", gap: 12 }}
            >
              <Input
                size="large"
                placeholder="Job title, keywords, or company"
                prefix={<SearchOutlined />}
                style={{ flex: 1, height: 48 }}
                aria-label="Search jobs by title, keyword, or company"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                allowClear
              />
              <Input
                size="large"
                placeholder="City or postcode"
                style={{ width: 280, height: 48 }}
                aria-label="Search location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                allowClear
              />
              <Button
                type="primary"
                size="large"
                style={{ height: 48, paddingInline: 22 }}
                htmlType="submit"
              >
                Find Jobs
              </Button>
            </form>
          </Card>

          <div style={{ marginTop: 16, color: "#94a3b8", fontSize: 14 }}>
            Popular Searches: Designer, Developer, Web, iOS, PHP, Senior, Engineer
          </div>
        </div>
      </div>

      {tags.map((tag, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{
            opacity: inView && visibleTag === index ? 1 : 0,
            scale: inView && visibleTag === index ? 1 : 0.96,
            y: inView && visibleTag === index ? 0 : 20,
          }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          style={{
            position: "absolute",
            pointerEvents: "none",
            zIndex: 2,
            ...(index === 0
              ? { top: 80, right: "min(22vw, 240px)" }
              : index === 1
              ? { top: 160, right: "min(6vw, 80px)" }
              : { bottom: 80, right: "min(10vw, 120px)" }),
          }}
        >
          <Card
            size="small"
            style={{ boxShadow: "0 12px 30px rgba(2,6,23,0.10)", borderRadius: 14 }}
          >
            <div style={{ padding: "4px 10px", fontWeight: 600 }}>{tag.text}</div>
          </Card>
        </motion.div>
      ))}

      <div
        aria-hidden
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: "min(36vw, 520px)",
          height: "min(60vh, 640px)",
          background:
            "url('https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=1200&auto=format&fit=crop') center/cover no-repeat",
          borderTopLeftRadius: 28,
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,1) 18%)",
          opacity: 0.95,
        }}
      />
    </div>
  );
}
