//@type-check

//Import express from 'express' module, returns a function reference
const express = require("express");
// calls the express function from the module and saves it to the variable 'app'
const app = express();

// Import MongoDB Native Driver
const MongoClient = require("mongodb").MongoClient;
//Set port to 2121
const PORT = 2121;
// Import dotenv module to read .env file
require("dotenv").config();

let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo";

// Connection URI string for MongoDB native driver
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);

// Sets the view engine to use EJS
app.set("view engine", "ejs");

// Tells express to serve files in this folder as static resources
app.use(express.static("public"));

// Middleware: Tells express to use body parser to parse form data
app.use(express.urlencoded({ extended: true }));

// Middleware: Tells express to parse request body as JSON
app.use(express.json());

// Call the get http method on the db object to get the todos collection asycrohronously
app.get("/", async (request, response) => {
  // await return of the todos collection from the db convert to array and assign to todoItems
  const todoItems = await db.collection("todos").find().toArray();

  // get the number of todo list items that are not completed, and assign to itemsLeft
  const itemsLeft = await db
    .collection("todos")

    .countDocuments({ completed: false });

  // render the index.ejs file and pass in the todoItems and itemsLeft variables
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

// Call the post http method on the db object to insert a new todo item at route /addTodo
app.post("/addTodo", (request, response) => {
  // Access the "todos" collection
  db.collection("todos")

    // insert the todo item into the todos collection
    .insertOne({ thing: request.body.todoItem, completed: false })

    // If document was successfully added...
    .then((result) => {
      // console log the message
      console.log("Todo Added");
      // redirect to the home route
      response.redirect("/");
    })

    // If an error occurred...console log the error
    .catch((error) => console.error(error));
});

// Call the update http method on the db object to update a todo item at route /markComplete
app.put("/markComplete", (request, response) => {
  //Access the todos collection from database
  db.collection("todos")

    //Update the todo item in the todos collection that matches the query with value thing = request.body.itemFromJS
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        // Adds field completed to the todo item in the todos collection and sets it to false
        $set: {
          completed: true,
        },
      },
      {
        // Sort the todo items by their _id field in descending order
        sort: { _id: -1 },
        //Set the upsert field to false
        upsert: false,
      }
    )
    // If document was successfully updated console log the message Marked Complete and set response to json messsage to marked complete
    .then((result) => {
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    .catch((error) => console.error(error));
});

// Call update http method on the db object to update a todo item at rout /markUnComplete
app.put("/markUnComplete", (request, response) => {
  //Access the todos collection from database
  db.collection("todos")
    //Update the todo item in the todos collection that matches the query with value thing = request.body.itemFromJS
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        // Adds field completed to the todo item in the todos collection and sets it to false
        $set: {
          completed: false,
        },
      },
      {
        // Sort the todo items by their _id field in descending order
        sort: { _id: -1 },
        //Set the upsert field to false
        upsert: false,
      }
    ) // If document was successfully updated console log the message Marked Complete and set response to json messsage to marked complete
    .then((result) => {
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    .catch((error) => console.error(error));
});

// Call delete http method on the db object to delete a todo item
app.delete("/deleteItem", (request, response) => {
  //access the todo collection
  db.collection("todos")
    //delete the document that matches the given query with a
    .deleteOne({ thing: request.body.itemFromJS })
    //if the document was successfully deleted console log the message TODO deleted and respond with a json message TODO deleted in body
    .then((result) => {
      console.log("Todo Deleted");
      response.json("Todo Deleted");
    })
    //if an error occurred console log the error console.error(error)
    .catch((error) => console.error(error));
});

// Start the server on port 2121 or port defined in .env file
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
