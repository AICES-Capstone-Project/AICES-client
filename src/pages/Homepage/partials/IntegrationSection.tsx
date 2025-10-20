import { Zap, Link2 } from 'lucide-react';

// Integration section showcasing ATS and platform connections
export default function IntegrationSection() {
  const integrations = [
    { name: 'Greenhouse', category: 'ATS' },
    { name: 'Lever', category: 'ATS' },
    { name: 'Workday', category: 'HRIS' },
    { name: 'BambooHR', category: 'HRIS' },
    { name: 'Ashby', category: 'ATS' },
    { name: 'iCIMS', category: 'ATS' },
    { name: 'SmartRecruiters', category: 'ATS' },
    { name: 'JazzHR', category: 'ATS' },
  ];

  return (
    <section className="relative text-center px-6 pb-20 pt-40 overflow-hidden min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
              <Link2 className="h-4 w-4" />
              Seamless Integration
            </div>

            <h2 className="text-4xl font-bold text-gray-900">
              Connect with Your
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Existing ATS
              </span>
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed">
              Brainner.ai integrates seamlessly with your current recruiting tools.
              No need to change your workflow. Simply connect and start screening smarter.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">One-Click Setup</h4>
                  <p className="text-gray-600">Connect your ATS in seconds with our pre-built integrations</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Real-Time Sync</h4>
                  <p className="text-gray-600">Automatic updates between Brainner.ai and your ATS</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Secure & Compliant</h4>
                  <p className="text-gray-600">Enterprise-grade security with GDPR and SOC 2 compliance</p>
                </div>
              </div>
            </div>

            <button className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-300">
              View All Integrations
              <Link2 className="ml-2 h-4 w-4" />
            </button>
          </div>

          {/* Right content - Integration grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {integrations.map((integration, index) => (
                <div
                  key={integration.name}
                  className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg"></div>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {integration.category}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900">{integration.name}</h4>
                </div>
              ))}
            </div>

            {/* Connection lines decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
              <svg className="w-full h-full opacity-10" viewBox="0 0 400 400">
                <line x1="50" y1="50" x2="350" y2="350" stroke="#667eea" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="350" y1="50" x2="50" y2="350" stroke="#667eea" strokeWidth="2" strokeDasharray="5,5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
