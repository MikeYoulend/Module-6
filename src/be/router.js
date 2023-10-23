const express = require("express");
const router = express.Router();
const Author = require("./models/authors");
const BlogPost = require("./models/blogPost");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require("./models/users");

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudStorage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: "Cloudinary",
		format: async (req, file) => "png",
		public_id: (req, file) => file.name,
	},
});

const internalStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "src/be/public");
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = `${Date.now()}-${crypto.randomUUID()}`;
		const fileExtension = path.extname(file.originalname);
		cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
	},
});

const upload = multer({ storage: internalStorage });
const cloudUpload = multer({ storage: cloudStorage });

router.post(
	"/posts/cloudUpload",
	cloudUpload.single("cover"),
	async (req, res) => {
		try {
			res.status(200).json({ cover: req.file.path });
		} catch (e) {
			console.error("Errore durante l'upload del file:", e);
			res.status(500).json({ error: "Errore durante l'upload del file" });
		}
	}
);

router.post("/posts/upload", upload.single("cover"), async (req, res) => {
	const url = `${req.protocol}://${req.get("host")}`;

	try {
		const imgUrl = req.file.filename;
		res.status(200).json({ cover: `${url}/public/${imgUrl}` });
	} catch (error) {
		console.error("Errore durante l'upload del file:", error);
		res.status(500).json({ error: "Errore durante l'upload del file" });
	}
});

router.get("/users/:id", async (req, res) => {
	try {
		const userId = req.params.id;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "Utente non trovato" });
		}
		res.json(user);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Ottieni tutti gli utenti
