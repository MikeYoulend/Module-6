import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import BlogPostForm from "../components/blogpost/BlogPostForm";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminPage = () => {
	return (
		<div>
			<Navbar bg="dark" variant="dark" expand="lg">
				<Navbar.Brand className="ms-5 fs-1 ">Cognitive Code</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ml-auto">
						<Nav.Link
							className="ms-2 fs-1 "
							as={Link}
							to={`/home/${localStorage.getItem("token")}`}
						>
							Home
						</Nav.Link>
						{/* Aggiungi altri link per le tue pagine qui */}
					</Nav>
				</Navbar.Collapse>
			</Navbar>

			<div className="container mt-5">
				<BlogPostForm />
			</div>
		</div>
	);
};

export default AdminPage;
