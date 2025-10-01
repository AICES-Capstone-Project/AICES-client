import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
	const error = useRouteError() as {
		statusText?: string;
		message?: string;
	};
	console.error(error);

	return (
		<div style={{ padding: "2rem" }}>
			<h1>Oops! Something went wrong 🚨</h1>
			<p>{error.statusText || error.message}</p>
		</div>
	);
}
