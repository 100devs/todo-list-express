//Workaround for running in Glitch.com terminal 

// var util= require('util');
// var encoder = new util.TextEncoder('utf-8');
"use strict";
const util = require("util");
global.TextEncoder = util.TextEncoder;
global.TextDecoder = util.TextDecoder;

//==== END OF WORKAROUND CODE ====

const express = require("express"); //Setting requirements => Express.js
const app = express(); //Giving Express.js a variable for easier handling (later on)
const MongoClient = require("mongodb").MongoClient; //Setting requirements => MongoDB
const PORT = 2121; //Setting Variable PORT to 2121
require("dotenv").config(); //Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env

//Initial Setup for Mongo DB? -> See MongoDB setup guide
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo";

//Wait for MongoDB connection,
//After successful connection => Log "Database connected" to console output
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);

//...
app.set("view engine", "ejs"); //tell Express to use EJS template engine
app.use(express.static("public")); //to serve statis files in a directory named public)(using the css and js files)
app.use(express.urlencoded({ extended: true })); // express.urlencoded() is a buil-in middleware to regconize incoming request object as strings or arrays
app.use(express.json()); //express.json() is a built-in method to recognize incoming request object as a json object

//
app.get("/", async (request, response) => {
  const todoItems = await db.collection("todos").find().toArray();
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false });
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

app.post("/addTodo", (request, response) => {
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem, completed: false })
    .then((result) => {
      console.log("Todo Added");
      response.redirect("/");
    })
    .catch((error) => console.error(error));
});

app.put("/markComplete", (request, response) => {
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: true,
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      }
    )
    .then((result) => {
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    .catch((error) => console.error(error));
});

//...

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
    .then((result) => {
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    .catch((error) => console.error(error));
});

app.delete("/deleteItem", (request, response) => {
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      console.log("Todo Deleted");
      response.json("Todo Deleted");
    })
    .catch((error) => console.error(error));
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
