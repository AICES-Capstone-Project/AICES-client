// import { Button, Image } from "antd";
// import GoogleIcon from "../../assets/images/google.svg";
import { GoogleLogin } from "@react-oauth/google";
import { authService } from "../../services/authService";
import { toastError, toastSuccess } from "../UI/Toast";

const SocialAuthForm = () => {
	// const buttonClass =
	// 	"!font-medium min-h-12 w-full rounded-2 px-4 py-3.5 cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-50 hover:scale-[1.02] hover:shadow-lg !hover:shadow-gray-200/50 active:scale-[0.98] border !border-gray-200 !hover:border-gray-300";

	const handleGoogleSuccess = async (credentialResponse: any) => {
		console.log("Google login success:", credentialResponse);

		const idToken = credentialResponse.credential;
		console.log("ID Token:", idToken);

		const res = await authService.googleLogin(idToken);

		console.log(res);

		if (res.status === 200 && res.data) {
			toastSuccess("Login Success!", res.message);
		} else {
			console.log("Login failed:", res);
			toastError(
				`Login failed ${res.status}`,
				res.message || "Failed to login"
			);
		}
	};

	return (
		<div className="mt-10">
			<GoogleLogin
				onSuccess={handleGoogleSuccess}
				onError={() => console.error("Google login failed")}
			/>
		</div>
	);

	// return (
	// 	<div className="mt-10">
	// 		<Button className={buttonClass} onClick={() => handleGoogleSuccess}>
	// 			<Image
	// 				src={GoogleIcon}
	// 				alt="Google Logo"
	// 				width={20}
	// 				height={20}
	// 				className="mr-2.5 object-contain transition-transform duration-300 ease-in-out group-hover:scale-110 w-[20px] h-[20px]"
	// 			/>
	// 			<span className="transition-colors duration-300 ease-in-out">
	// 				Log in with Google
	// 			</span>
	// 		</Button>
	// 	</div>
	// );
};

export default SocialAuthForm;
