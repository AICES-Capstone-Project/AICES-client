import React, { useEffect, useMemo, useState } from "react";
import type { LegalSectionItem } from "./LegalSection";

type Props = {
  sections: Pick<LegalSectionItem, "id" | "title">[];
};

export default function LegalSidebar({ sections }: Props) {
  const [activeId, setActiveId] = useState<string>(sections?.[0]?.id || "");

  const ids = useMemo(() => sections.map((s) => s.id), [sections]);

  useEffect(() => {
    if (!ids.length) return;

    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      {
        root: null,
        rootMargin: "-20% 0px -70% 0px",
        threshold: [0.1, 0.2, 0.3, 0.4],
      }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [ids]);

  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  };

  return (
    <aside className="legal-card legal-sidebar">
      <div className="legal-sidebar-title">On this page</div>
      <nav className="legal-toc">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={handleClick(s.id)}
            className={activeId === s.id ? "active" : undefined}
          >
            {s.title}
          </a>
        ))}
      </nav>
    </aside>
  );
}
