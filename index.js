import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;
var posts = [];
var toViewNewPost = false;
var toViewEditedPost = false;
var post = {};

main();

function main() {
  posts.reverse();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, "public")));
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });

  app.get("/", (req, res) => {
    res.redirect("/home");
  });

  app.post("/home", (req, res) => {
    res.redirect("/home");
  });

  app.get("/home", (req, res) => {
    toViewNewPost = false;
    toViewEditedPost = false;
    post = {};
    res.render("index.ejs", { posts: posts });
  });

  app.post("/view", (req, res) => {
  console.log("Received POST /view request");
  console.log("Request body:", req.body);

  if (toViewNewPost) {
    console.log("Creating a new post");
    post = createPost(req.body.postTitle, req.body.postContent);
  } else if (toViewEditedPost) {
    if (req.body.updatePost) {
      console.log("Editing an existing post");
      post = editPost(req.body.updatePost, req.body.postTitle, req.body.postContent);
    } else {
      console.log("Cancelling post edit");
      post = posts[req.body.cancelPost];
    }
  } else {
    console.log("Viewing an existing post");
    post = posts[posts.findIndex((post) => post.ID == req.body.postID)];
  }

  console.log("Post object:", post);

  toViewNewPost = false;
  toViewEditedPost = false;

  if (post === undefined) {
    console.log("Post is undefined, redirecting to /home");
    res.redirect("/home");
  } else {
    console.log("Rendering view.ejs with post");
    res.render("view.ejs", { post });
  }
});


  app.post("/create", (req, res) => {
    toViewNewPost = true;
    toViewEditedPost = false;
    res.render("create.ejs");
  });

  app.post("/edit", (req, res) => {
    toViewNewPost = false;
    if (req.body.updatePost) {
      toViewEditedPost = true;
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
  console.log("Creating post with title:", title, "and content:", content);
  if (checkPost(title, content)) {
    const post = {
      ID: posts.length,
      title: title.toString(),
      content: content.toString(),
    };
    posts.unshift(post);
    console.log("Post created successfully:", post);
    return post;
  } else {
    console.log("Post creation failed due to invalid title or content");
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
