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

const SnippetSchema = new Schema({
  title: String,
  body: String
});

const Snippet = mongoose.model("Snippet", SnippetSchema);

const QuestionSchema = new Schema({
  tag: String,
  body: String,
  selections: Object,
  answer: String
});

const Question = mongoose.model("Question", QuestionSchema);

const WinnerSchema = new Schema({
  name: String
});

const Winner = mongoose.model("Winner", WinnerSchema);

const ModelDeleteById = (Model, id) => {
  Model.findByIdAndRemove(id, (error, response) => {
    error ? res.json(error) : res.json(response);
  });
};

const ModelFindAll = (Model, res) => {
  Model.find({}, (error, snippets) => {
    error ? res.json(error) : res.json(snippets);
  });
};

const ModelSave = (newModel, res) => {
  newModel.save((error, snippet) => {
    error ? res.json(error) : res.json(snippet);
  });
};

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
  ModelSave(post, res);
});

app.get("/posts", (req, res) => {
  ModelFindAll(Post, res);
});

// async/await example

/* app.get("/posts", async (req, res) => {
  try {
    const posts = awaitPost.find({});
    res.json(posts);
  } catch (error) {
    res.json(error);
  }
}); */

app.post("/snippet", (req, res) => {
  const [title, body] = [req.body.title, req.body.body];
  const snippet = new Snippet({
    title,
    body
  });
  ModelSave(snippet, res);
});

app.post("/snippet/delete/:id", (req, res) => {
  const id = req.params.id;
  ModelDeleteById(Snippet, id);
});

app.get("/snippets", (req, res) => {
  ModelFindAll(Snippet, res);
});

app.post("/question", (req, res) => {
  const selections = req.body.selections.split(",");
  const [tag, body, answer] = [req.body.tag, req.body.body, req.body.answer];
  const question = new Question({
    tag,
    body,
    selections,
    answer
  });
  ModelSave(question, res);
});

app.get("/questions", (req, res) => {
  ModelFindAll(Question, res);
});

app.post("/question/delete/:id", (req, res) => {
  const id = req.params.id;
  ModelDeleteById(Question, id);
});

app.post("/winner", (req, res) => {
  const name = req.body.name;
  const winner = new Winner({
    name
  });
  ModelSave(winner, res);
});

app.get("/winners", (req, res) => {
  ModelFindAll(Winner, res);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
