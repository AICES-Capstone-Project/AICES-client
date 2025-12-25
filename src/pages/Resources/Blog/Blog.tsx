// src/pages/Resources/Blog/Blog.tsx
import "../resources.css";
import "./Blog.css";

import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

import ResourcesLayout from "../components/ResourcesLayout";
import { blogService } from "../../../services/blogService";
import type { Blog } from "../../../types/blog.types";

import BlogToolbar from "./components/BlogToolbar";
import BlogGrid from "./components/BlogGrid";
import BlogPager from "./components/BlogPager";
import BlogEmpty from "./components/BlogEmpty";

type SortKey = "newest" | "oldest" | "title_az" | "title_za";

export default function BlogPage() {
  const [loading, setLoading] = useState(false);

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      setLoading(true);
      try {
        const res = await blogService.getPublicBlogs({ page, pageSize });
        if (!mounted) return;

        setBlogs(res.data.blogs ?? []);
        setTotal(res.data.total ?? 0);
      } catch {
        if (!mounted) return;
        setBlogs([]);
        setTotal(0);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [page, pageSize]);

  const lastUpdated = useMemo(() => {
    if (!blogs?.length) return "—";
    const latest = blogs
      .map((b) => b.createdAt)
      .filter(Boolean)
      .sort()
      .at(-1);
    return latest ? dayjs(latest).format("MMMM YYYY") : "—";
  }, [blogs]);

  const visibleBlogs = useMemo(() => {
    const q = search.trim().toLowerCase();

    const filtered = q
      ? (blogs ?? []).filter((b) => {
          const t = (b.title || "").toLowerCase();
          const a = (b.authorName || "").toLowerCase();
          return t.includes(q) || a.includes(q);
        })
      : blogs ?? [];

    const sorted = [...filtered].sort((x, y) => {
      const dx = new Date(x.createdAt).getTime();
      const dy = new Date(y.createdAt).getTime();

      switch (sort) {
        case "newest":
          return dy - dx;
        case "oldest":
          return dx - dy;
        case "title_az":
          return (x.title || "").localeCompare(y.title || "");
        case "title_za":
          return (y.title || "").localeCompare(x.title || "");
        default:
          return 0;
      }
    });

    return sorted;
  }, [blogs, search, sort]);

  return (
    <ResourcesLayout
      title={
        <>
          AICES <span className="resources-title-accent">Blog</span>
        </>
      }
      subtitle="Insights, technology, and best practices for AI-powered recruitment"
      lastUpdated={lastUpdated}
      footerRight="Resources • Blog"
      showSidebar={false}
    >
      {/* ✅ wrapper để Blog.css override ResourcesLayout width/max-width (hết “dính chùm”) */}
      <div className="aices-blog-layout">
        <div className="aices-blog-page">
          <BlogToolbar
            value={search}
            onChange={setSearch}
            sort={sort}
            onSortChange={setSort}
          />

          {visibleBlogs.length === 0 && !loading ? (
            <BlogEmpty />
          ) : (
            <BlogGrid blogs={visibleBlogs} loading={loading} />
          )}

          <BlogPager
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={(ps) => {
              setPage(1);
              setPageSize(ps);
            }}
          />
        </div>
      </div>
    </ResourcesLayout>
  );
}
