import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;
var posts = [];
console.log("posts set to []");
var post = {};

main();

function main() {
  posts.reverse();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, "public")));
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });

  app.get("/", (req, res) => {
    console.log("1", posts);
    res.redirect("/home");
  });

  app.post("/home", (req, res) => {
    console.log("2", posts);
    res.redirect("/home");
  });

  app.get("/home", (req, res) => {
    console.log("3", posts);
    post = {};
    res.render("index.ejs", { posts: posts });
  });

  app.post("/view", (req, res) => {
    if (req.body.newPost) {
      post = createPost(req.body.postTitle, req.body.postContent);
    } else if (req.body.updatePost) {
      post = editPost(req.body.updatePost, req.body.postTitle, req.body.postContent);
    } else if (req.body.cancelPost) {
      post = posts[posts.findIndex((post) => post.ID == req.body.cancelPost)];
    } else {
      post = posts[posts.findIndex((post) => post.ID == req.body.postID)];
    }
    console.log("view:", posts);
    if (post === undefined) {
      res.redirect("/home");
    } else {
      res.render("view.ejs", { post });
    }
  });

  app.post("/create", (req, res) => {
    res.render("create.ejs");
  });

  app.post("/edit", (req, res) => {
    if (req.body.updatePost) {
      post = posts[posts.findIndex((post) => post.ID == req.body.updatePost)];
      res.render("edit.ejs", { post });
    } else if (req.body.deletePost) {
      deletePost(req.body.deletePost);
      res.redirect("/home");
    } else {
      res.redirect("/home");
    }
  });
}

function createPost(title, content) {
  if (checkPost(title, content)) {
    const post = {
      ID: posts.length,
      title: title.toString(),
      content: content.toString(),
    };
    posts.unshift(post);
    console.log("create:", posts);
    return post;
  }
}

function editPost(ID, title, content) {
  var index = posts.findIndex((post) => post.ID == ID);
  if (checkPost(title, content)) {
    posts[index] = {
      ID: ID,
      title: title,
      content: content,
    };
    return posts[index];
  }
}

function checkPost(title, content) {
  if (title === undefined || content === undefined) {
    return true;
  } else if (title === "" || content === "") {
    return false;
  } else if (
    title.replaceAll(" ", "") === "" ||
    content.replaceAll(" ", "") === ""
  ) {
    return false;
  } else {
    return true;
  }
}

function deletePost(ID) {
  var postIndex = posts.findIndex((post) => post.ID === parseInt(ID));
  posts.splice(postIndex, 1);
  for (var i = postIndex - 1; i >= 0; i--) {
    posts[i].ID--;
  }
}
