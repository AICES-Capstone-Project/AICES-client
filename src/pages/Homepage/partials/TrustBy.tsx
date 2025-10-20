export default function LogoBar() {
  const companies = [
    { name: 'Tether', placeholder: '120x40' },
    { name: 'Adecco', placeholder: '120x40' },
    { name: 'Instructure', placeholder: '140x40' },
    { name: 'Greenhouse', placeholder: '120x40' },
    { name: 'Workday', placeholder: '120x40' },
    { name: 'BambooHR', placeholder: '120x40' },
  ];

  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Trusted by Leading Companies and Startups
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {companies.map((company) => (
            <div
              key={company.name}
              className="grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
            >
              <img
                src={`https://via.placeholder.com/${company.placeholder}/cccccc/666666?text=${company.name}`}
                alt={`${company.name} logo`}
                className="h-10 w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
