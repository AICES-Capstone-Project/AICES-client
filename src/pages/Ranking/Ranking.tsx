import "./Ranking.css";

import RankingHeader from "./components/RankingHeader";
import RankingToolbar from "./components/RankingToolbar";
import RankingTable from "./components/RankingTable";
import useRanking from "./useRanking";
import { RANKING_LAST_UPDATED } from "./ranking.content";

export default function Ranking() {
  const {
    data,
    keyword,
    status,
    minScore,
    setKeyword,
    setStatus,
    setMinScore,
  } = useRanking();

  return (
    <div className="ranking-page">
      <RankingHeader lastUpdated={RANKING_LAST_UPDATED} />

      <div className="ranking-body">
        <div className="ranking-container">
          <div className="ranking-card">
            <RankingToolbar
              keyword={keyword}
              status={status}
              minScore={minScore}
              onKeywordChange={setKeyword}
              onStatusChange={setStatus}
              onMinScoreChange={setMinScore}
            />

            <RankingTable data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
