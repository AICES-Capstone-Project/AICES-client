import React from "react";

const RightBanner: React.FC = () => {
  return (
    <aside className="w-full h-full flex items-center justify-center bg-transparent text-white">
      <div className="text-center px-6 max-w-2xl">
        <div className="mb-6">
          <span className="text-3xl font-bold tracking-widest text-lime-200">
            AICES
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold leading-snug mb-4">
          Let AI handle the screening —<br />
          <span className="text-lime-200">you focus on hiring.</span>
        </h1>

        <p className="text-lg text-lime-100 leading-relaxed">
          Empower your recruitment process with intelligent automation. <br />
          Save time, streamline workflows, and discover top talent effortlessly.
        </p>
      </div>
    </aside>
  );
};

export default RightBanner;
