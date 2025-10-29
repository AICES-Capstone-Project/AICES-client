import { useTranslation } from 'react-i18next';

export default function Testimonials() {
  const { t } = useTranslation();
  const testimonials = [
    {
      company: "FPT Software",
      logo: "https://img5.thuthuatphanmem.vn/uploads/2022/01/16/logo-truong-fpt_043152255.png",
      quote:
        "The main benefit of Brainner is being able to put in the core competencies that we need people to have, and then it'll basically sort all those applicants based on who meets those criteria.",
      author: "Rachel Ward",
      role: "People & Talent Operations",
      avatar:
        "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
      company: "GOOGLE",
      logo: "https://vectorseek.com/wp-content/uploads/2020/12/Google-Chrome-Logo-Vector-scaled.jpg",
      quote:
        "Brainner replaced the one-by-one manual review of 180+ applications per role with real-time shortlists — ordered by match based on criteria we define.",
      author: "Angeles Donelly",
      role: "Regional Talent Partner Manager",
      avatar:
        "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      company: "Accelon",
      logo: "https://assets.brandinside.asia/uploads/2020/06/12030308_312478392209253_4830511438962702140_o-1.jpg",
      quote:
        "What we find most useful is the ability to fine-tune the analysis. It helps us look beyond strict job descriptions and consider candidates who might otherwise be missed.",
      author: "Puja Singla",
      role: "Talent & Tech Senior Manager",
      avatar:
        "https://randomuser.me/api/portraits/women/12.jpg",
    },
  ];

  return (
    <section className="relative flex flex-col justify-center items-center min-h-screen !p-10 sm:px-6 lg:px-8"
      style={{
        background: `linear-gradient(
          135deg, 
          var(--color-primary) 0%, 
          var(--color-primary-medium) 50%, 
          var(--color-primary-light) 100%
        )`,
      }}>
      <div className="flex flex-col items-center text-center mb-12 max-w-3xl gap-6">
        <h2 className="text-4xl !font-bold mb-4 text-[var(--color-primary-dark)]">
          {t('homepage.testimonials.heading')} <span className="text-white">{t('homepage.testimonials.headingHighlight')}</span>
        </h2>
        <p className="text-lg text-white">{t('homepage.testimonials.sub')}</p>
      </div>

      <div className="flex w-full max-w-7xl gap-8 mt-5">
        <div className="basis-[30%]">
          <div className="bg-white rounded-2xl !p-8 shadow-md border border-gray-100 text-left flex flex-col justify-between h-full">
            <img
              src={testimonials[0].logo}
              alt={testimonials[0].company}
              className="w-20 h-20 object-contain mb-6"
            />
            <p className="text-gray-700 italic mb-6 leading-relaxed">
              "{testimonials[0].quote}"
            </p>
            <div className="flex items-center gap-4">
              <img
                src={testimonials[0].avatar}
                alt={testimonials[0].author}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-gray-900">
                  {testimonials[0].author}
                </div>
                <div className="text-sm text-gray-600">
                  {testimonials[0].role}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="basis-[70%] flex flex-col gap-8">
          {testimonials.slice(1).map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl !p-8 shadow-md border border-gray-100 text-left flex flex-col justify-between h-full"
            >
              <img
                src={t.logo}
                alt={t.company}
                className="w-20 h-20 object-contain mb-6"
              />
              <p className="text-gray-700 italic mb-6 leading-relaxed">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900">{t.author}</div>
                  <div className="text-sm text-gray-600">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
