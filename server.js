// Add express to our server.js file and store it in a variable named "express"
const express = require("express");
// Create an express application
const app = express();
// Add MongoDB database to our server.js file and store it in a variable named "MongoClient"
const MongoClient = require("mongodb").MongoClient;
// Establish our port at "2121" and store it in a variable named PORT
const PORT = 2121;
// Require DotEnv npm package
require("dotenv").config();

// Store our database connection string (via MongoDB) in the variables "db" "dbConnectionStr"
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo";

// Connect MongoDB database to our application
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    // Log to the console "Connected to ... Database"
    console.log(`Connected to ${dbName} Database`);
    // Our database connection string links to the "todo" database where we will store our todo items
    db = client.db(dbName);
  }
);

// Set the view engine to EJS
app.set("view engine", "ejs");
// Serve static files in express in the public directory
app.use(express.static("public"));
// Parses application
app.use(express.urlencoded({ extended: true }));
// Parses incoming JSON requests
app.use(express.json());

// A GET request with the path '/'
app.get("/", async (request, response) => {
  // Find the "todos" database collection, convert it to an array, and store it in a variable "todoItems"
  const todoItems = await db.collection("todos").find().toArray();
  // Store the items in the "todos" database collection that haven't been completed in a variable "itemsLeft"
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false });
  // Render the response from the server in the EJS file
  response.render("index.ejs", { items: todoItems, left: itemsLeft });
  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
});

// A POST request with the path '/addTodo'
app.post("/addTodo", (request, response) => {
  // Insert a todo item to the database collection "todos"
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem, completed: false })
    // Log to the console "Todo Added"
    .then((result) => {
      console.log("Todo Added");
      // Redirect the user to the path '/'
      response.redirect("/");
    })
    // Catch any errors and log them to the console
    .catch((error) => console.error(error));
});

// A PUT request with the path '/markComplete'
app.put("/markComplete", (request, response) => {
  // Update items in the "todos" database collection and mark them complete
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
    // Log the result to the console
    .then((result) => {
      console.log("Marked Complete");
      // Format the response in JSON
      response.json("Marked Complete");
    })
    // Catch any errors and log them to the console
    .catch((error) => console.error(error));
});

// A PUT request with the path '/markUnComplete'
app.put("/markUnComplete", (request, response) => {
  // Update items in the "todos" database collection and mark them uncomplete
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
    // Log the result to the console
    .then((result) => {
      console.log("Marked Complete");
      // Format the response in JSON
      response.json("Marked Complete");
    })
    // Catch any errors and log them to the console
    .catch((error) => console.error(error));
});

// A DELETE request with the path '/deleteItem'
app.delete("/deleteItem", (request, response) => {
  // Delete the item from the "todos" database collection
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS })
    // Log the result to the console
    .then((result) => {
      console.log("Todo Deleted");
      // Format the response in JSON
      response.json("Todo Deleted");
    })
    // Catch any errors and log them to the console
    .catch((error) => console.error(error));
});

// Run the server on the given PORT
app.listen(process.env.PORT || PORT, () => {
  // Log to the console what port the server is running on
  console.log(`Server running on port ${PORT}`);
});
