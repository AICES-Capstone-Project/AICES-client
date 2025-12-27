import { useEffect, useMemo, useState } from "react";
import "./Feedback.css";

import FeedbackCarousel from "./components/FeedbackCarousel";
import { mapFeedbackToHomeItem } from "./components/feedbackHome.mapper";

import { feedbackSystemService } from "../../../../services/feedbackService.system";
import type { FeedbackEntity, FeedbackDetail } from "../../../../types/feedback.types";

const Feedback = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<FeedbackEntity[]>([]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);

        // 1) GET ALL
        const res = await feedbackSystemService.getFeedbacks({ page: 1, pageSize: 10 });
        const list = res.data?.data?.feedbacks ?? [];

        // 2) Chọn top 3 để show homepage (rating >=4)
        const top = list.filter((f) => f.rating >= 4).slice(0, 3);

        // 3) Với cái nào comment null => GET BY ID để lấy comment thật
        const details = await Promise.all(
          top.map(async (f) => {
            if (f.comment && f.comment.trim()) return f; // đã có comment thì khỏi gọi
            const d = await feedbackSystemService.getFeedbackById(f.feedbackId);
            const detail = d.data?.data as FeedbackDetail | undefined;
            return detail ? { ...f, comment: detail.comment } : f;
          })
        );

        // 4) Gắn ngược lại vào list (để mapper dùng comment thật)
        const detailMap = new Map(details.map((d) => [d.feedbackId, d]));
        const merged = list.map((f) => detailMap.get(f.feedbackId) ?? f);

        if (alive) setItems(merged);
      } catch {
        if (alive) setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const homeItems = useMemo(() => {
    return items
      .filter((f) => f.rating >= 4)
      .slice(0, 3)
      .map(mapFeedbackToHomeItem);
  }, [items]);

  return (
    <section className="fb-section">
      <h2 className="fb-title">
        What teams say about <span className="fb-accent">AICES</span>
      </h2>

      <p className="fb-subtitle">
        Built to help HR teams and recruiters automate resume parsing, score and
        rank candidates, and make faster, more consistent hiring decisions.
      </p>

      {!loading && <FeedbackCarousel items={homeItems} />}
    </section>
  );
};

export default Feedback;
