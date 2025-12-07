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
				background:
					"linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 33%, var(--color-primary-medium) 66%, var(--color-primary-light) 100%)",
				padding: "32px",
				borderRadius: 12,
				marginBottom: 24,
				color: "white",
				boxShadow: "0 8px 24px rgba(9, 37, 22, 0.18)",
				maxWidth: "50%",
				margin: "0 auto 24px",
			}}
		>
			<div style={{ marginBottom: 24, textAlign: "center" }}>
				<h2
					style={{
						color: "rgba(255,255,255,0.8)",
						fontSize: 20,
						fontWeight: 600,
					}}
				>
					{subscriptionName || "Premium subscription plan"}
				</h2>
				{description && (
					<p
						style={{
							color: "rgba(255,255,255,0.7)",
							fontSize: 14,
							marginTop: 8,
							marginBottom: 0,
						}}
					>
						{description}
					</p>
				)}
			</div>

			<div
				style={{
					marginTop: 24,
					padding: "20px",
					background: "rgba(255,255,255,0.1)",
					borderRadius: 8,
				}}
			>
				<div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, textAlign: "center" }}>
					Included Features:
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "12px",
						alignItems: "center",
					}}
				>
					<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
						<span style={{ fontSize: 16 }}>✓</span>
						<span style={{ fontSize: 14 }}>{resumeLimit} Resume Limit / {hoursLimit} Hours</span>
					</div>
					<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
						<span style={{ fontSize: 16 }}>✓</span>
						<span style={{ fontSize: 14 }}>Retry failed CV screening</span>
					</div>
					{subscriptionName?.toLowerCase() !== "free" && (
						<>
							<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
								<span style={{ fontSize: 16 }}>✓</span>
								<span style={{ fontSize: 14 }}>Export reports (PDF, Excel)</span>
							</div>
							<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
								<span style={{ fontSize: 16 }}>✓</span>
								<span style={{ fontSize: 14 }}>Advanced CV filtering & search</span>
							</div>
						</>
					)}
					<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
						<span style={{ fontSize: 16 }}>✓</span>
						<span style={{ fontSize: 14 }}>Priority support</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SubscriptionStatsCard;
