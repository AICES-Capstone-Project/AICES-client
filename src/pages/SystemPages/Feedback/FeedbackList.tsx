import { useEffect, useState } from "react";
import { Card, message } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";

import type {
  FeedbackDetail,
  FeedbackEntity,
} from "../../../types/feedback.types";
import { feedbackSystemService } from "../../../services/feedbackService.system";

import FeedbackToolbar from "./components/FeedbackToolbar";
import FeedbackTable from "./components/FeedbackTable";
import FeedbackDetailModal from "./components/FeedbackDetailModal";

const DEFAULT_PAGE_SIZE = 10;

export default function FeedbackList() {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<FeedbackEntity[]>([]);
  const [keyword, setKeyword] = useState("");

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    showSizeChanger: true,
  });

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState<FeedbackDetail | null>(null);

  const filtered = list.filter((x) =>
    (x.userName || "").toLowerCase().includes(keyword.toLowerCase())
  );

  const fetchList = async (page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
    setLoading(true);
    try {
      const res = await feedbackSystemService.getFeedbacks({ page, pageSize });
      const apiRes = res.data;

      if (apiRes.status !== "Success" || !apiRes.data) {
        message.error(apiRes.message || "Failed to load feedbacks.");
        setList([]);
        setPagination((prev) => ({ ...prev, current: page, pageSize }));
        return;
      }

      setList(apiRes.data.feedbacks || []);
      setPagination((prev) => ({ ...prev, current: page, pageSize }));
    } catch (e) {
      console.error(e);
      message.error("Failed to load feedbacks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList(
      pagination.current || 1,
      pagination.pageSize || DEFAULT_PAGE_SIZE
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTableChange = (pag: TablePaginationConfig) => {
    fetchList(pag.current || 1, pag.pageSize || DEFAULT_PAGE_SIZE);
  };

  const handleSearch = () => {
    fetchList(1, pagination.pageSize || DEFAULT_PAGE_SIZE);
  };

  const handleReset = () => {
    setKeyword("");
    fetchList(1, pagination.pageSize || DEFAULT_PAGE_SIZE);
  };

  const openDetail = async (record: FeedbackEntity) => {
    setDetailOpen(true);
    setDetail(null);
    setDetailLoading(true);
    try {
      const res = await feedbackSystemService.getFeedbackById(
        record.feedbackId
      );
      const apiRes = res.data;

      if (apiRes.status !== "Success" || !apiRes.data) {
        message.error(apiRes.message || "Failed to load feedback detail.");
        return;
      }
      setDetail(apiRes.data);
    } catch (e: any) {
      console.error(e);
      message.error(
        e?.response?.data?.message || "Failed to load feedback detail."
      );
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
              onSearch={handleSearch}
              onReset={handleReset}
            />
          </div>
        </div>

        <div className="accounts-table-wrapper">
          <FeedbackTable
            loading={loading}
            data={filtered}
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
