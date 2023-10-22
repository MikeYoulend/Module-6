import { Link, useParams } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import BlogPost from "../components/blogpost/BlogPost";
import { useEffect } from "react";

const HomePage = () => {
	const { token } = useParams();
	console.log(token);
	useEffect(() => {
		if (token) {
			console.log("Token:", token);
			localStorage.setItem("token", token);
		}
	}, [token]);

	return (
		<div className="bg-dark">
			<Navbar bg="dark" variant="dark" expand="lg">
				<Navbar.Brand className="ms-5 fs-1 ">Cognitive Code</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ms-auto me-5">
						<Nav.Link className="fs-1 " as={Link} to="/admin">
							AdminPage
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
			;
			<h1 className="text-center display-2 fw-bold text-white">
				I Nostri Ultimi Contenuti
			</h1>
			<BlogPost />
		</div>
	);
};

export default HomePage;
