import React from "react";
import { useLocation } from "react-router-dom";
import ForgotPasswordForm from "./ForgetPassForm/Form";
import RightBanner from "../../../../components/RightBanner/RightBanner";
import { APP_ROUTES } from "../../../../services/config";

const ForgotPasswordPage: React.FC = () => {
	const { pathname: currentPath } = useLocation();
	return (
		<div
			className="w-full h-screen flex flex-col justify-between
                 bg-gradient-to-r from-green-900 via-emerald-800 to-lime-700
                 text-white"
		>
			<div className="flex flex-row flex-1 w-full">
				<div className="flex flex-1 items-center justify-center">
					<div className="bg-white text-gray-900 backdrop-blur-sm rounded-2xl shadow-2xl !p-10 w-[90%] max-w-md">
						<ForgotPasswordForm />
					</div>

				</div>
				{currentPath === APP_ROUTES.FORGOT_PASSWORD && (
					<div className="hidden lg:flex w-1/2 h-full">
						<RightBanner />
					</div>
				)}
			</div>
			<footer className="h-[70px] flex justify-center items-center text-lime-100">
				<p className="text-center text-sm md:text-base tracking-wide">
					© 2025 AICES. All rights reserved.
				</p>
			</footer>
		</div>
	);
};

export default ForgotPasswordPage;
