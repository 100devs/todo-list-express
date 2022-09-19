const express = require("express"); // import express
const app = express(); // initialize express app
const MongoClient = require("mongodb").MongoClient; // import mongodb from node_modules and access the MongoClient code
const PORT = 2121; // set the port, this could be changed to whatever
require("dotenv").config(); // configure dotenv code so the express server can read the .env file

let db, // initialize db variable for use in the future
  dbConnectionStr = process.env.DB_STRING, // putting the database access string thingy into a variable
  dbName = "todo"; // naming the database "todo"

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  // method used to connect to Mongo Atlas
  (client) => {
    console.log(`Connected to ${dbName} Database`); // gives the server feedback that the database is connected
    db = client.db(dbName); // sets db to the database for use in the app routes
  }
);

app.set("view engine", "ejs"); // set the view engine in express to render HTML
app.use(express.static("public")); // tells express where any static files will be located, here it will be in the public directory
app.use(express.urlencoded({ extended: true })); // allows express to read the data sent over an HTTP request using a form
app.use(express.json()); // lets express read the body of HTTP requests when "content-type" is "application/json", that data will be stored in req.body

app.get("/", async (request, response) => {
  // tells express to listen for a get request on the root route
  const todoItems = await db.collection("todos").find().toArray(); // access the db collection "todos", finds every document, and turns that into an array
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false }); // count the amount of "todos" documents that have the attribute completed as "false"
  response.render("index.ejs", { items: todoItems, left: itemsLeft }); // takes the list of "todos" documents and the count of incomplete documents and sends that data to EJS to render HTML
});

app.post("/addTodo", (request, response) => {
  // tell express to listen for a post request on the "/addTodo" route
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem, completed: false }) // read the request body for the thing and add it to the db
    .then((result) => {
      // after the item has been added to the db do these things
      console.log("Todo Added"); // print "Todo Added" to the console to let the server visually see that something has been added
      response.redirect("/"); // redirect the client to the home page so they can see the new item
    })
    .catch((error) => console.error(error)); // catch any error and print them to the console
});

app.put("/markComplete", (request, response) => {
  // express looks for a HTTP put request on the "/markComplete" route
  db.collection("todos") // look in the todos collection
    .updateOne(
      // update only one item from the database
      { thing: request.body.itemFromJS }, // specify to update the document with the "thing" property of the value in the request body
      {
        $set: {
          // specify which property you are updating
          completed: true, // change the completed value to "true"
        },
      },
      {
        sort: { _id: -1 }, // sort the items by id in descending order
        upsert: false, // if no document is found to update, create one instead
      }
    )
    .then((result) => {
      console.log("Marked Complete"); // print to console to visually confirm the server added a document
      response.json("Marked Complete"); // send a response to the client so they know it was a successful update
    })
    .catch((error) => console.error(error)); // print errors to the console
});

app.put("/markUnComplete", (request, response) => {
  // listen for an HTTP put request on the "/markUnComplete" route
  db.collection("todos") // look in the "todos" collection
    .updateOne(
      // update one document in the database
      { thing: request.body.itemFromJS }, // specify the document we are looking for, in this case the one with the "thing" property included in the request body
      {
        $set: {
          // set the following properties in the document being searched for
          completed: false, // set the completed property to false
        },
      },
      {
        sort: { _id: -1 }, // sort the items by id in descending order
        upsert: false, // do not create a new item if on is not found in the database
      }
    )
    .then((result) => {
      console.log("Marked Complete"); // print to the console to visually confirm that the item was updated
      response.json("Marked Complete"); // respond to the request to let the client know that the item was updated
    })
    .catch((error) => console.error(error)); // print any errors to the console
});

app.delete("/deleteItem", (request, response) => {
  // listen for HTTP delete requests on the "/deleteItem" route
  db.collection("todos") // look in the "todos" collection
    .deleteOne({ thing: request.body.itemFromJS }) // delete one document that has the thing attribute that is provided in the body of the request
    .then((result) => {
      console.log("Todo Deleted"); // print to console to visually confirm the code ran
      response.json("Todo Deleted"); // respond to the client so they know that the item was deleted
    })
    .catch((error) => console.error(error)); // print any errors to the console
});

app.listen(process.env.PORT || PORT, () => {
  // start the server and tell it to listen on the port provided in .env or the default at the top of the program
  console.log(`Server running on port ${PORT}`); // print to console to visually confirm that the server is running
});
