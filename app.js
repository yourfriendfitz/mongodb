const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const fs = require("fs");
const path = require("path");
const multer = require("multer"); //FOR FILE UPLOAD
const storage = multer.diskStorage({
  //multers disk storage settings
  destination: function(req, file, cb) {
    cb(null, "./public"); //image storage path
  },
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

const upload = multer({
  //multer settings
  storage: storage
}).single("file");

require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(multer({ dest: "./public/uploads/" }).single("file"));

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

const modelschema = new Schema({
  title: String,
  body: String
});

const Snippet = mongoose.model("Snippet", modelschema);

const QuestionSchema = new Schema({
  tag: String,
  body: String,
  selections: Object,
  answer: String
});

const Question = mongoose.model("Question", QuestionSchema);

const WinnerSchema = new Schema({
  name: String,
  date: String
});

const Winner = mongoose.model("Winner", WinnerSchema);

const IntakeSchema = new Schema({
  name: String,
  age: String,
  location: String,
  type: String,
  imgUrl: String
});

const Intake = mongoose.model("Intake", IntakeSchema);

const ModelDeleteById = (Model, id) => {
  Model.findByIdAndRemove(id, (error, response) => {
    error ? res.json(error) : res.json(response);
  });
};

const ModelFindAll = (Model, res) => {
  Model.find({}, (error, models) => {
    error ? res.json(error) : res.json(models);
  });
};

const ModelFindByTag = (Model, tag, res) => {
  Model.find({ tag }, (error, models) => {
    error ? res.json(error) : res.json(models);
  });
};

const ModelSave = (newModel, res) => {
  newModel.save((error, model) => {
    error ? res.json(error) : res.json(model);
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

app.get("/questions/:tag", (req, res) => {
  const tag = req.params.tag;
  ModelFindByTag(Question, tag, res);
});

app.post("/winner", (req, res) => {
  const name = req.body.name;
  const date = new Date();
  const winner = new Winner({
    name,
    date
  });
  ModelSave(winner, res);
});

app.get("/winners", (req, res) => {
  ModelFindAll(Winner, res);
});

app.post("/winner/delete/:id", (req, res) => {
  const id = req.params.id;
  ModelDeleteById(Winner, id);
});

app.post("/intake", upload, (req, res) => {
  if (req.file) {
    upload(req, res, function(err) {
      if (err) {
        // An error occurred when uploading
        return res.status(422).send("an Error occured");
      }
      // No error occured.
      path = req.file.path;
    });
  }
  const name = req.body.name;
  const age = req.body.age;
  const location = req.body.location;
  const type = req.body.type;
  const imgUrl = req.body.imgUrl;
  const intake = new Intake({
    name,
    age,
    location,
    type,
    imgUrl
  });
  ModelSave(intake, res);
});

app.post("/intake/upload", upload, (req, res) => {
  console.log(req.file);
  res.json(req.file);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
