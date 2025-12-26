import React from "react";

interface SubscriptionStatsCardProps {
	subscriptionName: string;
	resumeLimit: number;
	hoursLimit: number;
	compareLimit?: number;
	compareHoursLimit?: number;
	description?: string;
}

const SubscriptionStatsCard: React.FC<SubscriptionStatsCardProps> = ({
	subscriptionName,
	resumeLimit,
	hoursLimit,
	compareLimit,
	compareHoursLimit,
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
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					textAlign: 'center'
				}}
			>
			

			<div style={{ marginBottom: 12 }}>
				<h3 style={{ fontSize: 24, margin: 0, fontWeight: 800 }}>{subscriptionName || "Free"}</h3>
				<div style={{ color: "#6b7280", marginTop: 6, fontSize: 13 }}>{description || "Active subscription"}</div>
			</div>

			<div style={{ height: 1, background: "rgba(15,23,36,0.06)", margin: "16px 0", width: '100%' }} />

			<div style={{ fontSize: 12, color: "#6b7280", fontWeight: 700, marginBottom: 12 }}>FEATURES</div>
			<div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: 'center' }}>
				<div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: 'center' }}>
					<span style={{ color: "#10b981", fontSize: 16 }}>✓</span>
					<span style={{ fontSize: 14 }}>{resumeLimit} resumes • {hoursLimit} hours</span>
				</div>

				{typeof compareLimit !== 'undefined' && typeof compareHoursLimit !== 'undefined' && (
					<div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: 'center' }}>
						<span style={{ color: "#10b981", fontSize: 16 }}>✓</span>
						<span style={{ fontSize: 14 }}>{compareLimit} compare • {compareHoursLimit} hours</span>
					</div>
				)}

				{subscriptionName?.toLowerCase() !== "free" && (
					<>
						<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
							<span style={{ color: "#10b981", fontSize: 16 }}>✓</span>
							<span style={{ fontSize: 14 }}>Export reports (PDF, Excel)</span>
						</div>
						<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
							<span style={{ color: "#10b981", fontSize: 16 }}>✓</span>
							<span style={{ fontSize: 14 }}>Batch screening</span>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default SubscriptionStatsCard;
