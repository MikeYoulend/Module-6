import React, { useState, useEffect } from "react";
import "../../../App.css";

const BlogPost = () => {
	const [postData, setPostData] = useState(null);

	useEffect(() => {
		// Effettua una richiesta GET all'endpoint del tuo server backend
		fetch("http://localhost:5050/blogposts")
			.then((response) => response.json())
			.then((data) => {
				// I dati ottenuti dalla richiesta vengono memorizzati nello stato locale
				// Assumendo che la tua API restituisca un array di post e tu voglia visualizzare il primo post
				setPostData(data[0]);
			})
			.catch((error) => {
				console.error("Errore durante il recupero del post:", error);
			});
	}, []); // L'array vuoto come secondo argomento fa sì che useEffect si esegua solo dopo il primo render

	if (!postData) {
		// Se i dati non sono ancora stati recuperati, mostra un messaggio di caricamento
		return <div>Caricamento in corso...</div>;
	}

	// Una volta che i dati sono stati recuperati, mostra il post
	return (
		<div className="blog-post-container">
			<h2 className="blog-post-title">{postData.title}</h2>
			<p className="blog-post-category">Categoria: {postData.category}</p>
			<p className="blog-post-author">Autore: {postData.author.name}</p>
			<p className="blog-post-readtime">
				Tempo di Lettura: {postData.readtime.value} {postData.readtime.unit}
			</p>
			<img
				className="blog-post-image"
				src={postData.cover}
				alt="Copertina del Blog Post"
			/>
			<p className="blog-post-content">{postData.content}</p>
		</div>
	);
};

export default BlogPost;
