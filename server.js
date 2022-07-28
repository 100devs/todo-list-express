//Assigns requiring Express for the server to the constant variable express
const express = require("express");
//Assigns the express method to the constant variable app
const app = express();
//Assigns requiring MongoDB and the MongoClient method for the server to the constant variable MongoClient
const MongoClient = require("mongodb").MongoClient;
//Assigns port 2121 to the constant variable PORT
const PORT = 2121;
//Requires the dotenv and confit() method for the server
require("dotenv").config();

//Declares three variables to be used throughout and assigns values to two of them
let db,
  //Assigns the database string from the .env file so the database can be accessed via server.js without displaying the username and password to anyone just looking at the code
  dbConnectionStr = process.env.DB_STRING,
  //Assigns "todo" to the database name variable to be used throughout
  dbName = "todo";

//Connects the server to the database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  //Once connected to the server, passes the client parameter into the arrow function to follow
  .then((client) => {
    //Logs to the console a template literal that shows to which database the server has connected
    console.log(`Connected to ${dbName} Database`);
    //Assigns the database name to the db variable declared above to be used below
    db = client.db(dbName);
  });

//Assigns the setting name of the express method to the name "view engine" with the value "ejs", thus allowing Express to use EJS as a static template file
app.set("view engine", "ejs");
//Serves static directory "public" (which contains the CSS and JS files)
app.use(express.static("public"));
//For POST and PUT requests, causes server to recognize the incoming request object as strings or arrays, parsing the data with the qs library
app.use(express.urlencoded({ extended: true }));
//For POST and PUT requests, causes server to recognize the incoming request object as a JSON object
app.use(express.json());

//Defines a route handler for the GET request to the "/" route of the URL; the route handler is an asynchronous function with request and response parameters
app.get("/", async (request, response) => {
  //Declares a constant variable that contains the awaited response,transformed into an array, from the database collection "todos"
  const todoItems = await db.collection("todos").find().toArray();
  //Declares a constant variable that contains the awaited response from the database...
  const itemsLeft = await db
    //...within the "todos" collection...
    .collection("todos")
    //...of a count of the documents whose completed key is set to the value false
    .countDocuments({ completed: false });
  //Renders the response to the index.ejs file with the key/value pairs of the entire todo list and the itemsLeft that are not completed
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

//Defines a route handler for the POST request to the "/addTodo" route of the URL; the route handler is an asynchronous function with request and response parameters
app.post("/addTodo", (request, response) => {
  //Navigates to the "todos" collection of the database...
  db.collection("todos")
    //...and inserts one document with a key of thing and a value from the form in index.ejs named todoItem and a completed status key set to the value false...
    .insertOne({ thing: request.body.todoItem, completed: false })
    //...once the above POST is completed, the result is passed as a parameter
    .then((result) => {
      //Logs to the console "Todo Added" to show that the POST was successful
      console.log("Todo Added");
      //Redirects to the root route "/" URL
      response.redirect("/");
    })
    //If the POST is not successful, logs to the console the error returned from the POST request
    .catch((error) => console.error(error));
});

//Defines a route handler for the PUT request to the "/markComplete" route of the URL; the route handler is an asynchronous function with request and response parameters
app.put("/markComplete", (request, response) => {
  //Navigates to the "todos" collection of the database...
  db.collection("todos")
    //...and updates one document's...
    .updateOne(
      //...key of thing and a value from the list item from which the request was called in the index.ejs file thus named itemFromJS...
      { thing: request.body.itemFromJS },
      {
        //...and sets...
        $set: {
          //...the completed key value to true
          completed: true,
        },
      },
      {
        //Sorts the collection's documents by their private IDs (assigned by the database) in descending order
        sort: { _id: -1 },
        //Update and insert false so that a new document is not created
        upsert: false,
      }
    )
    //Once the above PUT request is completed, passes the result as a parameter
    .then((result) => {
      //Logs to the console "Marked Complete" to show that the PUT was successful
      console.log("Marked Complete");
      //Responds to the server with the response body parsed as JSON
      response.json("Marked Complete");
    })
    //If the above PUT request results in an error, logs to the console the error returned from the PUT request
    .catch((error) => console.error(error));
});

//Defines a route handler for the PUT request to the "/markUnComplete" route of the URL; the route handler is an asynchronous function with request and response parameters
app.put("/markUnComplete", (request, response) => {
  //Navigates to the "todos" collection of the database...
  db.collection("todos")
    //...and updates one document's...
    .updateOne(
      //...key of thing and a value from the list item from which the request was called in the index.ejs file thus named itemFromJS...
      { thing: request.body.itemFromJS },
      {
        //...and sets...
        $set: {
          //...the completed key value to false
          completed: false,
        },
      },
      {
        //Sorts the collection's documents by their private IDs (assigned by the database) in descending order
        sort: { _id: -1 },
        //Update and insert false so that a new document is not created
        upsert: false,
      }
    )
    //Once the above PUT request is completed, passes the result as a parameter
    .then((result) => {
      //Logs to the console "Unmarked Complete" to show that the PUT was successful
      console.log("Unmarked Complete");
      //Responds to the server with the response body parsed as JSON
      response.json("Unmarked Complete");
    })
    //If the above PUT request results in an error, logs to the console the error returned from the PUT request
    .catch((error) => console.error(error));
});

//Defines a route handler for the DELETE request to the "/deleteItem" route of the URL; the route handler is an asynchronous function with request and response parameters
app.delete("/deleteItem", (request, response) => {
  //Navigates to the "todos" collection of the database...
  db.collection("todos")
    //...and deletes one document with a key of thing and a value from the list item from which the request was called in the index.ejs file thus named itemFromJS...
    .deleteOne({ thing: request.body.itemFromJS })
    //...once the above DELETE is completed, the result is passed as a parameter
    .then((result) => {
      //Logs to the console "Todo Deleted" to show that the DELETE was successful
      console.log("Todo Deleted");
      //Responds to the server with the response body parsed as JSON
      response.json("Todo Deleted");
    })
    //If the above DELETE request results in an error, logs to the console the error returned from the DELETE request
    .catch((error) => console.error(error));
});

//Binds and listens the connections on the specified host and port
app.listen(process.env.PORT || PORT, () => {
  //Logs to the console a template literal that the server is running on the specified PORT
  console.log(`Server running on port ${PORT}`);
});
