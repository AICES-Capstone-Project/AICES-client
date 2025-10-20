import { Brain, Shield, Sparkles, Users, TrendingUp, FileCheck, Globe, Zap } from 'lucide-react';

// Feature grid displaying key product capabilities
export default function FeatureGrid() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze resumes with human-level accuracy and speed.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Shield,
      title: 'Bias Reduction',
      description: 'Remove unconscious bias from hiring decisions with objective, data-driven candidate evaluation.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Sparkles,
      title: 'Smart Matching',
      description: 'Intelligent algorithms match candidates to job requirements with precision scoring.',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Users,
      title: 'Collaborative Hiring',
      description: 'Share candidate insights with your team and make better hiring decisions together.',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Track hiring metrics, time-to-hire, and quality of hire with comprehensive analytics.',
      gradient: 'from-red-500 to-pink-500',
    },
    {
      icon: FileCheck,
      title: 'Resume Parsing',
      description: 'Automatically extract and structure information from any resume format instantly.',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Screen candidates from around the world with support for 50+ languages.',
      gradient: 'from-teal-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get candidate rankings and insights in seconds, not hours or days.',
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <section className="relative text-center px-6 pb-20 pt-40 overflow-hidden min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Recruiting
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to build a world-class hiring process
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-transparent hover:shadow-xl transition-all duration-300"
                style={{
                  animationDelay: `${index * 0.05}s`,
                }}
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`}></div>
              </div>
            );
          })}
        </div>

        {/* Additional features callout */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">50+</div>
              <div className="text-gray-600">Languages Supported</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime SLA</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
