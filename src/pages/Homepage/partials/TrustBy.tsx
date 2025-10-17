interface TrustedByProps {
  title?: string;
  logos?: string[];
}

export default function TrustedBy({
  title = "Trusted by leading enterprises and startups",
  logos,
}: TrustedByProps) {
  // fallback logos nếu không có API
 const fallbackLogos = [
  "https://1000logos.net/wp-content/uploads/2017/03/Adidas-Logo.png",
  "https://1000logos.net/wp-content/uploads/2021/04/Burger-King-logo.png",
  "https://1000logos.net/wp-content/uploads/2017/05/Hard-Rock-Logo.png",
  "https://1000logos.net/wp-content/uploads/2021/05/Netflix-logo.png",
  "https://1000logos.net/wp-content/uploads/2017/06/Amazon-Logo.png",
  "https://1000logos.net/wp-content/uploads/2017/03/Microsoft-Logo.png",
];


  const displayLogos = logos && logos.length > 0 ? logos : fallbackLogos;

  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-12">
          {title}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-10 items-center">
          {displayLogos.map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition duration-300"
            >
              <img
                src={logo}
                alt={`trusted-logo-${index}`}
                className="max-h-12 object-contain grayscale hover:grayscale-0 transition duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
