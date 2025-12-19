import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { RankingRow } from "../ranking.content";

function statusTagColor(status: RankingRow["status"]) {
  switch (status) {
    case "Shortlisted":
      return "green";
    case "Interview":
      return "blue";
    case "Reviewing":
      return "gold";
    case "Rejected":
      return "red";
    default:
      return "default";
  }
}

const columns: ColumnsType<RankingRow> = [
  {
    title: "Candidate",
    dataIndex: "candidateName",
    key: "candidateName",
    render: (v: string, row) => (
      <div>
        <div style={{ fontWeight: 600 }}>{v}</div>
        <div style={{ opacity: 0.65, fontSize: 12 }}>
          {row.email ?? "-"}
        </div>
      </div>
    ),
  },
  {
    title: "Job",
    dataIndex: "jobTitle",
    key: "jobTitle",
    render: (v: string) => v ?? "-",
  },
  {
    title: "Score",
    dataIndex: "matchScore",
    key: "matchScore",
    sorter: (a, b) => a.matchScore - b.matchScore,
    defaultSortOrder: "descend",
    render: (v: number) => <span style={{ fontWeight: 600 }}>{v}</span>,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (v: RankingRow["status"]) => (
      <Tag color={statusTagColor(v)}>{v}</Tag>
    ),
  },
  {
    title: "Updated",
    dataIndex: "updatedAt",
    key: "updatedAt",
    render: (v: string) => v ?? "-",
  },
];

export default function RankingTable({ data }: { data: RankingRow[] }) {
  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 8, showSizeChanger: true }}
      className="ranking-table"
    />
  );
}
