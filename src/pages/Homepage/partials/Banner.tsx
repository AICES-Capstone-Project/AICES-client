import { Button } from "antd";
import { useTranslation } from 'react-i18next';

export default function Banner() {
  const { t } = useTranslation();
  return (
    <section
      className="relative text-center px-6 pb-20 pt-40 overflow-hidden min-h-screen flex flex-col justify-center items-center"
      style={{
        background: `linear-gradient(
          135deg, 
          var(--color-primary) 0%, 
          var(--color-primary-medium) 50%, 
          var(--color-primary-light) 100%
        )`,
        color: "#fff",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <h1
          style={{
            fontSize: "clamp(28px, 4vw, 52px)",
            fontWeight: 800,
            marginBottom: 16,
          }}
        >
          {t('homepage.banner.title')}
        </h1>

        <p
          style={{
            fontSize: 18,
            color: "#f1f5f9",
            marginBottom: 28,
            lineHeight: 1.6,
          }}
        >
          {t('homepage.banner.subtitle')}
        </p>

        <Button
          size="large"
          style={{
            paddingInline: 28,
            height: 52,
            fontSize: 16,
            borderRadius: 8,
            background: "var(--color-primary-dark)",
            border: "none",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          <span role="img" aria-label="laptop" style={{ marginRight: 8 }}>
            💻
          </span>
          {t('homepage.banner.cta')}
        </Button>
      </div>
    </section>
  );
}
