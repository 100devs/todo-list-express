// Backend server-side code for the todo list app

// Import the Express framework
const express = require("express");
// create an instance of the express application
const app = express();

// Import the MongoDB client in order to connect to the database
const MongoClient = require("mongodb").MongoClient;

// Set a default port to 2121 used when not running the app locally
const PORT = 2121;

// Load environment variables from a .env file
require("dotenv").config();

// set variable names for the database connection string and the database name
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo";

// selecting, configuring and connecting to the specific database using dbConnectionStr
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then((client) => {
  console.log(`Connected to ${dbName} Database`);
  db = client.db(dbName);
});

// Configuring Express:
// - Set the view/template engine to ejs
// - server the static assets from the public folder
// - parse url encoded form data into the request body
// - parse json request bodies into the request body
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Handle get requests to the root url/front page of the app. Fetch all todo items and the count of
// incomplete items from MongoDB, then render the index.ejs template with that data.
app.get("/", async (request, response) => {
  const todoItems = await db.collection("todos").find().toArray();
  const itemsLeft = await db.collection("todos").countDocuments({ completed: false });
  response.render("index.ejs", { items: todoItems, left: itemsLeft });
  db.collection("todos")
    .find()
    .toArray()
    .then((data) => {
      db.collection("todos")
        .countDocuments({ completed: false })
        .then((itemsLeft) => {
          response.render("index.ejs", { items: data, left: itemsLeft });
        });
    })
    .catch((error) => console.error(error));
});

// Handle post requests to the /addTodo url, when a new todo form is submitted. Insert the new item
// into the todo collection, then redirect to the homepage to reload the page including the change.
app.post("/addTodo", (request, response) => {
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem, completed: false })
    .then((result) => {
      console.log("Todo Added");
      response.redirect("/");
    })
    .catch((error) => console.error(error));
});

// Handle put requests to /markComplete. Find the document where the thing field match the text
// sent from the client and set its completed flag to true. If multiple match, update the most
// recent one. Do not create a new document if none match (upsert: false).
app.put("/markComplete", (request, response) => {
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: true,
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      }
    )
    .then((result) => {
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    .catch((error) => console.error(error));
});

// Same as markComplete, but set completed to false
app.put("/markUnComplete", (request, response) => {
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: false,
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      }
    )
    .then((result) => {
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    .catch((error) => console.error(error));
});

// Handle delete requests to /deleteItem. Remove a single todo from the collection whose thing value matches the text sent from the client
app.delete("/deleteItem", (request, response) => {
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      console.log("Todo Deleted");
      response.json("Todo Deleted");
    })
    .catch((error) => console.error(error));
});

// Start the server, using the hosting provider's port if available, otherwise use port 2121
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
