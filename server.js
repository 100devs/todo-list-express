// assign constant variable express the export(s) from express in node_modules
const express = require("express");
// assign constant app what is returned from the express function call.
const app = express();
// assign constant variable MongoClient the export(s) from mongodb.MongoClient
// in node_modules
const MongoClient = require("mongodb").MongoClient;
// assign constant variable PORT the number 2121
const PORT = 2121;
// grab all declarations and assigned strings and make available with
// process.env.variableName calls
require("dotenv").config();

// let variables db be undefined,
// dbConnectionStr be assigned DB_STRING from .env file
// and dbName be assigned string todo
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo";

// connect to the database and have unified topology which returns a promise
// then call the response promise data value, client and console log the
// dbName inside the template literal
// finally set db to new instance of named database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);

// set view engine string to ejs string in application settings table
// if extension is ommitted use ejs
app.set("view engine", "ejs");
// use middleware static with local directory public
// allows routing to public directory and files/directories within
app.use(express.static("public"));
// use middleware urlencoded with extended true
// parses requests with urlencoding, only looks at content-type header matches type
// and accepts only utf-8 encoding of the body, though it automatically inflates
// gzip and deflate encodings
// extended: true allows any type for values of the key value pairs it returns
app.use(express.urlencoded({ extended: true }));
// parsing (translating) application/json middleware
app.use(express.json());

// get the root route and use asnyc callback function
app.get("/", async (request, response) => {
  // grab all documents from collection todos and turn them into an array
  // assign that array to constant variable todoItems after awaiting
  const todoItems = await db.collection("todos").find().toArray();
  // return count of documents in database that have completed property set to false
  //   assign that value to constant variable itemsLeft after awaiting the promise
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false });
  // render index.ejs file and send object literal with array of toDoItems
  // and the number of todos still left to do
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

// create todo and place in database
app.post("/addTodo", (request, response) => {
  // databse collection todos, insert document once, thing to do and set
  // completed to false, then redirect to root route, possibly catch error
  // and console error the error
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem, completed: false })
    .then((result) => {
      console.log("Todo Added");
      response.redirect("/");
    })
    .catch((error) => console.error(error));
});

// update document in database collection todos
app.put("/markComplete", (request, response) => {
  // database collection todos update one document, set completed to true,
  // sort descending and do not create a new document if the searched for
  // one does not exist, then console log the string given and respond with
  // string as json, catch error if error and console error the error
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

// update document in database collection todos
app.put("/markUnComplete", (request, response) => {
  // database collection todos update one document, set completed to false,
  // sort descending and do not create a new document if the searched for
  // one does not exist, then console log the string given and respond with
  // string as json, catch error if error and console error the error
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

// delete document from database collection
app.delete("/deleteItem", (request, response) => {
  // database collection todos delete one document, then console log
  //  the string given and respond with string as json,
  // catch error if error and console error the error
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      console.log("Todo Deleted");
      response.json("Todo Deleted");
    })
    .catch((error) => console.error(error));
});

// listen on port given from env file or from top of this file,
// console log that the server is running on port.
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
