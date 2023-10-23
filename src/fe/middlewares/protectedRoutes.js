import { Outlet, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import Login from "../pages/Login";
import { useEffect } from "react";

const isAuth = () => {
	return JSON.parse(localStorage.getItem("loggedInUser"));
};

export const useSession = () => {
	const localToken = localStorage.getItem("loggedInUser");
	const githubToken = localStorage.getItem("githubToken");
	const session = localToken || githubToken;
	const decodedSession = session ? jwtDecode(session) : null;
	const navigate = useNavigate();

	useEffect(() => {
		if (!session) {
			navigate("/", { replace: true });
		}
	}, [navigate, session]);

	return decodedSession;
};

const ProtectedRoutes = () => {
	const auth = isAuth();

	return auth ? <Outlet /> : <Login />;
};

export default ProtectedRoutes;
