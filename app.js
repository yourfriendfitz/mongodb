const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const PostSchema = new Schema({
  message: String
});

const Post = mongoose.model("Post", PostSchema);

const logger = function(req, res, next) {
  console.log("logging");
  next();
};

app.use(logger);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/post", (req, res) => {
  const message = req.body.message;
  const post = new Post({
    message
  });
  post.save(error => {
    error ? res.json({ error: "Unable to save" }) : res.json(post);
  });
});

app.get("/posts", (req, res) => {
  Post.find({}, (error, posts) => {
    error ? res.json(error) : res.json(posts);
  });
});

app.listen(1000, () => {
  console.log("Listening on 1000");
});
