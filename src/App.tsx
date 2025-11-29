import { Routes, Route } from "react-router-dom";
import TestStripePayment from "./pages/TestStripePayment";

function App() {
	return (
		<Routes>
			{/* ...existing routes... */}

			{/* Test routes */}
			<Route path="/test-stripe-payment" element={<TestStripePayment />} />

			{/* ...existing routes... */}
		</Routes>
	);
}

export default App;
