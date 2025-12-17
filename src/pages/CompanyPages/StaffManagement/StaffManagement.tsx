import { useState, useEffect } from "react";
import { Card, Button, Input, Badge } from "antd";
import { SearchOutlined, BellOutlined } from "@ant-design/icons";
import { companyService } from "../../../services/companyService";
import { invitationService } from "../../../services/invitationService";
import type { CompanyMember } from "../../../types/company.types";
import StaffTable from "./components/StaffTable";
import PendingMembersDrawer from "./components/PendingMembersDrawer";
import { useAppSelector } from "../../../hooks/redux";
import { ROLES } from "../../../services/config";
import {
	toastError,
	toastSuccess,
} from "../../../components/UI/Toast";

const StaffManagement = () => {
	const [members, setMembers] = useState<CompanyMember[]>([]);
	const [filteredMembers, setFilteredMembers] = useState<CompanyMember[]>([]);
	const [loading, setLoading] = useState(false);
	const [sending, setSending] = useState(false);
	const [pendingDrawerOpen, setPendingDrawerOpen] = useState(false);
	const [pendingRequests, setPendingRequests] = useState<any[]>([]);
	const [inviteEmail, setInviteEmail] = useState("");

	const auth = useAppSelector((state) => state.auth);
	const user = auth?.user;
	const isHrManager =
		(user?.roleName || "").toLowerCase() ===
		(ROLES.Hr_Manager || "").toLowerCase();

	// Fetch company members data
	const fetchMembers = async () => {
		setLoading(true);
		try {
			const response = await companyService.getMembers();
			if (response?.status === "Success" || response?.status === "success") {
				const data = response.data;
				// API might return an array directly or a paginated object with items
				const membersData: CompanyMember[] = Array.isArray(data)
					? data
					: data?.items || [];
				setMembers(membersData);
				setFilteredMembers(membersData);
			} else {
				toastError("Failed to fetch staff members");
			}
		} catch (error) {
			console.error("Error fetching staff members:", error);
			toastError("Error fetching staff members");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMembers();
	}, []);

	const fetchJoinRequests = async () => {
		// Only HR_Manager can fetch join requests
		if (!isHrManager) {
			setPendingRequests([]);
			return;
		}

		try {
			const resp = await companyService.getJoinRequests();
			if (resp?.status === "Success" || resp?.status === "success") {
				setPendingRequests(resp.data || []);
			} else {
				setPendingRequests([]);
				toastError("Failed to fetch pending members");
			}
		} catch (err) {
			console.error("Error fetching join requests:", err);
			setPendingRequests([]);
			toastError("Error fetching pending members");
		}
	};

	// Load pending join requests when component mounts so badge count is available immediately
	useEffect(() => {
		if (isHrManager) {
			fetchJoinRequests();
		}
	}, [isHrManager]);

	// Polling fallback for realtime updates: refresh pending requests and members periodically
	useEffect(() => {
		if (!isHrManager) return; // only poll for HR managers
		let mounted = true;
		const intervalMs = 10000; // 10 seconds
		const id = setInterval(async () => {
			if (!mounted) return;
			try {
				await fetchJoinRequests();
				await fetchMembers();
			} catch (e) {
				// ignore polling errors
			}
		}, intervalMs);

		return () => {
			mounted = false;
			clearInterval(id);
		};
	}, [isHrManager]);

	const handleDelete = (member: CompanyMember) => {
		setMembers((prev) => prev.filter((m) => m.comUserId !== member.comUserId));
		setFilteredMembers((prev) =>
			prev.filter((m) => m.comUserId !== member.comUserId)
		);

		toastSuccess("Member removed successfully");
	};


	const handleChangeStatus = async (member: CompanyMember, status: string) => {
		if (!member?.comUserId) return;
		try {
			const resp = await companyService.updateJoinRequestStatus(
				member.comUserId,
				status
			);
			if (resp?.status === "Success" || resp?.status === "success") {
				toastSuccess(`Member ${status.toLowerCase()} successfully`);
				// refresh lists
				fetchJoinRequests();
				fetchMembers();
			} else {
				toastError(`Failed to ${status.toLowerCase()} member`, resp?.message);
			}
		} catch (err) {
			console.error(`Error updating join status to ${status}:`, err);
			toastError(`Error updating member status`);
		}
	};

	// Inline invite submission (used by the input + button)
	const handleInviteSubmit = async () => {
		if (!inviteEmail || inviteEmail.trim() === "") {
			toastError("Please enter an email");
			return;
		}

		setSending(true);
		try {
			const payload: any = { email: inviteEmail };
			const resp = await invitationService.sendInvitation(payload);

			if (resp?.status === "Success" || resp?.status === "success") {
				toastSuccess(`Invitation sent to ${inviteEmail}`);
				setInviteEmail("");
				// refresh members list
				await fetchMembers();
			} else {
				toastError("Failed to send invitation", resp?.message);
			}
		} catch (err) {
			console.error("Error sending invitation:", err);
			toastError("Error sending invitation");
		} finally {
			setSending(false);
		}
	};

	const handleOpenPending = async () => {
		setPendingDrawerOpen(true);
		await fetchJoinRequests();
	};

	const handleApproveRequest = async (req: any) => {
		if (!req?.comUserId) return;
		try {
			const resp = await companyService.updateJoinRequestStatus(
				req.comUserId,
				"Approved"
			);
			if (resp?.status === "Success" || resp?.status === "success") {
				toastSuccess("Member approved");
				fetchJoinRequests();
				fetchMembers();
			} else {
				toastError("Failed to approve member");
			}
		} catch (err) {
			console.error("Approve error:", err);
			toastError("Error approving member");
		}
	};

	const handleRejectRequest = async (req: any) => {
		if (!req?.comUserId) return;
		try {
			const resp = await companyService.updateJoinRequestStatus(
				req.comUserId,
				"NotApplied"
			);
			if (resp?.status === "Success" || resp?.status === "success") {
				toastSuccess("Member rejected");
				fetchJoinRequests();
				fetchMembers();
			} else {
				toastError("Failed to reject member");
			}
		} catch (err) {
			console.error("Reject error:", err);
			toastError("Error rejecting member");
		}
	};

	// Search handler
	const handleSearch = (value: string) => {
		const filtered = members.filter(
			(member) =>
				member.fullName?.toLowerCase().includes(value.toLowerCase()) ||
				member.email?.toLowerCase().includes(value.toLowerCase()) ||
				member.roleName?.toLowerCase().includes(value.toLowerCase())
		);
		setFilteredMembers(filtered);
	};

	return (
		<>
			<Card
				title={
					<div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 16 }}>
						<div style={{ flex: '0 0 auto' }}>
							<span style={{ fontWeight: 600 }}>Staff Management</span>
						</div>

						<div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
							<Input
								placeholder="Search by name, email, or role..."
								prefix={<SearchOutlined />}
								allowClear
								style={{ width: 360 }}
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</div>

						<div style={{ flex: '0 0 auto' }}>
							<div>
								{/* <Button
								className="company-btn--filled"
								icon={<PlusOutlined />}
								onClick={() => setDrawerOpen(true)}
							>
								Invite New Staff
							</Button> */}
								{isHrManager && (
									<Button
										className="company-btn"
										style={{ marginLeft: 8 }}
										onClick={handleOpenPending}
									>
										<Badge
											className="company-badge"
											count={pendingRequests.length}
											size="small"
											offset={[-2, 1]}
										>
											<BellOutlined
												style={{
													fontSize: 16,
													color: "var(--color-primary-medium) !important",
												}}
											/>
										</Badge>
										<span className="ml-2">Pending Members</span>
									</Button>
								)}
							</div>
						</div>
					</div>
				}
				style={{
					maxWidth: 1200,
					margin: "12px auto",
					padding: "0 5px",
					borderRadius: 12,
					boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
					// Constrain card height to viewport and make inner content scroll when needed
					height: 'calc(100% - 25px)',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<div className="w-full" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
					{/* Full-width invite row */}
					<div style={{ width: '100%', boxSizing: 'border-box', padding: '12px 16px', background: 'transparent' }}>
						<div style={{ maxWidth: "80%", margin: '0 auto', display: 'flex', gap: 8, alignItems: 'center' }}>
							<Input
								placeholder="Nhập email"
								value={inviteEmail}
								onChange={(e) => setInviteEmail(e.target.value)}
								style={{ flex: 1 }}
							/>

							<Button className="company-btn--filled" loading={sending} onClick={handleInviteSubmit}>
								Send request
							</Button>
						</div>
					</div>

					<div style={{ flex: 1, overflow: 'auto' }}>
						<StaffTable
							members={filteredMembers}
							loading={loading}
							onDelete={handleDelete}
							onChangeStatus={handleChangeStatus}
						/>
					</div>
				</div>

				<PendingMembersDrawer
					open={pendingDrawerOpen}
					onClose={() => setPendingDrawerOpen(false)}
					requests={pendingRequests}
					onApprove={async (r) => {
						await handleApproveRequest(r);
					}}
					onReject={async (r) => {
						await handleRejectRequest(r);
					}}
				/>
			</Card>
		</>
	);
};

export default StaffManagement;
