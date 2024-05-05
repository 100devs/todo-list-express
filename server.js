// pulling all our dependcies and declairing a port
// This is used to import express from module to application. Require is part of node.js that allows you to import modules. In this case express modules
const express = require("express");
// defining the app variable to the function call to Express module
const app = express();
// imports the monogodb client objectfrom the mongodb client allowing you to connect to MOngodb database. require imports the mongo db module and provides functionality needed to interact with mongodb databases
const MongoClient = require("mongodb").MongoClient;
// declare port for listening. in this case  port 2121
const PORT = 2121;
// this imports the .env module. this is a zero dependency module( doesnt need external libraries or frameworks to function) that loads the enviroment variable from .env into process.env for managing configuration settings and secrets like API That you dont want in the source code
require("dotenv").config();

// let declares db but can be defined later. dbConnectionStr is a declared variable and assigned to the .env and holds a connection string to a database. The string includes the database type, host, port, database name, and authentication details.
let db,
  dbConnectionStr = process.env.DB_STRING,
  // It assigns to the string value todo that the app will interact with to dbname
  dbName = "todo";
//connects MongoDB database and takes 2 arguments. dbConnectionStr - is the connetion string(defined earlier has MongoDB servers address, database name and possibly auth details) { useUnifiedTopology: true } is becoming outdated replace with {useNewUrlParser: true} it doesnt directly replace it but recommended for connection setup
// .then this uses a promise to handle async connection process once connection happens the callback(.then())is exucuted. CLient parameter represents connection client which interacts with the database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  .then(client => {
    //this line logs indicating that the connection has been established successfully
    console.log(`Connected to ${dbName} Database`);
    //is a method used to get a reference to the databse. it can then be used preform operations on the database such as querying collections or inserting documents
    db = client.db(dbName);
  })
  .catch(error => console.error(error));

// set up middleware template engine
// sets view engine (combining fixed HTML with dynamic data.  displaying dynamic data on web pages by allowing you to embed variables, conditions, loops, and other logic directly within your HTML templates. ) ejs
// Express will look for an EJS file with the corresponding name in the views directory and render it as HTML.
app.set("view engine", "ejs");
// Express to serve static files from a directory named public
app.use(express.static("public"));
//part of Express's built-in middleware. extended: true - allows for objects and arrays to be encoded into URL-encoded format for a JSON-like experience
app.use(express.urlencoded({ extended: true }));
// another middleware(handles everything between request and response) Handles the JSONdata sent to the body of POST requests (found in RESTFul API and AJAX)
app.use(express.json());

// defines route handler for Express.js for HTTP GET requests made to the root URL(/) of app
// app.get -allows you to define how your app responds to different typs of http requests (crud) to specific URLs
// where root handler is defined (located at the end of URl)
// async function  serves as a callback for route handler takes 2 params
// request - HTTP request. It contains information about the request, such as headers, query parameters, and the body of the request.
// response - formulate the HTTP response that will be sent back to the client. You can use methods on this object to send data back to the client,
app.get("/", async (request, response) => {
  // this retrieves all docs from "to-dos" collection and stores them in array
  // db.collection("todos")- this acceses collections within the database (mongodb, node.js)
  // .find() - create a query that will retrieve documents from collections(without any arguments, find() retrieves all documents in the collection.)
  // .toArray() - converts the results of the query(which is a cursor- meaning enables traveresal over records in database) into an array
  try {
    const todoItems = await db.collection("todos").find().toArray();
    // db.collection - accesses the 'to-do' collection in database
    const itemsLeft = await db
      .collection("todos")
      //called on 'to-dos' collection to count the docs that matcha specified filter. The filter { completed: false } specifies that only documents where the completed field is false should be counted.
      .countDocuments({ completed: false });

    // renders a view and sends the rendered html string to client.
    // index.ejs - is the template file you are rendering
    // object that contains local variable for the view.
    //{ items: todoItems, left: itemsLeft }: This is an object that contains the local variables for the view.
    // items - contains array of items and assigned value of todoItems
    // left- contains number of todo items that are not completed obtained from completed:false collection
    response.render("index.ejs", { items: todoItems, left: itemsLeft });
  } catch (err) {
    console.error(err);
    response.status(500).send({ error: "Something failed!" });
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error
  }
});

// makes a post api request to addOne entry
// app.post - defines the route handler for HTT post requests. the callback function(request, response)and response is executed
// db.collection- named in the case todo is accessed
app.post("/addTodo", (request, response) => {
  db.collection("todos")
    //  insertOne - this inserts a new document to the collection
    //  thing- is coming from the http request and came from the body
    // completed: false - tells whether it has been completed or not false means the todo item is not completed
    .insertOne({ thing: request.body.todoItem, completed: false })
    // .then-a promise/callback that logs "todo Added"
    .then(result => {
      console.log("Todo Added");
      //redirect the user to / (home)
      response.redirect("/");
    });
  //  if the promise is rejected  because an error occured during operation returns an error
});

//this starts the route handler put to update aspefic document in mongo db
//marking the item on the todo list complete
app.put("/markComplete", (request, response) => {
  //connect to data base
  db.collection("todos")
    .updateOne(
      //set item specified in request body to complete with the specified options
      { thing: request.body.itemFromJS },
      {
        // onbjct form for mongo db syntax. Marking the item as completed
        $set: {
          completed: true,
        },
      },
      {
        //sorting the id from last to first (determine if needed sort)
        sort: { _id: -1 },
        // if the document is does not exist dont create one because of it being false
        upsert: false,
      }
    )
    .then(result => {
      //going to mark as todoitem as complete. log and respond to the client side server
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    // if result doesnt happen correctly we throw an error
    .catch(error => console.error(error));
});
//makes an update to the server to mark something incomplete
app.put("/markUnComplete", (request, response) => {
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
    .then(result => {
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    .catch(error => console.error(error));
});
//make a request to delete an item from data base
app.delete("/deleteItem", (request, response) => {
  //connect to the database and delete first item found that matches thing specified in json request body
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS })
    .then(result => {
      //send back to make sure app is complete
      console.log("Todo Deleted");
      response.json("Todo Deleted");
    })
    .catch(error => console.error(error));
});
//listen to server
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
