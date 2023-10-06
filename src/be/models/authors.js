const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Definisci lo schema degli autori
const authorSchema = new Schema({
	nome: {
		type: String,
		required: true,
	},
	cognome: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true, // L'email deve essere unica
	},
	dataDiNascita: {
		type: String,
		required: true,
	},
	avatar: {
		type: String,
	},
});

// Crea un modello basato sullo schema
const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
