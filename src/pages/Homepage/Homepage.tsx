
import Hero from "./partials/Hero/Hero";
import TimeSaving from "./partials/TimeSaving/TimeSaving";
import Integration from "./partials/Integration/Integration";
import HowItWorks from "./partials/HowItWorks/HowItWorks";
import ValueSection from "./partials/ValueSection/ValueSection";    
import Feedback from "./partials/Feedback/Feedback";
import RecruiterDesigned from "./partials/RecruiterDesigned/RecruiterDesigned";
import Compliance from "./partials/Compliance/Compliance";

export default function Homepage() {
  return (
    <>
      <Hero />
      <TimeSaving />
      <Integration />
      <HowItWorks />
      <ValueSection />  
      <Feedback />
      <RecruiterDesigned />
      <Compliance />
    </>
  );
}
