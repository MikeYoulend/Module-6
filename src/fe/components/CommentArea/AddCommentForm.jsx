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
		<form className="mt-5 pt-5" onSubmit={handleSubmit}>
			<div className="input-group mb-3">
				<input
					type="text"
					className="form-control"
					placeholder="Inserisci il tuo commento..."
					value={commentText}
					onChange={(e) => setCommentText(e.target.value)}
				/>
				<button className="btn btn-primary" type="submit">
					Invia Commento
				</button>
			</div>
		</form>
	);
};

export default AddCommentForm;
