const express = require("express"); //express dependency for ease of running server
const app = express(); // initialises the express app
const MongoClient = require("mongodb").MongoClient; //import  mongo db dependency
const PORT = 2121; // declaration of port
require("dotenv").config(); //enables environment variables to be read
/* uses dotenv to initiliase mongo db uri which will be used */
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo";
/* Connects the application to the mongo DB database */
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);
/* This batch sets the middleware  that the express application uses ,between reciving the req and res */
app.set("view engine", "ejs"); //sets ejs as the views engine, creates templates for server side rendered html
app.use(express.static("public")); // sets the folder that holds the static files. in this case the public folder holds such files as css html and frintend JSuy
app.use(express.urlencoded({ extended: true })); // built in middleware  to  recognise incoming requests objects as strings or arrays
app.use(express.json()); // by default express parses incoming requests with JSON payloads and is based upon the bodyparser.

//app.get handles all the get request on this route at the address specified as the first argument

app.get("/", async (request, response) => {
  // purpose of the call back is to handle the request and response object
  const todoItems = await db.collection("todos").find().toArray(); //queries the database and converts the results to an array
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false }); //countDocuments queries the database and counts documents  with the
  response.render("index.ejs", { items: todoItems, left: itemsLeft }); // sends back the respnse
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
  // handles the post request on the/addTodo route
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem, completed: false }) //insertOne updates the database with one item frim tge response object as specified
    .then((result) => {
      console.log("Todo Added");
      response.redirect("/"); // redirects the user to the home route
    })
    .catch((error) => console.error(error)); //catch block handles all the errors should there be any error in applying any of the above logic
});
//handles  put req on the specified route
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
    ) //updates the database with one file as contained in the req object
    .then((result) => {
      console.log("Marked Complete");
      response.json("Marked Complete"); //send respose to the user tht the request has been fulfilled
    })
    .catch((error) => console.error(error)); // if there is an error it will be handled in the catch block. Prevents the program from crashing
});

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
    ) //updates the database with the given parameter
    .then((result) => {
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    .catch((error) => console.error(error));
});

app.delete("/deleteItem", (request, response) => {
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS }) // queries the database and deletes one item . item deleted is specified in the arguments
    .then((result) => {
      console.log("Todo Deleted");
      response.json("Todo Deleted"); // send response to user
    })
    .catch((error) => console.error(error));
});
/* sets up the server to listen for requests.tkaes the port number as arfuments */
app.listen(process.env.PORT || PORT, () => {
  // env.PoRT allows the PORt to be set by the environment
  console.log(`Server running on port ${PORT}`);
});
