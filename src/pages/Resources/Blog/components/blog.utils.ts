// src/pages/Resources/Blog/components/blog.utils.ts
export const stripHtml = (html: string) =>
  (html || "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const makeExcerpt = (html: string, max = 150) => {
  const text = stripHtml(html);
  if (!text) return "—";
  return text.length <= max ? text : `${text.slice(0, max).trim()}…`;
};

export const safeThumb = (url?: string | null) => {
  if (!url) return null;
  const u = String(url).trim();
  if (!u) return null;
  return u;
};
