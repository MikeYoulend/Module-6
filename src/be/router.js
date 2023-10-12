const express = require("express");
const router = express.Router();
const Author = require("./models/authors");
const BlogPost = require("./models/blogPost");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

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

router.post("/posts/upload", upload.single("cover"), async (req, res) => {
	const url = `${req.protocol}://${req.get("host")}`;

	try {
		const imgUrl = req.file.filename;
		res.status(200).json({ img: `${url}/public/${imgUrl}` });
	} catch (error) {
		console.error("Errore durante l'upload del file:", error);
		res.status(500).json({ error: "Errore durante l'upload del file" });
	}
});

router.get("/authors/:id", async (req, res) => {
	try {
		// Ottieni l'ID dell'autore dalla richiesta
		const authorId = req.params.id;

		// Interroga il database per trovare l'autore con l'ID specificato
		const author = await Author.findById(authorId);

		// Se l'autore non è stato trovato, restituisci uno stato 404 Not Found
		if (!author) {
			return res.status(404).json({ message: "Autore non trovato" });
		}

		// Se l'autore è stato trovato, invia l'autore come risposta
		res.json(author);
	} catch (error) {
		// Gestisci gli errori
		res.status(500).json({ error: error.message });
	}
});

router.get("/authors", async (req, res) => {
	try {
		// Interroga il database per ottenere tutti gli autori
		const authors = await Author.find();

		// Invia la lista degli autori come risposta
		res.json(authors);
	} catch (error) {
		// Gestisci gli errori
		res.status(500).json({ error: error.message });
	}
});

router.post("/authors", async (req, res) => {
	try {
		// Crea un nuovo autore utilizzando i dati dalla richiesta
		const newAuthor = new Author({
			nome: req.body.nome,
			cognome: req.body.cognome,
			email: req.body.email,
			dataDiNascita: req.body.dataDiNascita,
			avatar: req.body.avatar,
		});

		// Salva l'autore nel database
		const savedAuthor = await newAuthor.save();

		// Invia l'autore salvato come risposta
		res.json(savedAuthor);
	} catch (error) {
		// Gestisci gli errori, inviando una risposta con lo stato 500 (Internal Server Error)
		res.status(500).json({ error: error.message });
	}
});

router.put("/authors/:id", async (req, res) => {
	try {
		// Ottieni l'ID dell'autore dalla richiesta
		const authorId = req.params.id;

		// Interroga il database per trovare l'autore con l'ID specificato
		const author = await Author.findById(authorId);

		// Se l'autore non è stato trovato, restituisci uno stato 404 Not Found
		if (!author) {
			return res.status(404).json({ message: "Autore non trovato" });
		}

		// Aggiorna i dati dell'autore con i nuovi dati dalla richiesta
		author.nome = req.body.nome;
		author.cognome = req.body.cognome;
		author.email = req.body.email;
		author.dataDiNascita = req.body.dataDiNascita;
		author.avatar = req.body.avatar;

		// Salva l'autore aggiornato nel database
		const updatedAuthor = await author.save();

		// Invia l'autore aggiornato come risposta
		res.json(updatedAuthor);
	} catch (error) {
		// Gestisci gli errori
		res.status(500).json({ error: error.message });
	}
});

router.delete("/authors/:id", async (req, res) => {
	try {
		// Ottieni l'ID dell'autore dalla richiesta
		const authorId = req.params.id;

		// Interroga il database per trovare l'autore con l'ID specificato
		const author = await Author.findById(authorId);

		// Se l'autore non è stato trovato, restituisci uno stato 404 Not Found
		if (!author) {
			return res.status(404).json({ message: "Autore non trovato" });
		}

		// Elimina l'autore dal database
		await author.remove();

		// Invia una risposta vuota per indicare che l'autore è stato eliminato con successo
		res.json({ message: "Autore eliminato con successo" });
	} catch (error) {
		// Gestisci gli errori
		res.status(500).json({ error: error.message });
	}
});

//
//BLOGPOST
//

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
		const blogPostId = req.params.id;
		const updatedBlogPost = await BlogPost.findByIdAndUpdate(
			blogPostId,
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);
		if (!updatedBlogPost) {
			return res.status(404).json({ message: "Blog post non trovato" });
		}
		res.json(updatedBlogPost);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// DELETE: Cancella un blog post per ID
router.delete("/blogposts/:id", async (req, res) => {
	try {
		const blogPostId = req.params.id;
		const deletedBlogPost = await BlogPost.findByIdAndDelete(blogPostId);
		if (!deletedBlogPost) {
			return res.status(404).json({ message: "Blog post non trovato" });
		}
		res.json({ message: "Blog post eliminato con successo" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//
//Comments
//

router.get("/blogposts/:id/comments", async (req, res) => {
	try {
		const postId = req.params.id;

		// Cerca i commenti in base all'ID del post
		const comments = await Comment.find({ postId });

		// Restituisci i commenti del post specifico come risposta
		res.json(comments);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

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
		// Cerca il commento nel tuo database in base all'ID del post e all'ID del commento
		const existingComment = await Comment.findOne({
			_id: commentId,
			postId: postId,
		});

		if (!existingComment) {
			return res.status(404).json({ message: "Commento non trovato" });
		}

		// Aggiorna i dati del commento esistente con i nuovi dati
		existingComment.text = updatedCommentData.text;
		// Puoi aggiornare altri campi del commento secondo le tue necessità

		// Salva il commento aggiornato nel tuo database
		const updatedComment = await existingComment.save();

		// Restituisci il commento aggiornato come risposta
		res.json({ message: "Commento aggiornato con successo", updatedComment });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Endpoint per eliminare un commento specifico da un post specifico
router.delete("/blogposts/:id/comments/:commentid", (req, res) => {
	const postId = req.params.id;
	const commentId = req.params.commentid;
	// Qui puoi eliminare il commento specifico dal tuo database
	res.json({
		message: `Commento con ID: ${commentId} del post con ID: ${postId} eliminato`,
	});
});

module.exports = router;
