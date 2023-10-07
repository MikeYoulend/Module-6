import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, setFilteredPosts } from "../../../reducers";
import "../../../App.css";

const BlogPost = () => {
	const dispatch = useDispatch();
	const allPosts = useSelector((state) => state.posts);
	const [loading, setLoading] = useState(true);
	const [posts, setPostsState] = useState(allPosts);

	useEffect(() => {
		// Effettua una richiesta GET all'endpoint del tuo server backend
		fetch("http://localhost:5050/blogposts")
			.then((response) => response.json())
			.then((data) => {
				// I dati ottenuti dalla richiesta vengono inviati a Redux usando l'azione setPosts
				dispatch(setPosts(data));
				// Imposta i post locali con i dati ottenuti
				setPostsState(data);

				// Ritarda l'impostazione di loading a false per 5 secondi
				setTimeout(() => {
					setLoading(false);
				}, 3000);
			})
			.catch((error) => {
				console.error("Errore durante il recupero dei post:", error);
				// Imposta loading a false in caso di errore nel caricamento dei dati
				setLoading(false);
			});
	}, [dispatch]); // Assicurati di passare dispatch come dipendenza per evitare warning sull'uso di dispatch nel useEffect

	const handleSearch = (e) => {
		const query = e.target.value.toLowerCase();
		const filteredPosts = allPosts.filter((post) => {
			return post.title.toLowerCase().includes(query);
		});

		// I dati filtrati vengono inviati a Redux usando l'azione setFilteredPosts
		dispatch(setFilteredPosts(filteredPosts));
		// Aggiorna lo stato locale per visualizzare i risultati filtrati
		setPostsState(filteredPosts);
	};

	if (loading) {
		// Se i dati stanno ancora caricando, mostra un messaggio di caricamento
		return (
			<div className="text-center bg-info fs-1">
				<Spinner animation="border" variant="light" />
				Caricamento in corso...
			</div>
		);
	}

	return (
		<div>
			<div className="navbar">
				<input type="text" placeholder="Cerca..." onChange={handleSearch} />
			</div>
			{posts.map((post) => (
				<div key={post._id} className="blog-post-container">
					<h2 className="blog-post-title">{post.title}</h2>
					<p className="blog-post-category">Categoria: {post.category}</p>
					<p className="blog-post-author">Autore: {post.author.name}</p>
					<p className="blog-post-readtime">
						Tempo di Lettura: {post.readtime.value} {post.readtime.unit}
					</p>
					<img
						className="blog-post-image"
						src={post.cover}
						alt="Copertina del Blog Post"
					/>
					<p className="blog-post-content">{post.content}</p>
				</div>
			))}
		</div>
	);
};

export default BlogPost;
