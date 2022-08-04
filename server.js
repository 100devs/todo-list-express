// Use node's express package
const express = require("express");
// Store express call in variable "app" for convenience
const app = express();
// Use node's mongodb package
const MongoClient = require("mongodb").MongoClient;
// Store port in varible "PORT" for convenience
const PORT = 2121;
// Use node's dotenv package (for hiding login/secret data)
require("dotenv").config();

// Declare dotenv variables for database and its hidden login
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo";

// Connect to MongoDB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);

// Set view engine to EJS
app.set("view engine", "ejs");
// Serve static files from the "public" file
app.use(express.static("public"));
// Parses incoming requests
app.use(express.urlencoded({ extended: true }));
// Parse incoming requests with JSON
app.use(express.json());

// Listen for a request to main page
app.get("/", async (request, response) => {
  // Get todo items and store them in an array
  const todoItems = await db.collection("todos").find().toArray();
  // Get uncompleted items, store a count of how many exist
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false });
  // Send todolist data to ejs to be constructed into the DOM
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

// Listen for a request to add a new item to Todo list
app.post("/addTodo", (request, response) => {
  // Take data from request and insert it as a new item in the database
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem, completed: false })
    // Console log result and refresh the page
    .then((result) => {
      console.log("Todo Added");
      response.redirect("/");
    })
    // If the promise is rejected, print the error in the console
    .catch((error) => console.error(error));
});

// Listen for a request to edit an item (marking it complete)
app.put("/markComplete", (request, response) => {
  // Take data from client's request and use it to update the item in the database
  db.collection("todos")
    .updateOne(
      // Find item that matches the request
      { thing: request.body.itemFromJS },
      {
        // Change the completed property of the item to true
        $set: {
          completed: true,
        },
      },
      {
        // Sort the database items in descending order
        sort: { _id: -1 },
        // Do not create a new item if requested item isn't found
        upsert: false,
      }
    )
    // Log the result and respond with json
    .then((result) => {
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    // If the promise is rejected, print the error in the console
    .catch((error) => console.error(error));
});

// Listen for a request to edit an item (marking it uncomplete)
app.put("/markUnComplete", (request, response) => {
  // Find item in the database that matches the request
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        // Change the completed property to false
        $set: {
          completed: false,
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      }
    )
    // If the promise is fullfilled, send a JSON response back to main.js
    .then((result) => {
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    // If the promise is rejected, print the error in the console
    .catch((error) => console.error(error));
});

// Listen for a request to remove an item
app.delete("/deleteItem", (request, response) => {
  // Deleting one object from the db collection
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS })
    // Log the result and respond with json
    .then((result) => {
      console.log("Todo Deleted");
      response.json("Todo Deleted");
    })
    // If the promise is rejected, print the error in the console
    .catch((error) => console.error(error));
});

// Connect to the port with process.env.PORT which is variable in our .env file
app.listen(process.env.PORT || PORT, () => {
  // Console log the specific port number the server is running on
  console.log(`Server running on port ${PORT}`);
});
