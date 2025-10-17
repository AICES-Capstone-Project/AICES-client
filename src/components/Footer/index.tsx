import { Layout, Row, Col, Typography, Space } from "antd";
import {
	FacebookOutlined,
	InstagramOutlined,
	TwitterOutlined,
	YoutubeOutlined,
	ArrowRightOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo/logo_circle.png";

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const linkStyle: React.CSSProperties = {
	display: "flex",
	alignItems: "center",
	fontSize: "1rem",
	color: "#374151",
	textDecoration: "none",
	transition: "all 0.3s",
};

const FooterLink: React.FC<{ to: string; label: string }> = ({ to, label }) => {
	return (
		<Link
			to={to}
			style={linkStyle}
			onMouseEnter={(e) => ((e.currentTarget.style.color = "#1b4e80"))}
			onMouseLeave={(e) => ((e.currentTarget.style.color = "#374151"))}
		>
			<ArrowRightOutlined style={{ marginRight: 8, opacity: 0.6 }} />
			{label}
		</Link>
	);
};

export const Footer: React.FC = () => {
	return (
		<AntFooter
			style={{
				backgroundColor: "var(--color-primary-medium)",
				color: "#111827",
				padding: "60px 0",
			}}
		>
			<div style={{ maxWidth: "1200px", margin: "0 auto" }}>
				<Row gutter={[32, 32]}>
					{/* Logo + Info */}
					<Col xs={24} lg={8}>
						<img
							src={Logo}
							alt="Logo"
							style={{ height: 50, marginBottom: 20 }}
						/>
						<div>
							<Space direction="vertical">
								<Space>
									<Text style={{ color: "#374151" }}>Call Now:</Text>
									<Text strong style={{ fontSize: "1.25rem", color: "#111827" }}>
										(+84) 918273645
									</Text>
								</Space>
								<Text style={{ color: "#374151" }}>
									FPT University, D1 Street, Ho Chi Minh City
								</Text>
							</Space>
						</div>
					</Col>

					{/* Quick Links */}
					<Col xs={12} sm={6} lg={4}>
						<Title level={4} style={{ color: "#111827" }}>
							Quick Link
						</Title>
						<Space direction="vertical">
							<FooterLink to="about-us" label="About Us" />
							<FooterLink to="contact" label="Contact" />
							<FooterLink to="pricing" label="Pricing" />
							<FooterLink to="blog" label="Blog" />
						</Space>
					</Col>
				</Row>

				{/* Bottom Bar */}
				<div
					style={{
						borderTop: "1px solid #d1d5db",
						marginTop: 40,
						paddingTop: 20,
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						flexWrap: "wrap",
					}}
				>
					<Text style={{ color: "#374151" }}>
						© 2025 AICES - AI Powered Candidate Evaluation System for Recruiters. All rights Reserved
					</Text>
					<Space size="large" style={{ color: "#111827" }}>
						<FacebookOutlined />
						<InstagramOutlined />
						<TwitterOutlined />
						<YoutubeOutlined />
					</Space>
				</div>
			</div>
		</AntFooter>
	);
};
