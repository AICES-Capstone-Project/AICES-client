import { Link } from "react-router-dom";

const NotFoundPage = () => {
	return (
		<>
			<h1 className="mb-10">404 Not Found</h1>
			<Link to="/">
				<button>Go Home</button>
			</Link>
		</>
	);
};

export default NotFoundPage;
