import Hero from "./partials/Hero/Hero";
import TimeSaving from "./partials/TimeSaving/TimeSaving";
import Feedback from "./partials/Feedback/Feedback";
import RecruiterDesigned from "./partials/RecruiterDesigned/RecruiterDesigned";
import Compliance from "./partials/Compliance/Compliance";

export default function Homepage() {
  return (
    <>
      <Hero />
      <TimeSaving />
      <RecruiterDesigned />
      <Feedback />
      <Compliance />

      {/* <Integration /> */}
      {/* <HowItWorks /> */}
      {/* <ValueSection /> */}
      {/* nothing */}
    </>
  );
}
