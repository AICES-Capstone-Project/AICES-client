import React from "react";
import { Typography } from "antd";

const { Title, Paragraph } = Typography;

const PricingHeader: React.FC = () => {
	return (
		<div
			style={{
				background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-medium) 50%, var(--color-primary-light) 100%)`,
			}}
		>
			<div
				className="text-center flex flex-col justify-center items-center mb-16 rounded-2xl"
				style={{
					height: "200px",
					color: "white",
				}}
			>
				<Title
					level={1}
					className="!text-4xl md:!text-5xl !font-bold drop-shadow-md"
					style={{ color: "var(--color-primary-dark)" }}
				>
					Simple, <span style={{ color: "white" }}>Transparent Pricing</span>
				</Title>

				<Paragraph
					className="!text-lg mt-4 max-w-2xl"
					style={{ color: "var(--color-primary-dark)" }}
				>
					Choose the plan that fits your recruitment needs. No hidden fees,
					cancel anytime.
				</Paragraph>
			</div>
		</div>
	);
};

export default PricingHeader;
