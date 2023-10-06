import BlogPost from "../components/blogpost/BlogPost";
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

const HomePage = () => {
	return (
		<div>
			<Navbar bg="dark" variant="dark" expand="lg">
				<Navbar.Brand className="ms-5 fs-1 ">Cognitive Code</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ms-auto me-5">
						<Nav.Link className="fs-1 " as={Link} to="/admin">
							AdminPage
						</Nav.Link>
						{/* Aggiungi altri link per le tue pagine qui */}
					</Nav>
				</Navbar.Collapse>
			</Navbar>

			<h1 className="text-center display-1 fw-bold text-white">Posts</h1>
			<BlogPost />
		</div>
	);
};

export default HomePage;
