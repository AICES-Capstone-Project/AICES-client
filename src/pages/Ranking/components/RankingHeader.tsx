import { Typography } from "antd";

const { Title, Text } = Typography;

export default function RankingHeader({
  lastUpdated,
}: {
  lastUpdated?: string;
}) {
  return (
    <div className="ranking-hero">
      <div className="ranking-hero-inner">
        <Title level={1} className="ranking-title">
          Candidate <span className="ranking-title-accent">Ranking</span>
        </Title>

        <Text className="ranking-subtitle">
          A placeholder page for now — later you can plug API results, filters,
          and analytics here.
        </Text>

        {lastUpdated ? (
          <div className="ranking-meta">
            <span className="ranking-meta-label">Last updated:</span>
            <span className="ranking-meta-value">{lastUpdated}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
