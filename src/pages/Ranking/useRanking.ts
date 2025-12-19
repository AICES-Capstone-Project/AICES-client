import { useMemo, useState } from "react";
import type { RankingRow, RankingStatus } from "./ranking.content";
import { mockRankingRows } from "./ranking.content";

export default function useRanking() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<RankingStatus>("All");
  const [minScore, setMinScore] = useState<number>(0);

  const data = useMemo(() => {
    const key = keyword.trim().toLowerCase();

    let rows: RankingRow[] = [...mockRankingRows];

    if (key) {
      rows = rows.filter((r) =>
        `${r.candidateName} ${r.email ?? ""} ${r.jobTitle ?? ""}`
          .toLowerCase()
          .includes(key)
      );
    }

    if (status !== "All") {
      rows = rows.filter((r) => r.status === status);
    }

    rows = rows.filter((r) => r.matchScore >= minScore);

    rows.sort((a, b) => b.matchScore - a.matchScore);

    return rows;
  }, [keyword, status, minScore]);

  return {
    data,
    keyword,
    status,
    minScore,
    setKeyword,
    setStatus,
    setMinScore,
  };
}
