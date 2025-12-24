import { useState } from "react";

type FeedbackItem = {
  id: number | string;
  rating?: number;
  comment?: string;
  createdAt?: string;
  userName?: string;
};

export default function FeedbackUI({
  initialFeedbacks = [],
  onSubmit,
}: {
  initialFeedbacks?: FeedbackItem[];
  onSubmit?: (payload: { rating?: number; comment: string }) => Promise<void> | void;
}) {
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(initialFeedbacks);

  const submit = async () => {
    if (!comment.trim()) return;
    setLoading(true);
    try {
      const payload = { rating, comment };
      await onSubmit?.(payload);
      // prepend locally
      const newItem: FeedbackItem = {
        id: Date.now(),
        rating,
        comment,
        createdAt: new Date().toISOString(),
        userName: "You",
      };
      setFeedbacks((s) => [newItem, ...s]);
      setComment("");
      setRating(undefined);
    } finally {
      setLoading(false);
    }
  };

  const Star = ({ filled, size = 28 }: { filled: boolean; size?: number }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "#f59e0b" : "none"}
      stroke={filled ? "#f59e0b" : "#cbd5e1"}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline-block"
    >
      <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.783 1.402 8.169L12 18.896l-7.336 3.866 1.402-8.17L.132 9.21l8.2-1.192z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submit card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Submit Feedback</h2>

          <div className="mb-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  onClick={() => setRating(i)}
                  aria-label={`Rate ${i} stars`}
                  className="hover:scale-105 transform transition"
                  style={{ background: "none", border: 0, padding: 0 }}
                >
                  <Star filled={!!rating && i <= rating} size={34} />
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={6}
            className="w-full bg-white border border-slate-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Share your feedback — what you liked, or what we can improve"
          />

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={submit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm disabled:opacity-60"
            >
              {loading ? "Sending..." : "Submit"}
            </button>

            <button
              onClick={() => {
                setRating(undefined);
                setComment("");
              }}
              className="text-sm text-slate-600 hover:underline"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Recent feedbacks */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Feedback</h2>

          <div className="space-y-4">
            {feedbacks.length === 0 && (
              <div className="text-sm text-slate-500">No feedback yet.</div>
            )}

            {feedbacks.map((f) => (
              <div key={f.id} className="border border-slate-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} filled={!!f.rating && i <= f.rating} size={18} />
                      ))}
                    </div>
                    <div className="text-sm text-slate-400">{f.userName || "Anonymous"}</div>
                  </div>
                  <div className="text-sm text-slate-400">{f.createdAt ? new Date(f.createdAt).toLocaleString() : ""}</div>
                </div>

                <p className="mt-3 text-slate-700 whitespace-pre-wrap">{f.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
