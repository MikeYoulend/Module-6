const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
});

// Crea un modello basato sullo schema del blog post
const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = BlogPost;
