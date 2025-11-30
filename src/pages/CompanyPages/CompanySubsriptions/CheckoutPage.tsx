import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button, Card } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import SubscriptionCheckout from "../../../components/payments/SubscriptionCheckout";

const CheckoutPage: React.FC = () => {
	const { subscriptionId } = useParams<{ subscriptionId: string }>();
	const location = useLocation();
	const navigate = useNavigate();

	const {
		subscriptionName = "Gói đăng ký",
		price = 0,
		description = "",
		durationDays = 0,
	} = location.state || {};

	const handleSuccess = () => {
		navigate("/company/subscription-success");
	};

	const handleError = (error: string) => {
		console.error("Payment error:", error);
		// Error is already displayed in the SubscriptionCheckout component
	};

	const handleBack = () => {
		navigate("/company/subscriptions");
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				backgroundColor: "#f5f5f5",
				padding: "24px 0",
			}}
		>
			<div style={{ maxWidth: 800, margin: "0 auto" }}>
				<Button
					icon={<ArrowLeftOutlined />}
					onClick={handleBack}
					style={{ marginBottom: 16 }}
				>
					Quay lại
				</Button>

				<Card
					bordered={false}
					style={{
						borderRadius: 12,
						boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
					}}
				>
					<div style={{ marginBottom: 24 }}>
						<h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>
							Thanh toán đăng ký
						</h1>
						<p style={{ color: "#666", marginBottom: 16 }}>{description}</p>
						<div
							style={{
								backgroundColor: "#f0f5ff",
								padding: 16,
								borderRadius: 8,
								marginBottom: 16,
							}}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<div>
									<p style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>
										{subscriptionName}
									</p>
									<p style={{ color: "#666", margin: 0 }}>
										Thời hạn: {durationDays} ngày
									</p>
								</div>
								<p
									style={{
										fontSize: 24,
										fontWeight: 600,
										color: "#1677ff",
										margin: 0,
									}}
								>
									{new Intl.NumberFormat("vi-VN", {
										style: "currency",
										currency: "VND",
										minimumFractionDigits: 0,
									}).format(price)}
								</p>
							</div>
						</div>
					</div>

					{subscriptionId && (
						<SubscriptionCheckout
							subscriptionId={parseInt(subscriptionId)}
							subscriptionName={subscriptionName}
							price={price}
							currency="VND"
							onSuccess={handleSuccess}
							onError={handleError}
						/>
					)}
				</Card>
			</div>
		</div>
	);
};

export default CheckoutPage;
