import { CheckCircle, ArrowRight } from 'lucide-react';

// Feature detail section with in-depth product showcase
export default function FeatureDetail() {
  const features = [
    'Automated resume parsing and data extraction',
    'AI-powered candidate matching algorithms',
    'Customizable screening criteria and weights',
    'Detailed candidate scoring and analytics',
    'Bias detection and fairness metrics',
    'Multi-language resume support',
  ];

  return (
    <section className="relative text-center px-6 pb-20 pt-40 overflow-hidden min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content - Image/Visual */}
          <div className="relative order-2 lg:order-1">
            <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
              <img
                src="https://via.placeholder.com/600x450/667eea/ffffff?text=Advanced+Analytics"
                alt="Feature showcase"
                className="w-full rounded-xl shadow-xl"
              />

              {/* Floating metric cards */}
              <div className="absolute -top-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">1,247</div>
                    <div className="text-xs text-gray-500">Candidates Screened</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">94.8%</div>
                    <div className="text-xs text-gray-500">Match Accuracy</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
              <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
            </div>
          </div>

          {/* Right content - Text */}
          <div className="space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
              Advanced Features
            </div>

            <h2 className="text-4xl font-bold text-gray-900">
              Intelligent Screening
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Powered by AI
              </span>
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed">
              Our advanced AI engine analyzes every aspect of candidate resumes,
              from skills and experience to cultural fit and potential. Get detailed
              insights that help you make confident hiring decisions.
            </p>

            <div className="space-y-3">
              {features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
