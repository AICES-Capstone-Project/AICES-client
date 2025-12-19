import { Input, Select, Space, Typography } from "antd";
import type { RankingStatus } from "../ranking.content";
import { RANKING_STATUS_OPTIONS } from "../ranking.content";

const { Text } = Typography;

export default function RankingToolbar({
  keyword,
  status,
  minScore,
  onKeywordChange,
  onStatusChange,
  onMinScoreChange,
}: {
  keyword: string;
  status: RankingStatus;
  minScore: number;
  onKeywordChange: (v: string) => void;
  onStatusChange: (v: RankingStatus) => void;
  onMinScoreChange: (v: number) => void;
}) {
  return (
    <div className="ranking-toolbar">
      <Space size={12} wrap>
        <Input
          allowClear
          placeholder="Search candidate, email, job..."
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          className="ranking-search"
        />

        <Select
          value={status}
          onChange={(v) => onStatusChange(v)}
          options={RANKING_STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
          className="ranking-select"
          style={{ width: 170 }}
        />

        <Space size={6}>
          <Text type="secondary">Min score</Text>
          <Input
            type="number"
            min={0}
            max={100}
            value={minScore}
            onChange={(e) => onMinScoreChange(Number(e.target.value || 0))}
            className="ranking-minscore"
          />
        </Space>
      </Space>
    </div>
  );
}
