import { useEffect, useMemo, useState } from "react";
import { Card, message } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";

import type { FeedbackDetail, FeedbackEntity } from "../../../types/feedback.types";
import { feedbackSystemService } from "../../../services/feedbackService.system";

import FeedbackToolbar from "./components/FeedbackToolbar";
import FeedbackTable from "./components/FeedbackTable";
import FeedbackDetailModal from "./components/FeedbackDetailModal";

const DEFAULT_PAGE_SIZE = 10;

export default function FeedbackList() {
  const [loading, setLoading] = useState(false);

  // ✅ raw list full
  const [all, setAll] = useState<FeedbackEntity[]>([]);
  const [keyword, setKeyword] = useState("");

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    showSizeChanger: true,
  });

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState<FeedbackDetail | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      // ✅ fetch nhiều để FE search toàn bộ
      const res = await feedbackSystemService.getFeedbacks({
        page: 1,
        pageSize: 1000,
      });

      const apiRes = res.data;

      if (apiRes.status !== "Success" || !apiRes.data) {
        message.error(apiRes.message || "Failed to load feedbacks.");
        setAll([]);
        return;
      }

      setAll(apiRes.data.feedbacks || []);
    } catch (e) {
      console.error(e);
      message.error("Failed to load feedbacks. Please try again.");
      setAll([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ realtime filter (case-insensitive)
  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return all;

    return all.filter((x) =>
      String(x.userName || "").toLowerCase().includes(kw)
    );
  }, [all, keyword]);

  // ✅ update total + reset page when keyword changes or list changes
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      current: 1,
      total: filtered.length,
    }));
  }, [filtered.length]);

  // ✅ slice for table paging
  const paged = useMemo(() => {
    const current = pagination.current || 1;
    const pageSize = pagination.pageSize || DEFAULT_PAGE_SIZE;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    return filtered.slice(start, end);
  }, [filtered, pagination.current, pagination.pageSize]);

  const handleTableChange = (pag: TablePaginationConfig) => {
    setPagination((prev) => ({
      ...prev,
      current: pag.current || 1,
      pageSize: pag.pageSize || prev.pageSize || DEFAULT_PAGE_SIZE,
    }));
  };

  const handleReset = () => {
    setKeyword("");
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const openDetail = async (record: FeedbackEntity) => {
    setDetailOpen(true);
    setDetail(null);
    setDetailLoading(true);
    try {
      const res = await feedbackSystemService.getFeedbackById(record.feedbackId);
      const apiRes = res.data;

      if (apiRes.status !== "Success" || !apiRes.data) {
        message.error(apiRes.message || "Failed to load feedback detail.");
        return;
      }
      setDetail(apiRes.data);
    } catch (e: any) {
      console.error(e);
      message.error(e?.response?.data?.message || "Failed to load feedback detail.");
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div>
      <Card className="aices-card">
        <div className="company-header-row">
          <div className="company-left">
            <FeedbackToolbar
              keyword={keyword}
              onKeywordChange={setKeyword}
              onReset={handleReset}
            />
          </div>
        </div>

        <div className="accounts-table-wrapper">
          <FeedbackTable
            loading={loading}
            data={paged}
            pagination={{ ...pagination, total: filtered.length }}
            onChangePage={handleTableChange}
            onView={openDetail}
            formatDate={(v) => (v ? dayjs(v).format("YYYY-MM-DD HH:mm") : "-")}
          />
        </div>
      </Card>

      <FeedbackDetailModal
        open={detailOpen}
        loading={detailLoading}
        data={detail}
        onClose={() => setDetailOpen(false)}
        formatDate={(v) => (v ? dayjs(v).format("YYYY-MM-DD HH:mm") : "-")}
      />
    </div>
  );
}
