// import express module
const express = require("express");
// assign the express function to the variable app
const app = express();
// import MongoDB driver
const MongoClient = require("mongodb").MongoClient;
// const for PORT on local machine
const PORT = 2121;
// imports and configures 'dotenv' module, which allows process.env to access keys and values in .env file(s)
require("dotenv").config();

// declare the variable db
let db,
  // takes the DB_STRING constant (containing the MongoDB connection string) from the .env file and assigns it to the variable dbConnectionStr
  dbConnectionStr = process.env.DB_STRING,
  // assign the name of the db ('todo') to the variable dbName
  dbName = "todo";

// connect to the MongoDB db
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  // promise chain
  .then((client) => {
    // logging message to console that the user is connected to the 'todo' database
    console.log(`Connected to ${dbName} Database`);
    // reassigning variable to access the db in MongoDB (here, it's 'todo')
    db = client.db(dbName);
  });

// tells Express to use EJS as a template
app.set("view engine", "ejs");
// built-in middleware that allows Express access to everything in the 'public' folder
app.use(express.static("public"));
// built-in middleware that allows for the parsing of incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: true }));
// built-in middleware that allows for the parsing of incoming requests with JSON payloads
app.use(express.json());

// GET request for the home page
app.get("/", async (request, response) => {
  // goes into the 'todos' collection of the db, finds documents therein, and puts them into an array
  const todoItems = await db.collection("todos").find().toArray();
  // goes into the 'todos' collection of the db, counts the number of documents where completed is false, and assigns that number to the variable named itemsLeft
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false });
  // transfers data (todoItems and itemsLeft) into the EJS template and responds with HTML that appears on the UI
  response.render("index.ejs", { items: todoItems, left: itemsLeft });
  // see above in app.get(): this is the code to get the number of items remaining on the todo list; transferring data (todoItems and itemsLeft) into the EJS template and responding with HTML that appears on the UI; and logging any errors to the console, all without using async/await

  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
});

// POST request to /addTodo path
app.post("/addTodo", (request, response) => {
  // go to db, find 'todos' collection, insert a new task (thing) into the document, and mark it is not completed (i.e., false)
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem, completed: false })
    // promise chain
    .then((result) => {
      // logs "Todo Added" into the console
      console.log("Todo Added");
      // responds via redirect back to homepage, which displays the newly added thing on the UI
      response.redirect("/");
    })
    // logs errors from POST request to the console (if any)
    .catch((error) => console.error(error));
});

// PUT request to /markComplete path 
app.put("/markComplete", (request, response) => {
  // go to db, gets the 'todos' collection, finds the value of thing (itemFromJS) and updates it
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        // sets completed to true
        $set: {
          completed: true,
        },
      },
      {
        // sort by descending order
        sort: { _id: -1 },
        // no update/filtering document nor adding/updating the collection with new document
        upsert: false,
      }
    )
    // promise chain
    .then((result) => {
      // logs "Marked Complete" to the console
      console.log("Marked Complete");
      // responds with "Marked Complete" as JSON
      response.json("Marked Complete");
    })
    // error handling: logs any error to the console
    .catch((error) => console.error(error));
});

// PUT request to /markUnComplete path 
app.put("/markUnComplete", (request, response) => {
  // go to db, gets the 'todos' collection, finds the value of thing (itemFromJS) and updates it
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        // sets completed to false
        $set: {
          completed: false,
        },
      },
      {
        // sort by descending order
        sort: { _id: -1 },
        // no update/filtering document nor adding/updating the collection with new document
        upsert: false,
      }
    )
    // promise chain
    .then((result) => {
      // logs "Marked Complete" to the console
      console.log("Marked Complete");
      // responds with "Marked Complete" as JSON
      response.json("Marked Complete");
    })
    // error handling: logs any error to the console
    .catch((error) => console.error(error));
});

// DELETE request for /deleteItem path
app.delete("/deleteItem", (request, response) => {
  // go to the db, gets the 'todos' collection, finds the value of thing that is itemFromJS and deletes said thing
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS })
    // promise chain
    .then((result) => {
      // log "Todo Deleted" to console
      console.log("Todo Deleted");
      // responds with "Todo Deleted" as JSON
      response.json("Todo Deleted");
    })
    // error handling: logs any error to the console
    .catch((error) => console.error(error));
});

// starts the server and listens to either port 2121 or the port given in the .env file
app.listen(process.env.PORT || PORT, () => {
  // log the port that the server is running on in the console
  console.log(`Server running on port ${PORT}`);
});
