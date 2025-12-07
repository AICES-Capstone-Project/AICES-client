import React from "react";
import { Drawer, Descriptions } from "antd";

interface SubscriptionDrawerProps {
	open: boolean;
	onClose: () => void;
	subscription: {
		name: string;
		description: string;
		price: number;
		duration: string;
		resumeLimit: number;
		hoursLimit: number;
	} | null;
}

const SubscriptionDrawer: React.FC<SubscriptionDrawerProps> = ({
	open,
	onClose,
	subscription,
}) => {
	return (
		<Drawer
			title="Subscription Details"
			placement="right"
			width={600}
			open={open}
			onClose={onClose}
		>
			{subscription && (
				<Descriptions bordered column={1}>
					<Descriptions.Item label="Name">
						<strong>{subscription.name}</strong>
					</Descriptions.Item>
					<Descriptions.Item label="Description">
						{subscription.description || "—"}
					</Descriptions.Item>
					<Descriptions.Item label="Price">
						{subscription.price?.toLocaleString()} VND
					</Descriptions.Item>
					<Descriptions.Item label="Duration">
						{subscription.duration}
					</Descriptions.Item>
					<Descriptions.Item label="Resume Limit">
						{subscription.resumeLimit || "—"}
					</Descriptions.Item>
					<Descriptions.Item label="Hour Limit">
						{subscription.hoursLimit || "—"}
					</Descriptions.Item>
				</Descriptions>
			)}
		</Drawer>
	);
};

export default SubscriptionDrawer;
