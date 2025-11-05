import { useState, useEffect } from "react";
import { 
  Card, 
  Button, 
  Input, 
  message
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { companyService } from "../../../services/companyService";
import type { CompanyMember } from "../../../types/company.types";
import StaffTable from "./components/StaffTable";
import InviteDrawer from "./components/InviteDrawer";

const { Search } = Input;

const StaffManagement = () => {
  const [members, setMembers] = useState<CompanyMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<CompanyMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sending, setSending] = useState(false);

  // Fetch company members data
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await companyService.getMembers();
      if (response?.status === "Success" || response?.status === "success") {
        const membersData = response.data || [];
        setMembers(membersData);
        setFilteredMembers(membersData);
      } else {
        message.error("Failed to fetch staff members");
      }
    } catch (error) {
      console.error("Error fetching staff members:", error);
      message.error("Error fetching staff members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // table and role helpers moved into StaffTable component

  // Action handlers
  const handleView = (member: CompanyMember) => {
    message.info(`Viewing member: ${member.fullName || member.email}`);
  };

  const handleEdit = (member: CompanyMember) => {
    message.info(`Editing member: ${member.fullName || member.email}`);
  };

  const handleDelete = (member: CompanyMember) => {
    message.warning(`Remove member: ${member.fullName || member.email}`);
  };

  // Drawer form submission (mock)
  const handleInviteSubmit = async (values: { email: string }) => {
    setSending(true);
    setTimeout(() => {
      message.success(`Invitation sent to ${values.email}`);
      setSending(false);
      setDrawerOpen(false);
    }, 1000);
  };

  // Search handler
  const handleSearch = (value: string) => {
    const filtered = members.filter(member => 
      (member.fullName?.toLowerCase().includes(value.toLowerCase())) ||
      (member.email?.toLowerCase().includes(value.toLowerCase())) ||
      (member.roleName?.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredMembers(filtered);
  };

  return (
    <Card
      title={<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <span style={{ fontWeight: 600 }}>Staff Management</span>
        <div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setDrawerOpen(true)}
          >
            Invite New Staff
          </Button>
        </div>
      </div>}
      style={{
        maxWidth: 1200,
        margin: "12px auto",
        padding: "0 5px",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <div className="w-full">
        {/* Header Section */}
        <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", marginBottom: 24 }}>
          <Search
            placeholder="Search by name, email, or role..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            style={{ width: 400 }}
            onSearch={handleSearch}
          />
        </div>

        {/* Staff Table */}
        <StaffTable
          members={filteredMembers}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Invite Drawer */}
      <InviteDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onSubmit={handleInviteSubmit} submitting={sending} />
    </Card>
  );
};

export default StaffManagement;
