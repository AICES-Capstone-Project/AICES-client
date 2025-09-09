import React from "react";

interface LoadingProps {
	size?: "sm" | "md" | "lg" | "xl";
	variant?: "primary" | "white" | "red";
	className?: string;
	text?: string;
	fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
	size = "md",
	variant = "primary",
	className = "",
	text,
	fullScreen = false,
}) => {
	const sizeClasses = {
		sm: "w-4 h-4 border-2",
		md: "w-8 h-8 border-2",
		lg: "w-12 h-12 border-3",
		xl: "w-16 h-16 border-4",
	};

	const variantClasses = {
		primary: "border-red-500 border-t-transparent ",
		white: "border-white border-t-transparent",
		red: "border-red-500 border-t-transparent",
	};

	const textSizeClasses = {
		sm: "text-sm",
		md: "text-base",
		lg: "text-lg",
		xl: "text-xl",
	};

	const spinner = (
		<div className="flex flex-col items-center justify-center gap-3">
			<div
				className={`animate-spin rounded-full ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
			/>
			{text && (
				<p className={`text-black font-medium ${textSizeClasses[size]}`}>
					{text}
				</p>
			)}
		</div>
	);

	if (fullScreen) {
		return (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
				{spinner}
			</div>
		);
	}

	return spinner;
};

export default Loading;
