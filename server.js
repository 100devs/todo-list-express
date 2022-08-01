const express = require("express"); //Making express available to use in this file
const app = express(); //Setting a constant and assigning it to the instance of express
const MongoClient = require("mongodb").MongoClient; //Allows us to use methods associated with MongoClient and talk to our DB
const PORT = 2121; //Assigning a constant to determine the location where out server will be listening
require("dotenv").config(); //Allows us to look for variables inside the .env file

let db, //Declaring variable without assignment
  dbConnectionStr = process.env.DB_STRING, //Declaring variable and assigning it to DB_STRING variable in .env file
  dbName = "todo"; //Declaring variable and assigning our database name to i

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  //Creating a connection to MongoDB, and passing in out connection string. Also passing in an additional property
  .then((client) => {
    //Waiting for connection and proceeding if successful
    console.log(`Connected to ${dbName} Database`); //Logging message to console if connection is successful
    db = client.db(dbName); //Assigning database name to db variable
  }); //Closing our then

//Middleware
app.set("view engine", "ejs"); //Sets ejs as the default render
app.use(express.static("public")); //Sets the location for static assets
app.use(express.urlencoded({ extended: true })); //Tells express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json()); //Parses JSON content from incoming requests

app.get("/", async (request, response) => {
  //Starts a GET method when the root route is passed in, sets up req and res parameters
  const todoItems = await db.collection("todos").find().toArray(); //Sets a variable and awaits all items from the todos collection
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false }); //Sets a variable and assigns the number of uncompleted items to later display in ejs
  response.render("index.ejs", { items: todoItems, left: itemsLeft }); //Rendering ejs files and passing through the db items and the count of remaining uncompleted items

  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
});

app.post("/addTodo", (request, response) => {
  //Starts a POST method when the addTodo route is passed in (from the form in ejs), sets up req and res parameters
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem, completed: false }) //Inserts a new item into todos collection, the content of the form input is assigned to thing and setting completed to false as the default
    .then((result) => {
      //If insert is successful execute this block
      console.log("Todo Added"); //Logging to the console
      response.redirect("/"); //Redirecting to root route
    }) //Closing the then block
    .catch((error) => console.error(error)); //Catching errors
}); //Ending the POST

app.put("/markComplete", (request, response) => {
  //Starts a PUT method when the markComplete route is passed in, sets up req and res parameters
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS }, //Looks in the database for one item matching the name from the main.js file that was clicked on
      {
        $set: {
          completed: true, //Setting the completed status to true
        },
      },
      {
        sort: { _id: -1 }, //Sorts in descending order
        upsert: false, //Prevents insertion if item does not already exist
      }
    )
    .then((result) => {
      //Starting a then block if update was successful
      console.log("Marked Complete"); //Logging to console
      response.json("Marked Complete"); //Main.js is awaiting this response
    }) //Closing then block
    .catch((error) => console.error(error)); //Catching errors
}); //Ending the PUT

app.put("/markUnComplete", (request, response) => {
  //Starts a PUT method when the markUnComplete route is passed in, sets up req and res parameters
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS }, //Looks in the database for one item matching the name from the main.js file that was clicked on
      {
        $set: {
          completed: false, //Setting the completed status to true
        },
      },
      {
        sort: { _id: -1 }, //Sorts in descending order
        upsert: false, //Prevents insertion if item does not already exist
      }
    )
    .then((result) => {
      //Starting a then block if update was successful
      console.log("Marked Complete"); //Logging to console
      response.json("Marked Complete"); //Main.js is awaiting this response
    }) //Closing then block
    .catch((error) => console.error(error)); //Catching errors
}); //Ending the PUT

app.delete("/deleteItem", (request, response) => {
  //Starts a DELETE method when the deleteItem route is passed in, sets up req and res parameters
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS }) //Looks in the database for one item matching the name from the main.js file that was clicked on
    .then((result) => {
      //Starting a then block if delete was successful
      console.log("Todo Deleted"); //Logging to console
      response.json("Todo Deleted"); //Main.js is awaiting this response
    }) //Closing then block
    .catch((error) => console.error(error)); //Catching errors
}); //Ending the DELETE

app.listen(process.env.PORT || PORT, () => {
  //Setting up which port we will be listening on, either the port from the env file or the port variable we set
  console.log(`Server running on port ${PORT}`); //Logging to console
}); //Ending the listen
