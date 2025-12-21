import { useEffect, useState } from "react";
import { Drawer, Select, Spin, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { companyService } from "../../../services/companyService";
import { toastError, toastSuccess } from "../../../components/UI/Toast";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function JoinCompanyModal({ open, onClose }: Props) {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const publicResp = await companyService.getPublicCompanies();
        if (publicResp?.status === "Success" && Array.isArray(publicResp.data)) {
          if (!mounted) return;
          setCompanies(publicResp.data || []);
          return;
        }

        const resp = await companyService.getAll({ page: 1, pageSize: 1000 });
        if (resp?.status === "Success" && resp.data && Array.isArray((resp.data as any).items)) {
          if (!mounted) return;
          setCompanies((resp.data as any).items || []);
          return;
        }

        const fallback = await companyService.getCompanies();
        if (fallback?.status === "Success" && Array.isArray(fallback.data)) {
          if (!mounted) return;
          setCompanies(fallback.data || []);
        } else {
          if (!mounted) return;
          setCompanies([]);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setCompanies([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [open]);

  const handleConfirm = async () => {
    if (!selectedCompanyId) {
      toastError("Please select a company to join");
      return;
    }
    try {
      const resp = await companyService.joinCompany(selectedCompanyId);
      if (String(resp?.status).toLowerCase() === "success") {
        toastSuccess("Join request submitted successfully");
        onClose();
        navigate("/company/pending-approval");
      } else {
        toastError("Failed to submit join request", resp?.message);
      }
    } catch (err) {
      console.error(err);
      toastError("An error occurred while joining the company");
    }
  };

  return (
    <Drawer title="Join a Company" open={open} onClose={onClose} width={520}>
      {loading ? (
        <div style={{ textAlign: "center" }}>
          <Spin />
        </div>
      ) : (
        <>
          <Select
            className="join-company-select"
            style={{ width: "100%" }}
            placeholder="Select a company to join"
            value={selectedCompanyId || undefined}
            onChange={(val) => setSelectedCompanyId(Number(val))}
            optionLabelProp="label"
            showSearch
            allowClear
            filterOption={(input, option) => {
              const label = (option?.label as string) || "";
              return label.toLowerCase().includes(String(input).toLowerCase());
            }}
          >
            {companies.map((c) => (
              <Select.Option key={c.companyId} value={c.companyId} label={c.name}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: "var(--color-primary-dark)" }}>{c.address}</div>
                </div>
              </Select.Option>
            ))}
          </Select>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
            <Button key="cancel" className="company-btn" onClick={onClose}>
              Cancel
            </Button>
            <Button key="join" className="company-btn--filled" onClick={handleConfirm}>
              Join
            </Button>
          </div>
        </>
      )}
    </Drawer>
  );
}
