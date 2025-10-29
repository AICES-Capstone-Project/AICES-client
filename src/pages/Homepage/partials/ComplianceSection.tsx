import { Shield, Lock, CheckCircle, FileText } from "lucide-react";

export default function ComplianceSection() {
  const compliance = [
    {
      icon: Shield,
      title: "GDPR Compliant",
      description: "Full compliance with European data protection regulations",
    },
    {
      icon: Lock,
      title: "CCPA Compliant",
      description: "Adherence to California Consumer Privacy Act standards",
    },
    {
      icon: CheckCircle,
      title: "EU AI Act Ready",
      description: "Designed to meet upcoming EU AI regulatory requirements",
    },
    {
      icon: FileText,
      title: "SOC 2 Certified",
      description: "Enterprise-grade security and data protection standards",
    },
  ];

  const features = [
    "End-to-end encryption",
    "Regular security audits",
    "Data anonymization",
    "Role-based access control",
    "Audit logs and monitoring",
    "Secure data centers",
  ];

  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden py-20 px-6 sm:px-12 lg:px-24 text-white"
      style={{
        background: `linear-gradient(
          135deg, 
          var(--color-primary) 0%, 
          var(--color-primary-medium) 50%, 
          var(--color-primary-light) 100%
        )`,
      }}
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-10rem] left-[-10rem] w-[30rem] h-[30rem] bg-blue-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-10rem] w-[30rem] h-[30rem] bg-indigo-600/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-y-15 !p-8">
        <div>
          <h2 className="text-4xl md:text-5xl !font-bold !m-10">
            Built with{" "}
            <span className="text-[var(--color-primary-dark)]">Security</span>{" "}
            and{" "}
            <span className="text-[var(--color-primary-dark)]">Privacy</span>{" "}
            First
          </h2>
          <p className="text-white text-lg md:text-xl">
            Enterprise-grade protection meeting global compliance standards
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {compliance.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="text-[var(--color-primary-dark)] !py-10 !px-5 gap-6 bg-white/10 hover:bg-white/30 transition-all border border-white/20 rounded-2xl p-6 shadow-lg backdrop-blur-lg group flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-lg !font-semibold mb-2">{item.title}</h3>
                <p className="text-white text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="!py-18 !px-5 bg-white/5 rounded-3xl backdrop-blur-xl shadow-xl">
          <h2 className="text-2xl !font-bold !mb-10 text-[var(--color-primary-dark)]">
            Comprehensive Security Features
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-all"
              >
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-white text-sm md:text-base">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-center !mt-12 pt-8">
            <div>
              <div className="text-3xl font-bold mb-2 text-[var(--color-primary-dark)]">
                256-bit
              </div>
              <div className="text-[var(--color-primary-dark)] text-sm">
                SSL Encryption
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2 text-[var(--color-primary-dark)]">
                99.9%
              </div>
              <div className="text-[var(--color-primary-dark)] text-sm">
                Uptime SLA
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2 text-[var(--color-primary-dark)]">
                24/7
              </div>
              <div className="text-[var(--color-primary-dark)] text-sm">
                Security Monitoring
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center md:justify-between gap-6 !p-8">
          <p className="text-white text-lg md:text-sm font-small">
            Want to learn more about our security practices?
          </p>
          <button
            className="flex items-center !px-6 !py-3 
             bg-[var(--color-primary-dark)] 
             text-white font-semibold rounded-lg 
             shadow-lg hover:shadow-xl 
             transition-all duration-300 
             transform hover:scale-105"
          >
            Download Security Whitepaper
            <FileText className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
