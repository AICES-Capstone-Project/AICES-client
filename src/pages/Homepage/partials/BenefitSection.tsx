import PiggyIcon from "../../../assets/images/undraw_savings_uwjn.svg";
import TargetIcon from "../../../assets/images/undraw_target_d6hf.svg";
import TimeIcon from "../../../assets/images/undraw_time-management_4ss6.svg";

export default function BenefitSection() {
  const benefits = [
    {
      icon: PiggyIcon,
      title: "Reduce Hiring Costs",
      description:
        "Cut recruitment expenses by up to 70% with automated screening and intelligent candidate matching.",
      stat: "70%",
      statLabel: "Cost Reduction",
    },
    {
      icon: TimeIcon,
      title: "Decrease Time-to-Hire",
      description:
        "Screen hundreds of resumes in minutes instead of days. Accelerate your hiring pipeline dramatically.",
      stat: "10x",
      statLabel: "Faster",
    },
    {
      icon: TargetIcon,
      title: "Improve Screening Accuracy",
      description:
        "AI-powered analysis ensures you never miss top talent. Reduce bias and improve quality of hire.",
      stat: "95%",
      statLabel: "Accuracy",
    },
  ];

  return (
    <section className="relative flex flex-col justify-center items-center min-h-screen text-center overflow-hidden">
      <div className="max-w-7xl w-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 gap-10">
        
        {/* Title */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Transform Your Hiring Process
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Experience the power of AI-driven recruitment that saves time,
            reduces costs, and improves hiring quality.
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid md:grid-cols-3 gap-10 justify-center items-stretch w-full max-w-6xl">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="!py-8 !px-5 gap-5 group relative bg-white rounded-2xl p-10 shadow-lg transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-2 hover:border-[var(--color-primary-light)] hover:shadow-[0_10px_25px_rgba(77,124,15,0.15)] hover:bg-[rgba(77,124,15,0.03)] border border-gray-100"
              style={{
                transition:
                  "all 0.3s ease, background-color 0.4s ease, border-color 0.3s ease",
              }}
            >
              {/* Icon */}
              <div>
                <img
                  src={benefit.icon}
                  alt={benefit.title}
                  className="h-20 w-20 object-contain mb-6"
                />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-8 leading-relaxed">
                {benefit.description}
              </p>

              {/* Stat — chỉ text, không có nền */}
              <div className="flex flex-col items-center gap-1">
                <span
                  className="text-3xl font-bold"
                  style={{
                    background:
                      "linear-gradient(to right, var(--color-primary), var(--color-primary-light))",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {benefit.stat}
                </span>
                <span className="text-sm text-gray-600 font-medium">
                  {benefit.statLabel}
                </span>
              </div>

              {/* Hover overlay */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "var(--color-primary-light)",
                  opacity: 0.08,
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
