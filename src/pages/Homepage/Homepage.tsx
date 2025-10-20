import MainBanner from "../Homepage/partials/Banner";
import BannerSecond from "../Homepage/partials/BannerSecond";
import BenefitSection from "../Homepage/partials/BenefitSection";
import ComplianceSection from "../Homepage/partials/ComplianceSection";
import Testimonials from "../Homepage/partials/Testimonials";
import ProcessSteps from "../Homepage/partials/ProcessSteps";

export default function Homepage() {
	return (
		<>
			<MainBanner />
			<BenefitSection />
			<ComplianceSection />
			<BannerSecond />
			<Testimonials />
			<ProcessSteps />
		</>
	);
}
