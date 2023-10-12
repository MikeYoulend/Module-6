import React, { useState } from "react";

const AddCommentForm = ({ postId, onCommentSubmit }) => {
	const [commentText, setCommentText] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		// Chiamare la funzione di callback passata come prop per inviare il commento
		onCommentSubmit(postId, commentText);
		// Resetta il campo di input del commento
		setCommentText("");
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="text"
				placeholder="Inserisci il tuo commento..."
				value={commentText}
				onChange={(e) => setCommentText(e.target.value)}
			/>
			<button type="submit">Invia Commento</button>
		</form>
	);
};

export default AddCommentForm;
