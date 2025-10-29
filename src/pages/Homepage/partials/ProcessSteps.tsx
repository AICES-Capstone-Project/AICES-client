import React, { useState } from "react";
import { useTranslation } from 'react-i18next';

const ProcessSteps: React.FC = () => {
  const { t } = useTranslation();
  const steps = t('homepage.process.steps', { returnObjects: true }) as Array<any>;

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
