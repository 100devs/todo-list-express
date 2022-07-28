const express = require("express"); //making it possible to use express in this file and putting it into a variable
const app = express(); //setting a constant and assigning it to the instance of express
const MongoClient = require("mongodb").MongoClient; //makes it possible to use methods associated with MongoClient and talk to our DB.  MongoClient is just a Nodejs library that handles connecting to and interacting with a MongoDB database.
const PORT = 2121; //setting a constant to determine the location where our server will be listening
require("dotenv").config(); //allows use to look for variables inside of the .env file

let db, // declare a variable called db but not assign a value
  dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our database connection string to it
  dbName = "todo"; //declaring a variable and assigning the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Creating a connection to MongoDB, and passing in our connection string. Also passing in an additional property
  .then((client) => {
    //waiting for the connection (a promise) and proceeding if successful, and passing in all the client information
    console.log(`Connected to ${dbName} Database`); //log to the console a template literal "connected to todo Database"
    db = client.db(dbName); //assigning a value to previously declared db variable that contains a db client factory method
  }); //closing our .then

//middleware - software that acts as a bridge between an operating system or database and client side.
app.set("view engine", "ejs"); //sets ejs as the default render method
app.use(express.static("public")); //sets the location for static assets (things that don't change)
app.use(express.urlencoded({ extended: true })); //Tells express to decode and encode URLs where header matches the content.  Supports arrays and objects
app.use(express.json()); //Parses JSON content, which is the process of converting a JSON object in text format to a Javascript object that can be used inside a program, from incoming requests. Used to be done by the method JSON. parse() but its now outdated and express made it easier for us.

app.get("/", async (request, response) => {
  //starts a GET (READ) method when the root route is passed in, sets up request(req) and response(res) parameters
  const todoItems = await db.collection("todos").find().toArray(); //sets a variable and awaits ALL items from the todo collection
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false }); //sets a variable and awaits a count of uncompleted items to later display in EJS
  response.render("index.ejs", { items: todoItems, left: itemsLeft }); //rendering the EJS file and passing through the db items and the count remaining inside of an object to put it directly into the EJS file

  //The BELOW CODE is the same as the ABOVE CODE except it is written in the classic promise verison:

  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
}); //Closing get method

app.post("/addTodo", (request, response) => {
  //starts a POST(CREATE) method when the addTodo route is passed in through clicking submit on our form in our client side
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem, completed: false }) //inserts a new item into todos collection, thing is set to the text taken from the input box with the name of todoItem in the client side and gives it a completed value of false by default
    .then((result) => {
      //if insert is successful, do something
      console.log("Todo Added"); //console log action
      response.redirect("/"); //get rid of the /addTodo route, and redirects back to the homepage
    }) //closing the .then
    .catch((error) => console.error(error)); //catching errors
}); //ending the POST

app.put("/markComplete", (request, response) => {
  //starts a PUT(UPDATE) method when the markComplete route is passed in
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
          // setting something
          completed: true, //set completed status to true
        }, //closing the set
      },
      {
        sort: { _id: -1 }, //moves item to the bottom of the list
        upsert: false, //prevents insertion if item does not already exist
      }
    )
    .then((result) => {
      //starts a then if update was successful
      console.log("Marked Complete"); //logging successful completion
      response.json("Marked Complete"); //Sending a response back to the sender
    }) //closing .then
    .catch((error) => console.error(error)); //catching errors
}); //ending the PUT method

app.put("/markUnComplete", (request, response) => {
  //starts a PUT(UPDATE) method when the markUnComplete route is passed in
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS }, //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
      {
        $set: {
          // setting something
          completed: false, //set completed status to false
        }, //closing the set
      },
      {
        sort: { _id: -1 }, //moves item to the bottom of the list
        upsert: false, //prevents insertion if item does not already exist
      }
    )
    .then((result) => {
      //starts a then if update was successful
      console.log("Marked Complete"); //logging successful completion
      response.json("Marked Complete"); //Sending a response back to the sender
    }) //closing .then
    .catch((error) => console.error(error)); //catching errors
}); //ending the PUT method

app.delete("/deleteItem", (request, response) => {
  //starts a DELETE method when the delete route is passed
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS }) //look inside the todos collection for the ONE item that has a matching name from our JS file
    .then((result) => {
      //starts a then if delete was successful
      console.log("Todo Deleted"); //logging successful deletion
      response.json("Todo Deleted"); //sending a response back to the sender
    }) //closing .then
    .catch((error) => console.error(error)); //catching errors
}); //ending DELETE method

app.listen(process.env.PORT || PORT, () => {
  //setting up which port we will be listening on - either the PORT from the .env file or the PORT variable we set
  console.log(`Server running on port ${PORT}`); //console.log the running port using template literals to say "Server running on port ${PORT}"
}); //end the listen method
