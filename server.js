// Commenting line by line
// in order to set up the server, we bring express
const express = require("express");
// we set the application(app) to express
const app = express();
// imports the MongoClient class from the mongodb package
const MongoClient = require("mongodb").MongoClient;
// declares a port constant with a value of 2121
const PORT = 2121;
// loads the dotenv package and the config() method in order to read environment variables
require("dotenv").config();

// declares the database var, the connection string and renames the db to 'todo'
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo";

// establish the database connection with the help of MongoClient
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    // console logs the connection to the db
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);

// middleware to configure express to use EJS as the template engine for rendering html
app.set("view engine", "ejs");
// tells express to serve all files in the public directory without needing a route
app.use(express.static("public"));
// middleware that parses data from HTML forms
app.use(express.urlencoded({ extended: true }));
// middleware in Express used to parse json data and convert into javascript objects
app.use(express.json());

// read route using get() method
app.get("/", async (request, response) => {
  // try catch syntax
  try {
    // creates an array of todos from the db
    const todoItems = await db.collection("todos").find().toArray();
    // array of to dos not completed in the db
    const itemsLeft = await db
      .collection("todos")
      .countDocuments({ completed: false });
    // render in the UI through the ejs file am object with todo items and uncompleted items
    response.render("index.ejs", { items: todoItems, left: itemsLeft });
    // catch syntax
  } catch (err) {
    // in case of an error, console log the error
    console.error(err);
  }
});

// create a POST route at '/addTodo' endpoint
app.post("/addTodo", async (request, response) => {
  try {
    // add a todo item in the todos collection in our db with insertOne();
    // it inserts an object with 2 properties: thing and completed
    await db
      .collection("todos")
      .insertOne({ thing: request.body.todoItem, completed: false });
    // console log
    console.log("Todo Added");
    // after adding a todo, redirect to main page ('/')
    response.redirect("/");
    // catch syntax with cl error
  } catch (err) {
    console.error(err);
  }
});

// defines a PUT route at "/markComplete" endpoint
app.put("/markComplete", async (request, response) => {
  // try syntax
  try {
    // goes to todos collection in the db and uses updateOne() method
    // to update a completed item that matches the criteria
    await db.collection("todos").updateOne(
      // finds the todo item with a thing property = request.body.itemFromJS
      { thing: request.body.itemFromJS },
      // updates the found todo by setting completed: true
      {
        // $set is a MongoDB operator used to update fields
        $set: {
          completed: true,
        },
      },
      // if multiple items match, update the most recently added
      {
        sort: { _id: -1 },
        // ensures that no new document is created if no match is found
        upsert: false,
      }
    );

    // logs confirmation of item marked as complete
    console.log("Marked Complete");
    // responds with JSON to inform the frontend of success
    response.json("Marked Complete");
    // logs any potential errors
  } catch (err) {
    console.error(err);
  }
});

// defines a PUT request at "/markUnComplete"
app.put("/markUnComplete", async (request, response) => {
  // try syntax to catch errors
  try {
    // find todos collection in the db and use updateOne()
    // to update any items that match the criteria
    await db.collection("todos").updateOne(
      // update all items that match the property thing = request.body.itemFromJS
      { thing: request.body.itemFromJS },
      {
        // MOngoDB operator used tu update fields
        $set: {
          completed: false,
        },
      },
      //  if multiple items match, update the most recently added
      {
        sort: { _id: -1 },
        upsert: false,
      }
    );

    // logs to confirm that an item was marked uncomplete
    console.log("Marked Uncomplete");
    // responds with a JSON to inform frontend of success
    response.json("Marked Uncomplete");
    // catch syntax and cl of any errors
  } catch (err) {
    console.error(err);
  }
});

// defines a DELETE route at "/deleteItem" endpoint
app.delete("/deleteItem", async (request, response) => {
  // try syntax in order to catch any errors
  try {
    // go to todos collection in our db and use deleteOne() method
    // find the todo item that matches the property thing = request.body.itemFromJS
    await db.collection("todos").deleteOne({ thing: request.body.itemFromJS });

    // logs confirmation of item being deleted
    console.log("Todo Deleted");
    // responds with a JSON to inform the frontend of success
    response.json("Todo Deleted");
    // catch syntax and cl of any errors
  } catch (err) {
    console.error(err);
  }
});

// stars the server on the specified port and cl on what port is the server running
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
