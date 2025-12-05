import { useEffect, useState } from "react";
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
  const [banners, setBanners] = useState<BannerConfig[]>([]);
  const [keyword, setKeyword] = useState("");

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  });

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<BannerConfig | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await bannerService.getAllSystem({
        page: pagination.current,
        pageSize: pagination.pageSize,
        search: keyword || undefined,
      });

      const data = res.data.data;

      setBanners(data.bannerConfigs);
      setPagination((prev) => ({
        ...prev,
        total: data.totalPages * (prev.pageSize || DEFAULT_PAGE_SIZE),
      }));
    } catch (error) {
      message.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, keyword]);

  const handleTableChange = (p: TablePaginationConfig) => {
    setPagination((prev) => ({
      ...prev,
      current: p.current || 1,
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

  const handleSearch = () => {
    // reset về page 1 rồi effect fetch lại
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
  };

  const handleReload = () => {
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
        {/* 🔥 TOP BAR CHUẨN SYSTEM */}
        <div className="company-header-row">
          <div className="company-left">
            <BannerToolbar
              keyword={keyword}
              onKeywordChange={setKeyword}
              onSearch={handleSearch}
              onReload={handleReload}
              onCreate={handleOpenCreate}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="accounts-table-wrapper">
          <BannerTable
            loading={loading}
            data={banners}
            pagination={pagination}
            onChangePage={handleTableChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* MODAL */}
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
