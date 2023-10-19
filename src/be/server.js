const express = require("express");
const mongoose = require("mongoose");
const authorsRouter = require("./router");
const blogPostRouter = require("./router");
const commentRouter = require("./router"); // Importa il router dei commenti
const cors = require("cors");
const path = require("path");

const server = express();
const port = 5050;

// Middleware per il parsing del corpo della richiesta in JSON
server.use(express.json());

server.use("/public", express.static(path.join(__dirname, "./public")));

// Middleware di CORS per consentire le richieste dal frontend
server.use(cors());

// Usa il router per gli endpoint degli autori
server.use("/", authorsRouter); // Tutte le richieste a /authors saranno gestite da authorsRouter
server.use("/blogposts", blogPostRouter);
server.use("/comments", commentRouter); // Tutte le richieste a /comments saranno gestite da commentRouter

mongoose.connect(
	"mongodb+srv://mikeyoulend:dzgJb5KNuUbjwf1a@epiccluster.udtebk2.mongodb.net/",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "error during db connection"));
db.once("open", () => {
	console.log("Database successfully connected");
});

server.listen(port, () => {
	console.log("Server in esecuzione sulla porta: ", port);
});
