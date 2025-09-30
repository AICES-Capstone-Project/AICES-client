import { Link } from "react-router-dom";
import { APP_ROUTES } from "../services/config";

const NotFoundPage = () => {
	return (
		<>
			<h1 className="mb-10">404 Not Found</h1>
			<Link to={APP_ROUTES.HOME}>
				<button>Go Home</button>
			</Link>
		</>
	);
};

export default NotFoundPage;
