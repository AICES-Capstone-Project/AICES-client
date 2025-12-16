import { useEffect, useState } from "react";
import { Card, Input, Table, Button, Tooltip, Space, Modal, message } from "antd";
import { EyeOutlined, SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import ResumeDetailDrawer from "./components/ResumeDetailDrawer";
import type { ColumnsType } from "antd/es/table";
import candidateService from "../../../services/candidateService";

const CandidateManagement = () => {
    const [candidates, setCandidates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [tableHeight, setTableHeight] = useState<number | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchText, setSearchText] = useState("");

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);

    const [pdfOpen, setPdfOpen] = useState(false);
    const [pdfUrl] = useState<string | null>(null);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [candidateToDelete, setCandidateToDelete] = useState<any | null>(null);

    const [apiTotal, setApiTotal] = useState<number>(0);

    const loadCandidates = async (page = 1, size = pageSize, searchKey = "") => {
        setLoading(true);
        try {
            const resp = await candidateService.getCandidates({
                page,
                pageSize: size,
                search: searchKey,
            });

            if (resp?.status?.toLowerCase() === "success") {
                const payload = resp.data ?? {};
                const list = payload.items ?? payload.candidates ?? [];

                setCandidates(
                    list.map((c: any) => ({
                        candidateId: c.candidateId ?? c.id,
                        candidateName: c.fullName ?? c.name,
                        email: c.email,
                        phone: c.phoneNumber,
                    }))
                );

                setCurrentPage(payload.currentPage ?? page);
                setPageSize(payload.pageSize ?? size);
                setApiTotal(payload.totalCount ?? list.length);
            }
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadCandidates(currentPage, pageSize, searchText);
    }, []);

    const handleSearch = () => {
        setCurrentPage(1);
        loadCandidates(1, pageSize, searchText);
    };

    const handleDelete = async (record: any) => {
        const id = record?.candidateId ?? record?.resumeId ?? record?.id ?? null;
        if (!id) {
            message.error("Invalid candidate id");
            return;
        }

        setLoading(true);
        try {
            const resp = await candidateService.deleteCandidate(Number(id));
            if (String(resp?.status || "").toLowerCase() === "success") {
                const newData = candidates.filter((item) => (item.candidateId ?? item.resumeId ?? item.id) !== id);
                setCandidates(newData);
                setApiTotal((prev) => Math.max(0, prev - 1));
                message.success(resp?.message || "Candidate deleted");

                if (newData.length === 0 && currentPage > 1) {
                    const prevPage = currentPage - 1;
                    setCurrentPage(prevPage);
                    await loadCandidates(prevPage, pageSize, searchText);
                }
            } else {
                message.error(resp?.message || "Unable to delete candidate");
            }
        } catch (e) {
            console.error("Failed to delete candidate:", e);
            message.error("Unable to delete candidate");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const calculate = () => {
            const reserved = 220; // px
            const h = window.innerHeight - reserved;
            setTableHeight(h > 300 ? h : 300);
        };

        calculate();
        window.addEventListener("resize", calculate);
        return () => window.removeEventListener("resize", calculate);
    }, []);

    const openResume = (record: any) => {
        const id = record?.candidateId ?? record?.resumeId ?? record?.id ?? null;
        setSelectedCandidateId(id);
        setDrawerOpen(true);
    };

    const columns: ColumnsType<any> = [
        {
            title: "No",
            key: "no",
            width: 72,
            align: "center",
            render: (_: any, __: any, index: number) =>
                (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: "Name",
            dataIndex: "candidateName",
            key: "candidateName",
            align: "center",
            width: "30%",
            ellipsis: true,
            render: (v: string) => v || "-",
        },
        { title: "Email", dataIndex: "email", key: "email", align: "center", width: "25%", ellipsis: true, render: (v: string) => v || "-" },
        { title: "Phone", dataIndex: "phone", key: "phone", align: "center", width: "15%", render: (v: string) => v || "-" },
        {
            title: "Actions",
            key: "actions",
            width: "10%",
            align: "center",
            render: (_: any, record: any) => (
                <Space size="small">
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => openResume(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Remove">
                        <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                            onClick={() => { setCandidateToDelete(record); setDeleteModalOpen(true); }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Card
            title={
                <div style={{ display: "flex", alignItems: "center", width: '100%', gap: 16 }}>
                    <div style={{ flex: '0 0 auto' }}>
                        <span className="font-semibold">Candidate</span>
                    </div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 10 }}>
                        <Input
                            placeholder="Search name, email or phone..."
                            prefix={<SearchOutlined />}
                            allowClear
                            style={{ width: 320 }}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            // [THÊM]: Bấm Enter thì gọi API search
                            onPressEnter={handleSearch}
                        />
                    </div>
                </div>
            }
            style={{
                maxWidth: 1200,
                margin: "12px auto",
                borderRadius: 12,
                height: 'calc(100% - 25px)',
            }}
        >
            <Table
                dataSource={candidates}
                columns={columns}
                rowKey="candidateId"
                loading={loading}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    showSizeChanger: false,
                    total: apiTotal,
                    showTotal: (total) => `Total ${total} candidates`,
                    showQuickJumper: true,
                    showPrevNextJumpers: true,
                    showLessItems: false,
                    onChange: (page, size) => {
                        // update local state then load
                        setCurrentPage(page);
                        if (size && size !== pageSize) setPageSize(size);
                        loadCandidates(page, size || pageSize, searchText);
                    },
                }}
                size="middle"
                tableLayout="fixed"
                className="job-table"
                scroll={{ y: tableHeight }}
                rowClassName={(_, index) => (index % 2 === 0 ? "table-row-light" : "table-row-dark")}
            />
            <ResumeDetailDrawer open={drawerOpen} candidateId={selectedCandidateId} onClose={() => { setDrawerOpen(false); setSelectedCandidateId(null); }} />

            {/* PDF preview modal (UI-only, sample PDF) */}
            <Modal open={pdfOpen} onCancel={() => setPdfOpen(false)} footer={null} width="80%" style={{ top: 20 }} bodyStyle={{ height: '80vh', padding: 0 }}>
                {pdfUrl ? (
                    <iframe src={pdfUrl} title="CV PDF" style={{ width: '100%', height: '100%', border: 0 }} />
                ) : (
                    <div style={{ padding: 24 }}>No PDF available</div>
                )}
            </Modal>
            {/* Delete confirmation modal */}
            <Modal
                title="Delete Resume"
                open={deleteModalOpen}
                onOk={async () => {
                    if (candidateToDelete) await handleDelete(candidateToDelete);
                    setDeleteModalOpen(false);
                    setCandidateToDelete(null);
                }}
                onCancel={() => { setDeleteModalOpen(false); setCandidateToDelete(null); }}
                okText="Delete"
                okButtonProps={{ danger: true }}
            >
                <p>Are you sure you want to delete this resume? This action cannot be undone.</p>
                {candidateToDelete && (
                    <div style={{ fontSize: 13, color: '#555' }}><strong>{candidateToDelete.candidateName}</strong> &mdash; {candidateToDelete.jobTitle}</div>
                )}
            </Modal>

        </Card>
    );
};

export default CandidateManagement;