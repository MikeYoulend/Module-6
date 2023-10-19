import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, Button, Alert } from "react-bootstrap";

const BlogPostForm = ({ postId }) => {
	const initialFormData = {
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
	};

	const [formData, setFormData] = useState(initialFormData);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [file, setFile] = useState(null);
	const [posts, setPosts] = useState([]);

	const categories = ["Tech", "Gossip", "Notizie", "AI"];

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		if (name.includes(".")) {
			const [parentField, childField] = name.split(".");
			setFormData((prevData) => ({
				...prevData,
				[parentField]: {
					...prevData[parentField],
					[childField]: value,
				},
			}));
		} else {
			setFormData((prevData) => ({
				...prevData,
				[name]: value,
			}));
		}
	};

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		setFile(selectedFile);
	};

	const uploadFile = async () => {
		const fileData = new FormData();
		fileData.append("cover", file);

		try {
			const response = await fetch("http://localhost:5050/posts/cloudUpload", {
				method: "POST",
				body: fileData,
			});

			if (response.ok) {
				const data = await response.json();
				return data;
			} else {
				throw new Error("Errore durante l'upload del file");
			}
		} catch (error) {
			console.error("Errore durante l'upload del file:", error);
			throw new Error("Errore durante l'upload del file");
		}
	};

	const handleDeletePost = async (postId) => {
		try {
			const response = await fetch(
				`http://localhost:5050/blogposts/${postId}`,
				{
					method: "DELETE",
				}
			);

			if (response.ok) {
				// Se l'eliminazione ha successo, aggiorna lo stato per riflettere la lista aggiornata dei post
				const updatedPosts = posts.filter((post) => post._id !== postId);
				setPosts(updatedPosts);
				console.log("Post eliminato con successo!");
			} else {
				throw new Error("Errore durante l'eliminazione del post.");
			}
		} catch (error) {
			console.error("Errore durante l'eliminazione del post:", error);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			if (!file) {
				throw new Error("Per favore seleziona un file!");
			}

			const uploadCover = await uploadFile();
			const finalBody = {
				...formData,
				cover: uploadCover.cover,
			};

			const response = await fetch("http://localhost:5050/blogposts", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(finalBody),
			});

			if (response.ok) {
				setSuccessMessage("Blog Post creato con successo!");
				setErrorMessage("");
				setFormData(initialFormData);
			} else {
				throw new Error("Errore durante la creazione del Blog Post.");
			}
		} catch (error) {
			setErrorMessage(error.message);
			console.error("Errore durante la creazione del Blog Post:", error);
		}
	};

	useEffect(() => {
		// Effettua una richiesta per ottenere tutti i post dal tuo backend
		const fetchPosts = async () => {
			try {
				const response = await fetch("http://localhost:5050/blogposts");
				if (response.ok) {
					const data = await response.json();
					setPosts(data); // Aggiorna lo stato con i post ottenuti dalla richiesta
				} else {
					throw new Error("Errore durante il recupero dei post.");
				}
			} catch (error) {
				console.error("Errore durante il recupero dei post:", error);
			}
		};

		// Chiama la funzione per recuperare i post
		fetchPosts();
	}, []);

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
			<Form encType="multipart/form-data" onSubmit={handleSubmit}>
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
					<Form.Label>Carica Immagine di Copertina:</Form.Label>
					<Form.Control
						type="file"
						name="cover"
						onChange={handleFileChange}
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

			<h2>Lista dei Post</h2>
			<ul>
				{posts.map((post) => (
					<li key={post._id}>
						{post.title}{" "}
						<Button variant="danger" onClick={() => handleDeletePost(post._id)}>
							Elimina Post
						</Button>
					</li>
				))}
			</ul>
		</Container>
	);
};

export default BlogPostForm;
