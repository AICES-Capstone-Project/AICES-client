// src/pages/Resources/Blog/components/BlogToolbar.tsx
import { Input, Select } from "antd";

type SortKey = "newest" | "oldest" | "title_az" | "title_za";

export default function BlogToolbar({
  value,
  onChange,
  sort,
  onSortChange,
}: {
  value: string;
  onChange: (v: string) => void;
  sort: SortKey;
  onSortChange: (v: SortKey) => void;
}) {
  return (
    <div className="aices-blog-toolbar">
      <div className="aices-blog-toolbar-left">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by title or author"
          allowClear
          className="aices-blog-search"
        />
      </div>

      <div className="aices-blog-toolbar-right">
        <Select<SortKey>
          value={sort}
          onChange={onSortChange}
          className="aices-blog-sort"
          options={[
            { value: "newest", label: "Newest first" },
            { value: "oldest", label: "Oldest first" },
            { value: "title_az", label: "Title A–Z" },
            { value: "title_za", label: "Title Z–A" },
          ]}
        />
      </div>
    </div>
  );
}
