const express = require("express"); // gives access to express
const app = express(); // instantiates an express app
const MongoClient = require("mongodb").MongoClient; // gives access to MongoClient
const PORT = 2121; // sets the port to 2121
require("dotenv").config(); // gives access to dotenv's config file

let db, //instantiate db variable globally, currently undefined
  dbConnectionStr = process.env.DB_STRING, //instantiantes connection str as value in .env files
  dbName = "todo"; // instantiates dbName as string 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // runs MongoClient's connect method, passing connectionStr as first arg and setting the unifiedtopology flag to true in 2nd arg
  .then((client) => {
    // awaits mongoclient's connect method, then executes a callback function with the client obj passed to it
    console.log(`Connected to ${dbName} Database`); // lets you know mongoDB connected by logging a message
    db = client.db(dbName); // client's db method takes in the name of the db to look for as an argument, searches for a DB of that name, then assigns either the db it finds OR a new db with that name if one isn't found
  });
// all the .use methods are telling express to use a middleware based on the arguments passed to it
app.set("view engine", "ejs"); // sets the "view engine" to ejs -- a tool that renders html with javascript-like syntax. Allows the app to render HTML from ejs
app.use(express.static("public")); // lets express know that the folder to store "static" files in is called 'public'. Static files examples are HTML, JS, CSS. Static as in they aren't changing.
app.use(express.urlencoded({ extended: true })); // tells express to use its urlencoded middleware, allowing it to send HTTP data to the request body such as form methods.
app.use(express.json()); // tells express to use its .json middleware, allowing it to send and receive json-formatted data

//READ
app.get("/", async (request, response) => {
  // sets a GET method on the '/' route. 2nd argument is an asynchronous callback function for what to do on that route
  const todoItems = await db.collection("todos").find().toArray();
  // ^ awaits resolution of methods on the right -- finds collection named "todos"
  // -> .find() makes cursor obj with ALL documents in that collection since no query given
  // -> toArray() loops through those documents and stores them in an array as objs.
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false });
  // countDocuments returns count of the # of documents in the collection
  response.render("index.ejs", { items: todoItems, left: itemsLeft }); // sends two arrays to ejs, one named items and one named left. items contains the todoItems array, left contains the itemsLeft doc count

  // The commented out code below is an example of the same method constructed WITHOUT using async/await syntax.
  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
});
// CREATE
app.post("/addTodo", (request, response) => {
  //runs a post request that can add a new to-do as a document in the collection
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem, completed: false }) //accesses the specified database and collection and uses MongoDB's insertOne method to insert a new document into the todo's collection
    .then((result) => {
      //awaits the addition to the collection
      console.log("Todo Added"); //runs a console.log() to indicate the ToDo has been added
      response.redirect("/"); //redirects page back to the specified url
    })
    .catch((error) => console.error(error)); // errors are caught and console logged
});
//UPDATE
app.put("/markComplete", (request, response) => {
  //runs a put request which will update to-dos in the collection
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        //accesses the specified collection and using MongoDB's updateOne method it will change the properties of the todolist accordingly
        $set: {
          completed: true, //changes the completed property to true once user has specified if todo is completed
        },
      },
      {
        sort: { _id: -1 }, // Sort in descending order by id
        upsert: false, // Update data if there is a matching document, if this is set to true: insert a new document in case there is no document matches the query criteria.
      }
    )
    .then((result) => {
      console.log("Marked Complete"); // logs that a task has been marked complete onto the console
      response.json("Marked Complete"); // sends a json response that task has been completed
    })
    .catch((error) => console.error(error)); // errors are caught and console logged
});

app.put("/markUnComplete", (request, response) => {
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        //accesses the specified database and collection and uses MongoDB's updateOne method to update a document in the todo's collection
        $set: {
          completed: false, //changes the completed property to false once user has specified if todo is not completed
        },
      },
      {
        sort: { _id: -1 }, // Sort in descending order by id
        upsert: false, // Update data if there is a matching document, if this is set to true: insert a new document in case there is no document matches the query criteria.
      }
    )
    .then((result) => {
      console.log("Marked Complete"); // logs that a task has been marked complete onto the console
      response.json("Marked Complete"); // sends a response back to the client in json format of "Marked Complete"
    })
    .catch((error) => console.error(error)); // errors are caught and console logged
});
//DELETE
app.delete("/deleteItem", (request, response) => {
  // runs a delete request to delete a todo item
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS }) //accesses the specified database and collection and uses MongoDB's deleteOne method to delete a new document from the todo's collection
    .then((result) => {
      console.log("Todo Deleted"); // logs the deletion of the todo item onto the console
      response.json("Todo Deleted"); // sends a response back to the client in json format that the todo item has been deleted
    })
    .catch((error) => console.error(error)); // errors are caught and console logged
});

app.listen(process.env.PORT || PORT, () => {
  // listens for a specified port to load the server
  console.log(`Server running on port ${PORT}`); //console logs a response that lets you know the server is running on the specified port
});
