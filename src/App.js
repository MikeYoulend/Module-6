import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./fe/pages/HomePage";
import AdminPage from "./fe/pages/AdminPage";

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/admin" element={<AdminPage />} />
			</Routes>
		</Router>
	);
};

export default App;
