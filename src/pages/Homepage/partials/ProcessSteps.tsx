import React, { useState} from "react";

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode; // bạn có thể dùng SVG hoặc icon component
}

const steps: Step[] = [
  {
    title: "Step 1: Plan",
    description: "This is the first step of the process.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="80"
        height="80"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-purple-600"
      >
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
  {
    title: "Step 2: Design",
    description: "This is the second step of the process.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="80"
        height="80"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-purple-600"
      >
        <rect x="4" y="4" width="16" height="16" rx="2" />
      </svg>
    ),
  },
  {
    title: "Step 3: Build",
    description: "This is the third step of the process.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="80"
        height="80"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-purple-600"
      >
        <polygon points="12,2 22,22 2,22" />
      </svg>
    ),
  },
];

const ProcessSteps: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [scrolling, setScrolling] = useState<boolean>(false);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrolling) return;

    setScrolling(true);

    if (e.deltaY > 0 && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (e.deltaY < 0 && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }

    setTimeout(() => setScrolling(false), 800);
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      onWheel={handleWheel}
    >
      <div
        className="h-full transition-transform duration-700"
        style={{ transform: `translateY(-${currentStep * 100}%)` }} // dùng % cũng ok
      >
        {steps.map((step, index) => (
          <div
            key={index}
            className="w-full h-screen flex flex-col items-center justify-center"
          >
            {step.icon}
            <h2 className="text-2xl font-bold mt-4">{step.title}</h2>
            <p className="text-center mt-2 max-w-xl">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};


export default ProcessSteps;
