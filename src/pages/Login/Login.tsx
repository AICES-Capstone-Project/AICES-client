import React from "react";
import { useLocation } from "react-router-dom";

import Form from "./partials/Form/Form";
import RightBanner from "./partials/RightBanner/RightBanner";

const LogIn: React.FC = () => {
	const { pathname: currentPath } = useLocation();

	return (
		<div className="w-full h-screen m-0 p-0 flex flex-col justify-between">
			{/* Main login container */}
			<div className="flex flex-row w-full flex-1">
				{/* Left section (Form) */}
				<div className="flex flex-1 items-center justify-center">
					<div className="flex flex-col items-center justify-center">
						<Form />
					</div>

					<div className="flex items-center justify-center">
						{currentPath === "/login" && <RightBanner />}
					</div>
				</div>
			</div>

			{/* Footer */}
			<div className="flex justify-center items-end w-full h-[100px] pb-10">
				<p className="text-green-800 font-inter text-lg font-normal p-5 text-center">
					© 2025 AICES - AI Powered Candidate Evaluation System for Recruiters.
					All rights Reserved
				</p>
			</div>
		</div>
	);
};

export default LogIn;
