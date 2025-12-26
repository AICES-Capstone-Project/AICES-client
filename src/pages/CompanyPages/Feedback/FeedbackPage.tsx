import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { List, Rate, Button, message, Input, Card, Avatar, Row, Col, Typography, Pagination, Space } from "antd";
import defaultAvatar from "../../../assets/images/Avatar_Default.jpg";
import feedbackService from "../../../services/feedbackService";
import * as signalR from "@microsoft/signalr";
import { API_CONFIG, STORAGE_KEYS } from "../../../services/config";

export default function FeedbackPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const loadPage = async (page = 1) => {
    setLoading(true);
    try {
      const resp = await feedbackService.getMyFeedbacks({ params: { page, pageSize } });
      if (resp?.status === "Success" && resp?.data) {
        // API returns data.feedbacks and pagination metadata
        const data = resp.data;
        const feedbacks = Array.isArray(data.feedbacks) ? data.feedbacks : Array.isArray(data) ? data : [];
        setItems(feedbacks as any[]);
        setTotal(data.totalCount ?? data.total ?? feedbacks.length);
        setCurrentPage(data.currentPage ?? page);
      }
    } catch (e) {
      message.error("Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Real-time SignalR connection for feedback
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;
    if (!token) return;

    const hubUrl = `${API_CONFIG.BASE_URL.replace('/api', '')}/hubs/feedback`;
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, { accessTokenFactory: () => token })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connectionRef.current = connection;

    // Handlers for common server events - prepend new feedback
    const handleIncoming = (fb: any) => {
      try {
        setItems((s) => [fb, ...s]);
        setTotal((t) => (typeof t === 'number' ? t + 1 : t));
      } catch (e) {
        // ignore
      }
    };

    connection.on("NewFeedback", handleIncoming);
    connection.on("ReceiveFeedback", handleIncoming);

    connection.start().catch(() => { /* ignore connection errors here */ });

    return () => {
      try {
        connection.stop();
      } catch (_) { }
      connectionRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (value?: string | number | Date) => {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };


  const submitFeedback = async () => {
    if (!comment || !comment.trim()) {
      message.warning("Please enter your feedback");
      return;
    }
    setSubmitting(true);
    try {
      const resp = await feedbackService.submitFeedback({ rating, comment });
      if (resp?.status === "Success") {
        message.success("Feedback sent. Thank you!");
        setComment("");
        setRating(undefined);
        // reload current page to reflect saved item (in case server doesn't push)
        await loadPage(currentPage);
      } else {
        message.error(resp?.message || "Failed to send feedback");
      }
    } catch (e) {
      message.error("Failed to send feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card
      bordered={false}
      style={{ maxWidth: 1200, margin: "12px auto", borderRadius: 12, height: "calc(100% - 25px)" }}
      title={
        <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between", gap: 16 }}>
          <div style={{ flex: "0 0 auto" }}>
            <span className="font-semibold">Feedback</span>
          </div>

          <div style={{ flex: "0 0 auto" }}>
            <Space>
              <Button className="company-btn" onClick={() => navigate("/company/feedback-history")}>
                Feedback History
              </Button>
            </Space>
          </div>
        </div>
      }
    >
      <div style={{ width: "calc(100% - 25px)", margin: "0 auto" }}>
        <Row gutter={20}>
          <Col xs={24} lg={items && items.length > 0 ? 12 : 24}>
            <div style={{  maxHeight: "calc(100vh - 160px)", overflow: "hidden", padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "15px 0" }}>
                <Typography.Title level={4} style={{ margin: 0 }}>Send Feedback</Typography.Title>
                <Rate value={rating} onChange={(v) => setRating(v)} style={{ fontSize: 24 }} />
              </div>
      
              <div style={{ flex: 1, minHeight: "35vh", overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                <Input.TextArea
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, 400))}
                  rows={7}
                  placeholder="Write your feedback... (max 400 characters)"
                  maxLength={400}
                  showCount
                  style={{ borderRadius: 8, padding: 12, background: "#fff" }}
                />
              </div>

              <div style={{ marginTop: 14, display: "flex", gap: 8, justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ color: "#9aa6b2"}}>
                  Your feedback helps us improve
                </div>
                <Button className="company-btn" onClick={submitFeedback} loading={submitting} size="middle">
                  Submit
                </Button>
              </div>
            </div>
          </Col>

          {items && items.length > 0 && (
            <Col xs={24} lg={12}>
              <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 12, boxShadow: "0 6px 18px rgba(15,23,42,0.06)", maxHeight: "calc(100vh - 25px)", padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <Typography.Title level={4} style={{ margin: 0 }}>Recent Feedback</Typography.Title>
              </div>
              <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', maxHeight: 'calc(100vh - 150px)' }}>
                <List
                  loading={loading}
                  dataSource={items}
                  style={{ paddingRight: 8 }}
                  renderItem={(it: any) => (
                    <List.Item style={{ padding: 12, borderRadius: 8, marginBottom: 8, background: "#fff", boxShadow: "0 2px 6px rgba(2,6,23,0.03)" }}>
                      <List.Item.Meta
                        avatar={<Avatar src={it.userAvatarUrl || defaultAvatar} />}
                        title={<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ fontWeight: 600 }}>{it.userFullName || it.userName || it.userEmail || 'User'}</div>
                          <div style={{ color: "#94a3b8", fontSize: 12 }}>{formatDate(it.createdAt)}</div>
                        </div>}
                        description={<>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Rate disabled value={it.rating as any} />
                            <div style={{ marginTop: 8, color: "#334155", whiteSpace: 'pre-wrap' }}>{it.comment}</div>
                          </div>
                        </>}
                      />
                    </List.Item>
                  )}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={total}
                  onChange={(p) => loadPage(p)}
                  showSizeChanger={false}
                />
              </div>
            </div>
            </Col>
          )}
        </Row>
      </div>
    </Card>
  );
}
