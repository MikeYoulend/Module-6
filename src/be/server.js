const express = require("express");
const mongoose = require("mongoose");
const usersRouter = require("./router");
const authorsRouter = require("./router");
const blogPostRouter = require("./router");
const commentRouter = require("./router"); // Importa il router dei commenti
const loginRoute = require("./routes/login");
const githubRoute = require("./routes/github");
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
server.use("/", blogPostRouter);
server.use("/", commentRouter); // Tutte le richieste a /comments saranno gestite da commentRouter
server.use("/", usersRouter);
server.use("/", loginRoute);
server.use("/", githubRoute);

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
