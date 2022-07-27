const express = require("express"); //requiring express
const app = express(); //saving the returning value from express function in the "app" variable
const MongoClient = require("mongodb").MongoClient; //create a new MongoClient instance

const PORT = 4242; //set the PORT variable to 4242
require("dotenv").config(); //using dotenv let you use environment variables as global variables, config() inicializes the process

let db, //declared db variable
  dbConnectionStr = process.env.DB_STRING, //declared and assigned dbConnectionStr to the .env DB_STRING variable
  dbName = "todo"; //declared and assigned dbName variable as 'todo'

MongoClient.connect(
  dbConnectionStr /* passing DB_STRING as arg */,
  {
    useUnifiedTopology: true,
  } /* The goal of the unified topology is threefold: - fully support the drivers Server Discovery and Monitoring,
 Server Selection and Max Staleness specifications - reduce the maintenance burden of supporting the topology layer in the driver
  by modeling all supported topology types with a single engine - remove confusing functionality which could be potentially dangerous
   for our users */
).then(
  /* async function executed after connecting to the server */
  (client) /* promise returned from MongoClient.connect */ => {
    console.log(`Connected to ${dbName} Database`); //log the dbName to the console
    db = client.db(dbName); //assigning the db interface to "db" variable
  }
);

app.set("view engine", "ejs"); //setting a variable "view engine" to value "ejs"
app.use(express.static("public")); //apply static middleware
app.use(express.urlencoded({ extended: true })); //apply urlencoded middleware
app.use(express.json()); //apply json middleware

app.get("/", async (request, response) => {
  /* function that is executed when the path "/" is requested */
  const todoItems = await db
    .collection("todos") /* access collection "todos" inside db  "todo" */
    .find() /* the find method without passing any arguments returns everything inside the "todos" collection */
    .toArray(); /* create an of objects from the todos documents */

  const itemsLeft = await db
    .collection("todos") /* access collection "todos" inside db  "todo" */
    .countDocuments({
      completed: false,
    }); /* filters all documents that matches the argument passed 
    and returns a number representing the count of documents matching it */
  response.render("index.ejs", {
    items: todoItems,
    left: itemsLeft,
  }); /* transforms the index.ejs 
    and the object passed as the 2nd argument in a .html file and send it as a response to the client */

  //   db.collection("todos")
  //     .find()
  //     .toArray()
  //     .then((data) => {
  //       db.collection("todos")
  //         .countDocuments({ completed: false })
  //         .then((itemsLeft) => {
  //           response.render("index.ejs", { items: data, left: itemsLeft });
  //         });
  //     })
  //     .catch((error) => console.error(error));
});

app.post(
  "/addTodo",
  (
    request,
    response
  ) /* do a POST request when the user access the path "/addTodo" */ => {
    db.collection("todos") /* access collection "todos" inside db  "todo" */
      .insertOne({
        thing: request.body.todoItem,
        completed: false,
      }) /* add one item in the database */
      .then((result) => {
        console.log("Todo Added"); //when the promise is fulfilled, log "Todo Added" to the console
        response.redirect("/"); //redirect the user to the home page
      })
      .catch((error) => console.error(error)); // logs the error if the promise is rejected
  }
);

app.put("/markComplete", (request, response) => {
  /* do a PUT request when the user access the path "/addTodo" */
  db.collection("todos") /* access collection "todos" inside db  "todo" */
    .updateOne(
      {
        thing: request.body.itemFromJS,
      } /* find the first document that matches "request.body.itemFromJS" */,
      {
        $set: {
          completed: true, //change completed property from "false" to "true"
        },
      },
      {
        sort: { _id: -1 } /* If more than one matching document is returned, 
        sort them in descending order by _id (so that we update only the one with the lower _id value) */,
        upsert: false, // Doesn't create a new document if the query doesn't find a matching document
      }
    )
    .then((result) => {
      console.log("Marked Complete"); //when the promise is fulfilled, log "Marked Complete" to the console
      response.json("Marked Complete"); //send a string "Marked Complete" as a response to the client
    })
    .catch((error) => console.error(error)); // logs the error if the promise is rejected
});

app.put("/markUnComplete", (request, response) => {
  db.collection("todos") /* access collection "todos" inside db  "todo" */
    .updateOne(
      {
        thing: request.body.itemFromJS,
      } /* find the first document that matches "request.body.itemFromJS" */,
      {
        $set: {
          completed: false, //change completed property from "true" to "false"
        },
      },
      {
        sort: { _id: -1 } /* If more than one matching document is returned, 
        sort them in descending order by _id (so that we update only the one with the lower _id value) */,
        upsert: false, // Doesn't create a new document if the query doesn't find a matching document
      }
    )
    .then((result) => {
      console.log("Marked Complete"); //when the promise is fulfilled, log "Marked Complete" to the console
      response.json("Marked Complete"); //send a string "Marked Complete" as a response to the client
    })
    .catch((error) => console.error(error)); // logs the error if the promise is rejected
});

app.delete("/deleteItem", (request, response) => {
  db.collection("todos") /* access collection "todos" inside db  "todo" */
    .deleteOne({
      thing: request.body.itemFromJS,
    }) /* find the first document that matches "request.body.itemFromJS" */
    .then((result) => {
      console.log("Todo Deleted"); //when the promise is fulfilled, log "Todo Deleted" to the console
      response.json("Todo Deleted"); //send a string "Todo Deleted" as a response to the client
    })
    .catch((error) => console.error(error)); // logs the error if the promise is rejected
});

app.listen(process.env.PORT || PORT, () => {
  //set the port that the server will listen, either to the standard port(E.g. defined by Heroku) or the port set in the variable PORT
  console.log(`Server running on port ${PORT}`); // logs "Server running on port 4242"
});
