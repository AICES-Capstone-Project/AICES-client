import { Layout, Row, Col, Typography, Space } from "antd";
import {
	FacebookOutlined,
	InstagramOutlined,
	TwitterOutlined,
	YoutubeOutlined,
	ArrowRightOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo/logo_white.png";

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const linkStyle: React.CSSProperties = {
	display: "flex",
	alignItems: "center",
	fontSize: "1rem",
	color: "#e5e7eb",
	textDecoration: "none",
	transition: "all 0.3s ease",
};

const FooterLink: React.FC<{ to: string; label: string }> = ({ to, label }) => {
	return (
		<Link
			to={to}
			style={linkStyle}
			onMouseEnter={(e) =>
				(e.currentTarget.style.color = "var(--color-primary-light)")
			}
			onMouseLeave={(e) => (e.currentTarget.style.color = "#e5e7eb")}
		>
			<ArrowRightOutlined style={{ marginRight: 8, opacity: 0.8 }} />
			{label}
		</Link>
	);
};

export const Footer: React.FC = () => {
	return (
		<AntFooter
			style={{
				backgroundColor: "var(--color-primary-dark)",
				color: "#f9fafb",
				paddingTop: "60px",
			}}
		>
			<div style={{ maxWidth: "1200px", margin: "0 auto" }}>
				<Row gutter={[32, 32]}>
					<Col xs={24} lg={8}>
						<img
							src={Logo}
							alt="Logo"
							style={{ height: 50, marginBottom: 20 }}
						/>
						<div>
							<Space direction="vertical">
								<Space>
									<Text style={{ color: "#d1d5db" }}>Call Now:</Text>
									<Text strong style={{ fontSize: "1.25rem", color: "#fff" }}>
										(+84) 918273645
									</Text>
								</Space>
								<Text style={{ color: "#d1d5db" }}>
									FPT University, D1 Street, Ho Chi Minh City
								</Text>
							</Space>
						</div>
					</Col>

					{/* Product */}
					<Col xs={12} sm={6} lg={4}>
						<Title level={4} style={{ color: "#fff", marginBottom: 16 }}>
							Product
						</Title>
						<Space direction="vertical">
							<FooterLink to="/how-it-works" label="How it works" />
							<FooterLink to="/no-ats" label="No ATS? No Problem!" />
						</Space>
					</Col>

					{/* Legal & Trust */}
					<Col xs={12} sm={6} lg={4}>
						<Title level={4} style={{ color: "#fff", marginBottom: 16 }}>
							Legal & Trust
						</Title>
						<Space direction="vertical">
							<FooterLink to="/terms" label="Terms of Service" />
							<FooterLink to="/privacy" label="Privacy Policy" />
							<FooterLink to="/security" label="Security & Privacy" />
						</Space>
					</Col>

					{/* Resources */}
					<Col xs={12} sm={6} lg={4}>
						<Title level={4} style={{ color: "#fff", marginBottom: 16 }}>
							Resources
						</Title>
						<Space direction="vertical">
							<FooterLink to="/blog" label="Blog" />
							<FooterLink to="/help-center" label="Help Center" />
							<FooterLink to="/contact-us" label="Contact Us" />
						</Space>
					</Col>

					{/* Connect your ATS */}
					{/* <Col xs={12} sm={6} lg={4}>
						<Title level={4} style={{ color: "#fff", marginBottom: 16 }}>
							Connect your ATS
						</Title>
						<Space direction="vertical">
							<FooterLink to="#" label="Lever" />
							<FooterLink to="#" label="Greenhouse" />
							<FooterLink to="#" label="Ashby" />
							<FooterLink to="#" label="Workable" />
							<FooterLink to="#" label="JazzHr" />
							<FooterLink to="#" label="Recruitee" />
							<FooterLink to="#" label="Zoho Recruit" />
							<FooterLink to="#" label="ICIMS" />
							<FooterLink to="#" label="Workday" />
						</Space>
					</Col> */}
				</Row>


				<div
					style={{
						borderTop: "1px solid rgba(255,255,255,0.2)",
						marginTop: 40,
						paddingTop: 20,
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						flexWrap: "wrap",
					}}
				>
					<Text style={{ color: "#d1d5db" }}>
						© 2025 AICES - AI Powered Candidate Evaluation System for Recruiters. All rights
						reserved.
					</Text>
					<Space
						size="large"
						style={{
							color: "#f9fafb",
							fontSize: "1.25rem",
						}}
					>
						<FacebookOutlined style={{ cursor: "pointer" }} />
						<InstagramOutlined style={{ cursor: "pointer" }} />
						<TwitterOutlined style={{ cursor: "pointer" }} />
						<YoutubeOutlined style={{ cursor: "pointer" }} />
					</Space>
				</div>
			</div>
		</AntFooter>
	);
};