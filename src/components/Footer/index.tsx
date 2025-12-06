import { Layout, Row, Col, Typography, Space } from "antd";
import {
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
      onMouseEnter={(e) => (e.currentTarget.style.color = "#78C090")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "#e5e7eb")}
    >
      {label}
    </Link>
  );
};

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <AntFooter
      style={{
        background:
          "radial-gradient(circle at top, #184132 0%, #0F2027 55%, #020b10 100%)",

        color: "#f9fafb",
        paddingTop: "60px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Row gutter={[32, 32]}>
          <Col xs={24} lg={9}>
            <img
              src={Logo}
              alt="Logo"
              style={{ height: 50, marginBottom: 20 }}
            />
            <div>
              <Space direction="vertical">
                <Space>
                  <Text style={{ color: "#d1d5db" }}>
                    {t("footer.callNow")}
                  </Text>
                  <Text strong style={{ fontSize: "1.25rem", color: "#fff" }}>
                    (+84) 918273645
                  </Text>
                </Space>
                <Text style={{ color: "#d1d5db" }}>{t("footer.address")}</Text>
              </Space>
            </div>
          </Col>

          <Col xs={16} sm={8} lg={5}>
            <Title level={4} style={{ color: "#fff", marginBottom: 16 }}>
              {t("footer.productTitle")}
            </Title>
            <Space direction="vertical">
              <FooterLink
                to="/how-it-works"
                label={t("footer.product.howItWorks")}
              />
              <FooterLink to="/no-ats" label={t("footer.product.noAts")} />
            </Space>
          </Col>

          <Col xs={16} sm={8} lg={5}>
            <Title level={4} style={{ color: "#fff", marginBottom: 16 }}>
              {t("footer.legalTitle")}
            </Title>
            <Space direction="vertical">
              <FooterLink to="/terms" label={t("footer.legal.terms")} />
              <FooterLink to="/privacy" label={t("footer.legal.privacy")} />
              <FooterLink to="/security" label={t("footer.legal.security")} />
            </Space>
          </Col>

          <Col xs={16} sm={8} lg={5}>
            <Title level={4} style={{ color: "#fff", marginBottom: 16 }}>
              {t("footer.resourcesTitle")}
            </Title>
            <Space direction="vertical">
              <FooterLink to="/blog" label={t("footer.resources.blog")} />
              <FooterLink
                to="/help-center"
                label={t("footer.resources.helpCenter")}
              />
              <FooterLink
                to="/contact-us"
                label={t("footer.resources.contact")}
              />
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
            borderTop: "1px solid rgba(120,192,144,0.35)", // emerald border
            marginTop: 40,
            paddingTop: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Text style={{ color: "#d1d5db" }}>{t("footer.copyRight")}</Text>
          <Space
            size="large"
            style={{
              color: "#f9fafb",
              fontSize: "1.25rem",
            }}
          >
            <FacebookOutlined
              style={{ cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#78C090")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#f9fafb")}
            />

            <InstagramOutlined style={{ cursor: "pointer" }} />
            <TwitterOutlined style={{ cursor: "pointer" }} />
            <YoutubeOutlined style={{ cursor: "pointer" }} />
          </Space>
        </div>
      </div>
    </AntFooter>
  );
};
