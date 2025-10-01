import React from "react";
import { useLocation } from "react-router-dom";
import ForgotPasswordForm from "./ForgetPassForm/Form";
import RightBanner from "../../../../components/RightBanner/RightBanner";

const ForgotPasswordPage: React.FC = () => {
	const { pathname: currentPath } = useLocation();
	return (
		<div className="w-full h-screen m-0 p-0 flex flex-col justify-between">
			<div className="flex flex-row w-full flex-1">
				<div className="flex flex-1 items-center justify-center">
					<div className="flex flex-col items-center justify-center">
						<ForgotPasswordForm />
					</div>
					<div className="flex items-center justify-center">
						{currentPath === "/forgot-password" && <RightBanner />}
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

export default ForgotPasswordPage;
