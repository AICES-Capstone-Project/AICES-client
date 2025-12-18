import { useEffect, useMemo, useState } from "react";
import type { TablePaginationConfig } from "antd/es/table";
import { Card, message } from "antd";

import { bannerService } from "../../../../services/bannerService";
import type { BannerConfig } from "../../../../types/banner.types";

import BannerToolbar from "./components/BannerToolbar";
import BannerTable from "./components/BannerTable";
import BannerModal from "./components/BannerModal";

const DEFAULT_PAGE_SIZE = 10;

export default function BannerList() {
  const [loading, setLoading] = useState(false);

  // ✅ raw list
  const [allBanners, setAllBanners] = useState<BannerConfig[]>([]);
  const [keyword, setKeyword] = useState("");

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    showSizeChanger: true,
  });

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<BannerConfig | null>(null);

  // ✅ fetch full list (không search BE)
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await bannerService.getAllSystem({
        page: 1,
        pageSize: 1000,
        search: undefined, // ✅ FE filter only
      });

      const data = res?.data?.data;
      const list: BannerConfig[] = data?.bannerConfigs || [];

      setAllBanners(list);
    } catch {
      message.error("Failed to load banners");
      setAllBanners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ realtime filter (case-insensitive)
  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return allBanners;

    return allBanners.filter((b) =>
      String(b.title || "").toLowerCase().includes(kw)
    );
  }, [allBanners, keyword]);

  // ✅ update total + reset page when keyword changes
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      current: 1,
      total: filtered.length,
    }));
  }, [filtered.length]);

  // ✅ slice for table
  const paged = useMemo(() => {
    const current = pagination.current || 1;
    const pageSize = pagination.pageSize || DEFAULT_PAGE_SIZE;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    return filtered.slice(start, end);
  }, [filtered, pagination.current, pagination.pageSize]);

  const handleTableChange = (p: TablePaginationConfig) => {
    setPagination((prev) => ({
      ...prev,
      current: p.current || 1,
      pageSize: p.pageSize || prev.pageSize || DEFAULT_PAGE_SIZE,
    }));
  };

  const handleDelete = async (id: number) => {
    try {
      await bannerService.delete(id);
      message.success("Deleted banner successfully");
      fetchData();
    } catch {
      message.error("Failed to delete banner");
    }
  };

  const handleReload = () => {
    // ✅ đúng nghĩa Reload: refetch + clear search + back page 1
    setKeyword("");
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchData();
  };

  const handleOpenCreate = () => {
    setEditData(null);
    setOpen(true);
  };

  const handleEdit = (banner: BannerConfig) => {
    setEditData(banner);
    setOpen(true);
  };

  return (
    <div>
      <Card className="aices-card">
        <div className="company-header-row">
          <div className="company-left">
            <BannerToolbar
              keyword={keyword}
              onKeywordChange={setKeyword}
              onReload={handleReload}
              onCreate={handleOpenCreate}
            />
          </div>
        </div>

        <div className="accounts-table-wrapper">
          <BannerTable
            loading={loading}
            data={paged}
            pagination={{
              ...pagination,
              total: filtered.length,
            }}
            onChangePage={handleTableChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {open && (
          <BannerModal
            open={open}
            onClose={() => setOpen(false)}
            fetchData={fetchData}
            editData={editData}
          />
        )}
      </Card>
    </div>
  );
}
