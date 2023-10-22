import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./fe/pages/HomePage";
import AdminPage from "./fe/pages/AdminPage";
import Login from "./fe/pages/Login";
import ProtectedRoutes from "./fe/middlewares/protectedRoutes";

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route element={<ProtectedRoutes />}>
					<Route path="/home/:token" element={<HomePage />} />
					<Route path="/admin" element={<AdminPage />} />
				</Route>
			</Routes>
		</Router>
	);
};

export default App;
