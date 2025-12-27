import type { HomeFeedbackItem } from "./feedbackHome.mapper";

export default function FeedbackCard({ item }: { item: HomeFeedbackItem }) {
  return (
    <div className="fb-card">
      <h3 className="fb-company">{item.companyName}</h3>

      <p className="fb-quote">“{item.quote}”</p>

      <div className="fb-author">
        <div className="fb-avatar">
          {item.avatarUrl ? (
            <img
              src={item.avatarUrl}
              alt={item.authorName}
              className="fb-avatar-img"
            />
          ) : (
            item.avatarText
          )}
        </div>

        <div>
          <p className="fb-author-name">{item.authorName}</p>
          {/* ✅ bỏ HR Specialist */}
        </div>
      </div>
    </div>
  );
}
