import React, { useState, useEffect } from "react";

const CommentList = ({ postId }) => {
	const [comments, setComments] = useState([]);

	useEffect(() => {
		if (postId) {
			fetch(`http://localhost:5050/blogposts/${postId}/comments`)
				.then((response) => response.json())
				.then((data) => {
					setComments(data);
					console.log(data); // Imposta i commenti ricevuti come stato dei commenti
				})
				.catch((error) => {
					console.error("Errore durante il recupero dei commenti:", error);
				});
		}
	}, [postId]);

	const handleDeleteComment = (postId, commentId) => {
		// Effettua una richiesta DELETE per eliminare il commento specificato dal backend
		fetch(`http://localhost:5050/blogposts/${postId}/comments/${commentId}`, {
			method: "DELETE",
		})
			.then((response) => response.json())
			.then((data) => {
				// Aggiorna lo stato locale con i commenti aggiornati (senza il commento eliminato)
				setComments(data.comments);
				console.log(data.message);
			})
			.catch((error) => {
				console.error("Errore durante l'eliminazione del commento:", error);
			});
	};

	return (
		<div
			className="comment-list mt-5  p-4"
			style={{ backgroundColor: "#f8f1fa", borderRadius: "10px" }}
		>
			<h3 className="mb-3 bg-dark text-white p-2 rounded">Commenti</h3>
			{comments.length > 0 ? (
				<ul className="list-group">
					{comments.map((comment) => (
						<li
							key={comment._id}
							className="list-group-item d-flex justify-content-between align-items-center"
						>
							<strong>Testo:</strong> {comment.text}
							<button
								className="btn btn-danger btn-sm"
								onClick={() => handleDeleteComment(postId, comment._id)}
							>
								Elimina
							</button>
						</li>
					))}
				</ul>
			) : (
				<p className="mt-3">Nessun commento disponibile.</p>
			)}
		</div>
	);
};

export default CommentList;
