const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Definisci lo schema per i commenti
const commentSchema = new Schema({
	text: { type: String, required: true },
});

// Definisci lo schema del blog post
const blogPostSchema = new Schema({
	category: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	cover: {
		type: String,
		required: true,
	},
	readtime: {
		value: {
			type: Number,
			required: true,
		},
		unit: {
			type: String,
			required: true,
		},
	},
	author: {
		name: {
			type: String,
			required: true,
		},
	},
	content: {
		type: String,
		required: true,
	},
	comments: [commentSchema], // Array di commenti basati sullo schema dei commenti
});

// Crea un modello basato sullo schema del blog post
const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = BlogPost;
