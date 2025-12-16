import React from "react";

interface SubscriptionStatsCardProps {
	subscriptionName: string;
	resumeLimit: number;
	hoursLimit: number;
	description?: string;
}

const SubscriptionStatsCard: React.FC<SubscriptionStatsCardProps> = ({
	subscriptionName,
 	resumeLimit,
 	hoursLimit,
 	description,
}) => {
	return (
		<div
			style={{
				background: "white",
				padding: "20px",
				borderRadius: 12,
				marginBottom: 24,
				color: "#111827",
				border: "1px solid rgba(15,23,36,0.06)",
				boxShadow: "0 6px 18px rgba(15,23,36,0.04)",
				width: "100%",
			}}
		>
			<div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
				<div style={{
					width: 36,
					height: 36,
					borderRadius: 10,
					background: "rgba(99,102,241,0.08)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					color: "#6366f1",
					fontSize: 18,
				}}>✓</div>

				<div>
					<div style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>Kế hoạch hiện tại</div>
				</div>
			</div>

			<div style={{ marginBottom: 12 }}>
				<h3 style={{ fontSize: 24, margin: 0, fontWeight: 800 }}>{subscriptionName || "Miễn phí"}</h3>
				<div style={{ color: "#6b7280", marginTop: 6, fontSize: 13 }}>{description || "Đăng ký đang hoạt động"}</div>
			</div>

			<div style={{ height: 1, background: "rgba(15,23,36,0.06)", margin: "16px 0" }} />

			<div style={{ fontSize: 12, color: "#6b7280", fontWeight: 700, marginBottom: 12 }}>TÍNH NĂNG</div>
			<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<span style={{ color: "#10b981", fontSize: 16 }}>✓</span>
					<span style={{ fontSize: 14 }}>{resumeLimit} hồ sơ • {hoursLimit} giờ</span>
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<span style={{ color: "#10b981", fontSize: 16 }}>✓</span>
					<span style={{ fontSize: 14 }}>Tất cả các tính năng đang hoạt động</span>
				</div>

				{subscriptionName?.toLowerCase() !== "free" && (
					<>
						<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
							<span style={{ color: "#10b981", fontSize: 16 }}>✓</span>
							<span style={{ fontSize: 14 }}>Xuất báo cáo (PDF, Excel)</span>
						</div>
						<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
							<span style={{ color: "#10b981", fontSize: 16 }}>✓</span>
							<span style={{ fontSize: 14 }}>Lọc CV nâng cao & tìm kiếm</span>
						</div>
					</>
				)}

				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<span style={{ color: "#10b981", fontSize: 16 }}>✓</span>
					<span style={{ fontSize: 14 }}>Hỗ trợ ưu tiên</span>
				</div>
			</div>
		</div>
	);
};

export default SubscriptionStatsCard;
