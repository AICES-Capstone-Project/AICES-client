import { toastError, toastInfo, toastSuccess } from "../../components/UI/Toast";

const Home = () => (
	<div className="bg-amber-50">
		<div className="flex gap-4">
			<button
				onClick={() => toastSuccess("Success!", "This is a success toast")}
				className="!bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
			>
				Show Success
			</button>

			<button
				onClick={() => toastError("Error!", "Something went wrong")}
				className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
			>
				Show Error
			</button>

			<button
				onClick={() => toastInfo("Info", "This is an info message")}
				className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
			>
				Show Info
			</button>
		</div>
	</div>
);

export default Home;
