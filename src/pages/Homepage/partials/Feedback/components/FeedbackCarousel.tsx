import FeedbackCard from "./FeedbackCard";
import type { HomeFeedbackItem } from "./feedbackHome.mapper";

export default function FeedbackCarousel({ items }: { items: HomeFeedbackItem[] }) {
  if (!items.length) return null;

  return (
    <div className="fb-static" aria-label="Feedback">
      {items.slice(0, 3).map((item) => (
        <div className="fb-slide" key={item.id}>
          <FeedbackCard item={item} />
        </div>
      ))}
    </div>
  );
}
