const express = require("express");
const mongoose = require("mongoose");
const authorsRouter = require("./router");
const blogPostRouter = require("./router");
const cors = require("cors");

const server = express();
const port = 5050;

// Middleware per il parsing del corpo della richiesta in JSON
server.use(express.json());

// Middleware di CORS per consentire le richieste dal frontend
server.use(cors());

// Usa il router per gli endpoint degli autori
server.use("/", authorsRouter); // Tutte le richieste a /authors saranno gestite da authorsRouter
server.use("/blogposts", blogPostRouter);

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
