// Require express as a dependency
const express = require("express");

// Define express for use in the application
const app = express();

// Require mongoclient for MongoDB as a dependency
const MongoClient = require("mongodb").MongoClient;

// Define the default port used by the server
const PORT = 2121;

// Require dotenv in order to enable local system variables
require("dotenv").config();

// Declare variables for the database connection and configuration
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo";

// Connect to the MongoDB database using MongoClient
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Enable parsing of URL-encoded and JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define a route for the root URL ('/') with an asynchronous function
app.get("/", async (request, response) => {
  // Retrieve todo items from the 'todos' collection in the database
  const todoItems = await db.collection("todos").find().toArray();

  // Count the number of incomplete todo items
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false });

  // Render the 'index.ejs' view with the retrieved data
  response.render("index.ejs", { items: todoItems, left: itemsLeft });
});

// Define a route for adding a new todo item
app.post("/addTodo", (request, response) => {
  // Insert a new todo item into the 'todos' collection
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem, completed: false })
    .then((result) => {
      console.log("Todo Added");
      response.redirect("/");
    })
    .catch((error) => console.error(error));
});

// Define a route for marking a todo item as complete
app.put("/markComplete", (request, response) => {
  // Update the 'completed' field of a todo item to true
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

// Define a route for marking a todo item as incomplete
app.put("/markUnComplete", (request, response) => {
  // Update the 'completed' field of a todo item to false
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
      console.log("Marked Incomplete");
      response.json("Marked Incomplete");
    })
    .catch((error) => console.error(error));
});

// Define a route for deleting a todo item
app.delete("/deleteItem", (request, response) => {
  // Delete a todo item from the 'todos' collection
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      console.log("Todo Deleted");
      response.json("Todo Deleted");
    })
    .catch((error) => console.error(error));
});

// Start the server on the specified port or the default port
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