router.get("/users", async (req, res) => {
	try {
		const users = await User.find();
		res.json(users);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Crea un nuovo utente
router.post("/users/create", async (req, res) => {
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);
	try {
		const newUser = new User({
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			email: req.body.email,
			password: hashedPassword,
			avatar: req.body.avatar,
		});
		const savedUser = await newUser.save();
		res.json(savedUser);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Aggiorna un utente per ID
router.put("/users/:id", async (req, res) => {
	try {
		const userId = req.params.id;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "Utente non trovato" });
		}
		user.firstname = req.body.firstname;
		user.lastname = req.body.lastname;
		user.email = req.body.email;
		user.password = req.body.password;
		user.avatar = req.body.avatar;
		const updatedUser = await user.save();
		res.json(updatedUser);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Elimina un utente per ID
router.delete("/users/:id", async (req, res) => {
	try {
		const userId = req.params.id;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "Utente non trovato" });
		}
		await user.remove();
		res.json({ message: "Utente eliminato con successo" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//
//BLOGPOST
//

router.get("/blogposts/:id/comments", async (req, res) => {
	const postId = req.params.id;

	try {
		// Cerca i commenti in base all'ID del post
		const post = await BlogPost.findById(postId);

		if (!post) {
			// Se il post non è stato trovato, restituisci un errore 404 (Not Found)
			return res.status(404).json({ error: "Post non trovato" });
		}

		// Restituisci i commenti del post specifico come risposta
		res.json(post.comments);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get("/blogposts/:id/:authorName", async (req, res) => {
	const authorId = req.params.id;
	const authorName = req.params.authorName.replace("_", " "); // Sostituisci "_" con uno spazio nel nome dell'autore

	try {
		const blogPostsByAuthor = await BlogPost.find({
			"author.id": authorId,
			"author.name": authorName,
		});

		// Se l'autore non ha pubblicato alcun blog post, restituisci una risposta vuota
		if (!blogPostsByAuthor || blogPostsByAuthor.length === 0) {
			return res
				.status(404)
				.json({ message: "Nessun commento trovato per questo post." });
		}

		// Restituisci i blog post dell'autore specificato come risposta
		res.json(blogPostsByAuthor);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// GET: Restituisci tutti i blog post
router.get("/blogposts", async (req, res) => {
	try {
		const { title } = req.query; // Ottieni il titolo dalla query

		// Se è specificato un titolo, filtra i post per quel titolo
		if (title) {
			const filteredPosts = await BlogPost.find({
				title: { $regex: title, $options: "i" },
			});
			return res.json(filteredPosts);
		}

		// Se non è specificato un titolo, restituisci tutti i post
		const allPosts = await BlogPost.find();
		res.json(allPosts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// GET: Restituisci un singolo blog post per ID
router.get("/blogposts/:id", async (req, res) => {
	try {
		const blogPostId = req.params.id;
		const blogPost = await BlogPost.findById(blogPostId);
		if (!blogPost) {
			return res.status(404).json({ message: "Blog post non trovato" });
		}
		res.json(blogPost);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// POST: Crea un nuovo blog post
router.post("/blogposts", async (req, res) => {
	try {
		const newBlogPost = new BlogPost(req.body);
		const savedBlogPost = await newBlogPost.save();
		res.status(201).json(savedBlogPost);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// PUT: Modifica un blog post per ID
router.put("/blogposts/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { title, category, content } = req.body;

		const updatedPost = await BlogPost.findByIdAndUpdate(
			id,
			{ title, category, content },
			{ new: true }
		);

		if (!updatedPost) {
			return res.status(404).json({ message: "Post non trovato." });
		}

		res
			.status(200)
			.json({ message: "Post aggiornato con successo", post: updatedPost });
	} catch (error) {
		console.error("Errore durante l'aggiornamento del post:", error);
		res.status(500).json({ error: "Errore durante l'aggiornamento del post" });
	}
});

// DELETE: Cancella un blog post per ID
router.delete("/blogposts/:id", async (req, res) => {
	try {
		const { id } = req.params;
		await BlogPost.findByIdAndDelete(id);
		res.status(200).json({ message: "Post eliminato con successo" });
	} catch (error) {
		res.status(500).json({ error: "Errore durante l'eliminazione del post" });
	}
});

//
//Comments
//

// Endpoint per ottenere un commento specifico di un post specifico
router.get("/blogposts/:id/comments/:commentid", (req, res) => {
	const postId = req.params.id;
	const commentId = req.params.commentid;
	// Qui puoi recuperare il commento specifico dal tuo database
	// e restituirlo come risposta JSON
	res.json({
		message: `Ottenendo il commento con ID: ${commentId} del post con ID: ${postId}`,
	});
});

// Endpoint per aggiungere un nuovo commento ad un post specifico
router.post("/blogposts/:id/comments", async (req, res) => {
	const postId = req.params.id;
	const { text } = req.body;

	try {
		// Trova il post dal database utilizzando l'ID del post
		const post = await BlogPost.findById(postId);

		if (!post) {
			// Se il post non è stato trovato, restituisci un errore 404 (Not Found)
			return res.status(404).json({ error: "Post non trovato" });
		}

		// Assicurati che l'array dei commenti esista nel post
		if (!post.comments) {
			post.comments = [];
		}

		// Aggiungi il nuovo commento all'array 'comments' del post
		post.comments.push({ text });

		// Salva il post aggiornato nel tuo database
		await post.save();

		// Restituisci il commento appena creato come risposta
		res.status(201).json({
			message: "Nuovo commento aggiunto con successo",
			comment: post.comments[post.comments.length - 1],
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Endpoint per modificare un commento specifico di un post specifico
router.put("/blogposts/:id/comments/:commentid", async (req, res) => {
	const postId = req.params.id;
	const commentId = req.params.commentid;
	const updatedCommentData = req.body; // I nuovi dati del commento inviati nel corpo della richiesta

	try {
		// Trova il post dal database utilizzando l'ID del post
		const post = await BlogPost.findById(postId);

		// Verifica se il post è stato trovato
		if (!post) {
			return res.status(404).json({ error: "Post non trovato" });
		}

		// Trova l'indice del commento nell'array dei commenti del post
		const commentIndex = post.comments.findIndex(
			(comment) => comment._id == commentId
		);

		// Verifica se il commento è stato trovato
		if (commentIndex === -1) {
			return res.status(404).json({ error: "Commento non trovato" });
		}

		// Aggiorna i dati del commento esistente con i nuovi dati
		post.comments[commentIndex].text = updatedCommentData.text;
		// Puoi aggiornare altri campi del commento secondo le tue necessità

		// Salva il post aggiornato nel tuo database
		await post.save();

		// Restituisci il commento aggiornato come risposta
		res.status(200).json({
			message: `Commento con ID: ${commentId} nel post con ID: ${postId} aggiornato con successo`,
			comment: post.comments[commentIndex],
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Endpoint per eliminare un commento specifico da un post specifico
router.delete("/blogposts/:id/comments/:commentid", async (req, res) => {
	const postId = req.params.id;
	const commentId = req.params.commentid;

	try {
		// Trova il post dal database utilizzando l'ID del post
		const post = await BlogPost.findById(postId);

		// Verifica se il post è stato trovato
		if (!post) {
			return res.status(404).json({ error: "Post non trovato" });
		}

		// Trova l'indice del commento nell'array dei commenti del post
		const commentIndex = post.comments.findIndex(
			(comment) => comment._id == commentId
		);

		// Verifica se il commento è stato trovato
		if (commentIndex === -1) {
			return res.status(404).json({ error: "Commento non trovato" });
		}

		// Rimuovi il commento dall'array dei commenti
		post.comments.splice(commentIndex, 1);

		// Salva il post aggiornato nel tuo database
		await post.save();

		// Restituisci i commenti aggiornati come risposta
		res.status(200).json({
			message: `Commento con ID: ${commentId} eliminato dal post con ID: ${postId}`,
			comments: post.comments,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
