import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, Button, Alert } from "react-bootstrap";

const BlogPostForm = () => {
	const [formData, setFormData] = useState({
		category: "",
		title: "",
		cover: "",
		readtime: {
			value: "",
			unit: "",
		},
		author: {
			name: "",
		},
		content: "",
	});

	const categories = ["Tech", "Gossip", "Notizie", "AI"];
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		const [parentField, childField] = name.split(".");
		if (parentField === "readtime" || parentField === "author") {
			setFormData((prevData) => ({
				...prevData,
				[parentField]: {
					...prevData[parentField],
					[childField]: value,
				},
			}));
		} else {
			setFormData({
				...formData,
				[name]: value,
			});
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			// Chiamata POST per inviare i dati del form
			const response = await fetch("http://localhost:5050/blogposts", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				setSuccessMessage("Blog Post creato con successo!");
				setErrorMessage("");
				setFormData({
					category: "",
					title: "",
					cover: "",
					readtime: {
						value: "",
						unit: "",
					},
					author: {
						name: "",
					},
					content: "",
				});
			}
		} catch (error) {
			setErrorMessage("Errore durante la creazione del Blog Post.");
			console.error("Errore durante la creazione del Blog Post:", error);
		}
	};

	useEffect(() => {
		let timer;
		if (successMessage) {
			timer = setTimeout(() => {
				setSuccessMessage("");
			}, 5000);
		}
		return () => clearTimeout(timer);
	}, [successMessage]);

	return (
		<Container className="mt-5">
			<h1 className="mb-4">Crea un Nuovo Blog Post</h1>
			{successMessage && <Alert variant="success">{successMessage}</Alert>}
			{errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
			<Form onSubmit={handleSubmit}>
				<Form.Group className="mb-3" controlId="category">
					<Form.Label>Categoria:</Form.Label>
					<Form.Select
						name="category"
						value={formData.category}
						onChange={handleInputChange}
						required
					>
						<option value="">Seleziona una categoria</option>
						{categories.map((category, index) => (
							<option key={index} value={category}>
								{category}
							</option>
						))}
					</Form.Select>
				</Form.Group>

				<Form.Group className="mb-3" controlId="title">
					<Form.Label>Titolo:</Form.Label>
					<Form.Control
						type="text"
						name="title"
						value={formData.title}
						onChange={handleInputChange}
						required
					/>
				</Form.Group>

				<Form.Group className="mb-3" controlId="cover">
					<Form.Label>Link dell'Immagine di Copertina:</Form.Label>
					<Form.Control
						type="file"
						name="cover"
						value={formData.cover}
						onChange={handleInputChange}
						required
					/>
				</Form.Group>

				<Form.Group className="mb-3" controlId="readtimeValue">
					<Form.Label>Tempo di Lettura (valore):</Form.Label>
					<Form.Control
						type="number"
						name="readtime.value"
						value={formData.readtime.value}
						onChange={handleInputChange}
						required
					/>
				</Form.Group>

				<Form.Group className="mb-3" controlId="readtimeUnit">
					<Form.Label>Tempo di Lettura (unità di misura):</Form.Label>
					<Form.Control
						type="text"
						name="readtime.unit"
						value={formData.readtime.unit}
						onChange={handleInputChange}
						required
					/>
				</Form.Group>

				<Form.Group className="mb-3" controlId="authorName">
					<Form.Label>Nome dell'Autore:</Form.Label>
					<Form.Control
						type="text"
						name="author.name"
						value={formData.author.name}
						onChange={handleInputChange}
						required
					/>
				</Form.Group>

				<Form.Group className="mb-3" controlId="content">
					<Form.Label>Contenuto:</Form.Label>
					<Form.Control
						as="textarea"
						rows={4}
						name="content"
						value={formData.content}
						onChange={handleInputChange}
						required
					/>
				</Form.Group>

				<Button variant="primary" type="submit">
					Invia Blog Post
				</Button>
			</Form>
		</Container>
	);
};

export default BlogPostForm;
