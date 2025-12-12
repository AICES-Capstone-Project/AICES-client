import React from "react";
import { useLocation} from "react-router-dom";
import ResetPasswordForm from "./ResetPassForm/Form";
import RightBanner from "../../../../components/RightBanner/RightBanner";

const ResetPasswordPage: React.FC = () => {
    const { pathname: currentPath } = useLocation();
  return (
    <div className="w-full h-screen flex flex-col justify-between
                 bg-gradient-to-r from-green-900 via-emerald-800 to-lime-700
                 text-white"
		>
      <div className="flex flex-row w-full flex-1">
        <div className="flex flex-1 items-center justify-center">
          <div className="bg-white text-gray-900 backdrop-blur-sm rounded-2xl shadow-2xl !p-10 w-[90%] max-w-md">
            <ResetPasswordForm />
          </div>
          <div className="flex items-center justify-center">
            {currentPath === "/reset-password" && <RightBanner />}
          </div>
        </div>
      </div>

      <div className="flex justify-center items-end w-full h-[100px] pb-10">
        <p className="text-lg font-normal p-5 text-center">
          © 2025 AICES - AI Powered Candidate Evaluation System for Recruiters.
          All rights Reserved
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
