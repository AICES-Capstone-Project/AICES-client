import React from "react";
import { Drawer, List, Button, Empty, } from "antd";

type JoinRequest = {
  comUserId: number;
  userId: number;
  fullName?: string;
  email?: string;
  roleName?: string | null;
  requestedAt?: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  requests: JoinRequest[];
  onApprove: (req: JoinRequest) => Promise<void>;
};

const PendingMembersDrawer: React.FC<Props> = ({ open, onClose, requests, onApprove }) => {
  return (
    <Drawer title={`Pending Members (${requests.length})`} open={open} onClose={onClose} width={420}>
      {requests.length === 0 ? (
        <Empty description="No pending members" />
      ) : (
        <List
          dataSource={requests}
          renderItem={(r) => (
            <List.Item key={r.comUserId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{r.fullName || r.email}</div>
                <div style={{ fontSize: 12, color: "#666" }}>{r.email}</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Button type="primary" onClick={() => onApprove(r)} size="small">
                  Approve
                </Button>
              </div>
            </List.Item>
          )}
        />
      )}
    </Drawer>
  );
};

export default PendingMembersDrawer;
