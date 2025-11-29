import React, { useState } from "react";
import { Card, Button, Input, Space, Divider, Alert } from "antd";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../utils/stripe";
import CheckoutForm from "../components/payments/CheckoutForm";
import { paymentService } from "../services/paymentService";

const TestStripePayment: React.FC = () => {
	const [subscriptionId, setSubscriptionId] = useState<string>("13");
	const [clientSecret, setClientSecret] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [apiResponse, setApiResponse] = useState<any>(null);

	const handleFetchClientSecret = async () => {
		if (!subscriptionId) {
			setError("Please enter a subscription ID");
			return;
		}

		setLoading(true);
		setError(null);
		setApiResponse(null);
		setClientSecret("");

		try {
			console.log(
				"🔄 Fetching client secret for subscription:",
				subscriptionId
			);

			const response = await paymentService.createSetupIntent(
				parseInt(subscriptionId)
			);

			console.log("📦 API Response:", response);
			setApiResponse(response);

			if (response.status === "Success" && response.data?.clientSecret) {
				setClientSecret(response.data.clientSecret);
				console.log("✅ Client Secret received:", response.data.clientSecret);
			} else {
				setError(response.message || "Failed to get client secret");
			}
		} catch (err: any) {
			console.error("❌ Error:", err);
			setError(err.message || "Failed to fetch client secret");
		} finally {
			setLoading(false);
		}
	};

	const handlePaymentSuccess = () => {
		console.log("✅ Payment successful!");
		alert("Payment successful! Check console for details.");
	};

	const handlePaymentError = (error: string) => {
		console.error("❌ Payment error:", error);
		alert(`Payment error: ${error}`);
	};

	const options = clientSecret
		? {
				clientSecret,
				appearance: {
					theme: "stripe" as const,
					variables: {
						colorPrimary: "#1890ff",
						colorBackground: "#ffffff",
						colorText: "#000000",
						colorDanger: "#df1b41",
						fontFamily: "system-ui, sans-serif",
						borderRadius: "8px",
					},
				},
		  }
		: undefined;

	return (
		<div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
			<Card title="🧪 Test Stripe Payment Integration" bordered={false}>
				<Alert
					message="Test Mode"
					description="This page is for testing Stripe payment integration. Use test card: 4242 4242 4242 4242"
					type="info"
					showIcon
					style={{ marginBottom: 24 }}
				/>

				{/* Step 1: Fetch Client Secret */}
				<Card
					title="Step 1: Get Client Secret from API"
					size="small"
					style={{ marginBottom: 24 }}
				>
					<Space direction="vertical" style={{ width: "100%" }}>
						<Space>
							<Input
								placeholder="Subscription ID"
								value={subscriptionId}
								onChange={(e) => setSubscriptionId(e.target.value)}
								style={{ width: 200 }}
							/>
							<Button
								type="primary"
								onClick={handleFetchClientSecret}
								loading={loading}
							>
								Fetch Client Secret
							</Button>
						</Space>

						{error && (
							<Alert
								message="Error"
								description={error}
								type="error"
								showIcon
							/>
						)}

						{apiResponse && (
							<div>
								<Divider orientation="left">API Response</Divider>
								<pre
									style={{
										background: "#f5f5f5",
										padding: 12,
										borderRadius: 4,
										overflow: "auto",
									}}
								>
									{JSON.stringify(apiResponse, null, 2)}
								</pre>
							</div>
						)}

						{clientSecret && (
							<Alert
								message="Client Secret Received"
								description={
									<div>
										<strong>Client Secret:</strong>
										<br />
										<code
											style={{
												background: "#f0f0f0",
												padding: "2px 6px",
												borderRadius: 3,
											}}
										>
											{clientSecret}
										</code>
									</div>
								}
								type="success"
								showIcon
							/>
						)}
					</Space>
				</Card>

				{/* Step 2: Stripe Payment Form */}
				{clientSecret && options && (
					<Card title="Step 2: Enter Payment Details" size="small">
						<Elements stripe={stripePromise} options={options}>
							<CheckoutForm
								subscriptionName="Test Subscription"
								onSuccess={handlePaymentSuccess}
								onError={handlePaymentError}
							/>
						</Elements>
					</Card>
				)}

				{/* Instructions */}
				<Card
					title="📋 Test Instructions"
					size="small"
					style={{ marginTop: 24 }}
				>
					<ol>
						<li>
							<strong>Enter Subscription ID</strong> (default: 13) and click
							"Fetch Client Secret"
						</li>
						<li>
							<strong>Wait for API response</strong> - You should see the client
							secret in the response
						</li>
						<li>
							<strong>Enter test card details:</strong>
							<ul>
								<li>Card number: 4242 4242 4242 4242</li>
								<li>Expiry: Any future date (e.g., 12/34)</li>
								<li>CVC: Any 3 digits (e.g., 123)</li>
								<li>Name: Any name</li>
							</ul>
						</li>
						<li>
							<strong>Click "Xác nhận thanh toán"</strong>
						</li>
						<li>
							<strong>Check console</strong> for detailed logs
						</li>
					</ol>

					<Divider />

					<h4>🧪 Test Cards:</h4>
					<ul>
						<li>
							<strong>Success:</strong> 4242 4242 4242 4242
						</li>
						<li>
							<strong>3DS Required:</strong> 4000 0025 0000 3155
						</li>
						<li>
							<strong>Declined:</strong> 4000 0000 0000 0002
						</li>
						<li>
							<strong>Insufficient Funds:</strong> 4000 0000 0000 9995
						</li>
					</ul>
				</Card>
			</Card>
		</div>
	);
};

export default TestStripePayment;
