import { useEffect, useMemo, useState } from "react";
import "./Feedback.css";

import FeedbackCarousel from "./components/FeedbackCarousel";
import { mapFeedbackToHomeItem } from "./components/feedbackHome.mapper";

import { feedbackSystemService } from "../../../../services/feedbackService.system";
import type { FeedbackEntity } from "../../../../types/feedback.types";

const Feedback = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<FeedbackEntity[]>([]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);

        const res = await feedbackSystemService.getFeedbacks({
          page: 1,
          pageSize: 10,
        });

        const list = res.data?.data?.feedbacks ?? [];

        if (alive) setItems(list);
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
    // Homepage: ưu tiên rating, comment null thì dùng fallback trong mapper
    return items
      .filter((f) => f.rating >= 4) // ✅ bỏ điều kiện comment
      .slice(0, 6)
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

      {/* Giữ UI sạch: loading thì vẫn show carousel bằng mock? hoặc ẩn */}
      {!loading && <FeedbackCarousel items={homeItems} />}
    </section>
  );
};

export default Feedback;
