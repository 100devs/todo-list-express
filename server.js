//Requiring express in this file
const express = require("express");
//Assigning express to a constant variable
const app = express();
//Makes it possible to use methods associated with MongoClient and talk to our DB
const MongoClient = require("mongodb").MongoClient;
//Declaring a constant variable that defines the location where the server will be listening
const PORT = 2121;
//Allows us to look for variables inside of the .env file
require("dotenv").config();

//Declare a variable called db but not assign a value
let db,
  //Declaring a variable and assigning our database connection string to it
  dbConnectionStr = process.env.DB_STRING,
  //declaring a variable and assigning the name of the database we will be using
  dbName = "todo";

//Creating a connection to MongoDB, and passing in our connection string. Also passing in an addition property
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  //Waiting for the connection and proceeding if successful. Also passing in all of the client information
  .then((client) => {
    //Log to the console success message
    console.log(`Connected to ${dbName} Database`);
    //Assigning a value to a previously declared "db" variable that contains db client factory method
    db = client.db(dbName);
    //Closing our .then
  });

//Middleware

//Sets EJS as the default render method
app.set("view engine", "ejs");
//Sets the location for static assets
app.use(express.static("public"));
//Tells express to decode and encode URL's where the header matches the content. Supports Arrays and Objects
app.use(express.urlencoded({ extended: true }));
//Parses JSON content
app.use(express.json());

//Starts a GET method when the rout route is passed in, sets up req and res parameters
app.get("/", async (request, response) => {
  //Sets a variable and awaits ALL items from the todos collection
  const todoItems = await db.collection("todos").find().toArray();
  //Sets a variable and awaits a count of uncompleted items that will later be displayed in EJS
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false });
  //Rendering the EJS file and passing through the DB items and the remaining count inside of an object
  response.render("index.ejs", { items: todoItems, left: itemsLeft });
  // db.collection("todos")
  //   .find()
  //   .toArray()
  //   .then((data) => {
  //     db.collection("todos")
  //       .countDocuments({ completed: false })
  //       .then((itemsLeft) => {
  //         response.render("index.ejs", { items: data, left: itemsLeft });
  //       });
  //   })
  //   .catch((error) => console.error(error));
});

//Starts a POST method when the add route is passed in
app.post("/addTodo", (request, response) => {
  //Inserts a new item into the todos collection and gives it a completed value of false by default
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem, completed: false })
    //If insert is successful, do something
    .then((result) => {
      //Console log action
      console.log("Todo Added");
      //Redirects to the homepage
      response.redirect("/");
    })
    //Catching errors
    .catch((error) => console.error(error));
  //Ending the POST
});

//Starts a PUT method when the markComplete route is passed in
app.put("/markComplete", (request, response) => {
  //Look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          //Set completed status to true
          completed: true,
        },
      },
      {
        //Moves item to the bottom of the list
        sort: { _id: -1 },
        //Prevents insertion if the item does not already exist
        upsert: false,
      }
    )
    //Starts a then if update was successful
    .then((result) => {
      //Logging successful completion
      console.log("Marked Complete");
      //Sending a response back to the sender
      response.json("Marked Complete");
      //Closing then
    })
    //Catching errors
    .catch((error) => console.error(error));
  //Ending put
});

//Starts a PUT method when the markUnComplete route is passed in
app.put("/markUnComplete", (request, response) => {
  //Look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          //Set completed status to false
          completed: false,
        },
      },
      {
        //Moving item to the bottom of the list
        sort: { _id: -1 },
        //Preventing insertion if the item does not already exist
        upsert: false,
      }
    )
    //Starts a then if update was successful
    .then((result) => {
      //Logging successful completion
      console.log("Marked Complete");
      //Sending a response back to the sender
      response.json("Marked Complete");
      //Closing then
    })
    //Catching errors
    .catch((error) => console.error(error));
  //Ending put
});

//Starts a delete method when the delete route is passed
app.delete("/deleteItem", (request, response) => {
  //Looking inside the todos collection for the ONE item that has a matching name for our JS file
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS })
    //Starts a then if the delete was successful
    .then((result) => {
      //Logging successful completion
      console.log("Todo Deleted");
      //Sending a response back to the sender
      response.json("Todo Deleted");
      //Closing then
    })
    //Catching errors
    .catch((error) => console.error(error));
  //Ending delete
});

//Setting up which port should we be listening on. Uses either the port from the .env file or uses the one from the PORT variable
app.listen(process.env.PORT || PORT, () => {
  //Logging the running port
  console.log(`Server running on port ${PORT}`);
  //Ending listen
});
