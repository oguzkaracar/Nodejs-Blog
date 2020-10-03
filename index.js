const express = require("express");
const fs = require("fs");

// body parser
const app = express();

// if you have a public dir with static scripts and styles
app.use(express.static(__dirname + "/public"));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// path for the ejs folder
const path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// gray-matter to read the .md files better
const matter = require("gray-matter");

// index page
app.get("/", (req, res) => {
	const posts = fs.readdirSync(__dirname + "/blog").filter((file) => file.endsWith(".md"));
	res.render("index", {
		posts: posts,
	});
});

// article details - yazıları okuma işlemleri..
app.get("/blog/:article", (req, res) => {
	try {
		const file = matter.read(__dirname + "/blog/" + req.params.article + ".md");
		// use markdown-it to convert content to HTML
		var md = require("markdown-it")();
		let content = file.content;
		var result = md.render(content);
		res.render("blog/", {
			post: result,
			title: file.data.title,
			date: file.data.date,
			description: file.data.description,
			image: file.data.image,
		});
	} catch (error) {
		res.status(404).render("404");
	}
});

// posts - yazıları listele...
app.get("/blog", (req, res) => {
	try {
		const posts = fs.readdirSync(__dirname + "/blog").filter((file) => file.endsWith(".md"));
		res.render("blog/blogPosts", {
			posts: posts,
		});
	} catch (err) {
		res.status(404).render("404");
	}
});

app.get("/hakkimda", (req, res) => {
	res.render("hakkimda");
});

// 404 page middleware

app.use(function (req, res) {
	res.status(404).render("404");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log("server çalıştı..."));
