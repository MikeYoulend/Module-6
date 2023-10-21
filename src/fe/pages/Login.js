import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const [loginData, setLoginData] = useState({});
	const [login, setLogin] = useState(null);

	const navigate = useNavigate();

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		setLoginData({
			...loginData,
			[name]: value,
		});
	};

	const onSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch("http://localhost:5050/login", {
				headers: {
					"Content-Type": "application/json",
				},
				method: "POST",
				body: JSON.stringify(loginData),
			});
			const data = await response.json();

			if (data.token) {
				localStorage.setItem("loggedInUser", JSON.stringify(data.token));
				navigate("/home");
			}

			setLogin(data);
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<div className="container mt-5">
			<div className="row justify-content-center">
				<div className="col-md-6">
					<div className="card bg-dark text-white">
						{" "}
						{/* Aggiungi la classe bg-dark per lo sfondo nero */}
						<div className="card-body">
							<h2 className="text-center mb-4">Login</h2>
							<form onSubmit={onSubmit}>
								<div className="mb-3">
									<input
										className="form-control"
										type="text"
										name="email"
										placeholder="Email"
										required
										onChange={handleInputChange}
									/>
								</div>
								<div className="mb-3">
									<input
										className="form-control"
										type="password"
										name="password"
										placeholder="Password"
										required
										onChange={handleInputChange}
									/>
								</div>
								<button className="btn btn-primary w-100" type="submit">
									Login
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
