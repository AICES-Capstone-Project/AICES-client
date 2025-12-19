import { useEffect, useMemo, useState } from "react";

export default function ResourcesSidebar({
  sections,
}: {
  sections: Array<{ id: string; title: string }>;
}) {
  const items = useMemo(() => sections ?? [], [sections]);
  const [activeId, setActiveId] = useState(items?.[0]?.id ?? "");

  useEffect(() => {
    if (!items.length) return;

    const handler = () => {
      const y = window.scrollY + 120;
      let current = items[0].id;

      for (const s of items) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        if (el.offsetTop <= y) current = s.id;
      }
      setActiveId(current);
    };

    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [items]);

  const onClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <aside className="resources-sidebar">
      <div className="resources-sidebar-card">
        <div className="resources-sidebar-title">On this page</div>

        <div className="resources-sidebar-items">
          {items.map((it) => (
            <button
              key={it.id}
              type="button"
              className={`resources-sidebar-item ${
                activeId === it.id ? "is-active" : ""
              }`}
              onClick={() => onClick(it.id)}
            >
              {it.title}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
