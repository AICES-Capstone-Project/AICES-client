import { Layout, Row, Col, Typography, Space } from "antd";
import {
	FacebookOutlined,
	InstagramOutlined,
	TwitterOutlined,
	YoutubeOutlined,
	ArrowRightOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

import Logo from "../../assets/logo/logo_AICES_sample.png";

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const linkStyle: React.CSSProperties = {
	display: "flex",
	alignItems: "center",
	fontSize: "1rem",
	color: "#9ca3af", 
	transition: "all 0.3s",
};

const FooterLink: React.FC<{ to: string; label: string }> = ({ to, label }) => {
	return (
		<Link to={to} style={linkStyle} className="footer-link">
			<ArrowRightOutlined style={{ opacity: 0, marginRight: 8 }} className="footer-link-icon" />
			{label}
		</Link>
	);
};

export const Footer: React.FC = () => {
	return (
		<AntFooter style={{ backgroundColor: "#111827", color: "#fff", padding: "60px 0" }}>
			<div style={{ maxWidth: "1200px", margin: "0 auto" }}>
				<Row gutter={[32, 32]}>
					<Col xs={24} lg={8}>
						<img src={Logo} alt="Logo" style={{ height: 50, marginBottom: 20 }} />
						<div>
							<Space direction="vertical">
								<Space>
									<Text style={{ color: "#9ca3af" }}>Call Now:</Text>
									<Text strong style={{ fontSize: "1.25rem", color: "#fff" }}>
										(+84) 918273645
									</Text>
								</Space>
								<Text style={{ color: "#9ca3af" }}>
									FPT University, D1 Street, Ho Chi Minh City
								</Text>
							</Space>
						</div>
					</Col>

					<Col xs={12} sm={6} lg={4}>
						<Title level={4} style={{ color: "#fff" }}>
							Quick Link
						</Title>
						<Space direction="vertical">
							<FooterLink to="about-us" label="About Us" />
							<FooterLink to="contact" label="Contact" />
							<FooterLink to="pricing" label="Pricing" />
							<FooterLink to="blog" label="Blog" />
						</Space>
					</Col>

					<Col xs={12} sm={6} lg={4}>
						<Title level={4} style={{ color: "#fff" }}>
							Candidate
						</Title>
						<Space direction="vertical">
							<FooterLink to="jobs" label="Browse Jobs" />
							<FooterLink to="employers" label="Browse Employers" />
							<FooterLink to="dashboard" label="Candidate Dashboard" />
							<FooterLink to="saved-jobs" label="Save Jobs" />
						</Space>
					</Col>

					<Col xs={12} sm={6} lg={4}>
						<Title level={4} style={{ color: "#fff" }}>
							Employers
						</Title>
						<Space direction="vertical">
							<FooterLink to="post-job" label="Post a Job" />
							<FooterLink to="candidates" label="Browse Candidates" />
							<FooterLink to="employer-dashboard" label="Employers Dashboard" />
							<FooterLink to="applications" label="Applications" />
						</Space>
					</Col>

					<Col xs={12} sm={6} lg={4}>
						<Title level={4} style={{ color: "#fff" }}>
							Support
						</Title>
						<Space direction="vertical">
							<FooterLink to="faqs" label="Faqs" />
							<FooterLink to="privacy" label="Privacy Policy" />
							<FooterLink to="terms" label="Terms & Conditions" />
							<FooterLink to="support" label="Support" />
						</Space>
					</Col>
				</Row>

				<div
					style={{
						borderTop: "1px solid #374151",
						marginTop: 40,
						paddingTop: 20,
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						flexWrap: "wrap",
					}}
				>
					<Text style={{ color: "#9ca3af" }}>
						© 2025 AICES - AI Powered Candidate Evaluation System for Recruiters. All rights Reserved
					</Text>
					<Space size="large">
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

export const FooterAdmin: React.FC = () => {
	return (
		<AntFooter style={{ textAlign: "center", background: "#111827", color: "#9ca3af" }}>
			© 2025 AICES - AI Powered Candidate Evaluation System for Recruiters. All rights Reserved
		</AntFooter>
	);
};
