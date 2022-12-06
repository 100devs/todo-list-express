/* Loading the express module. */
const express = require("express");
/* Creating an instance of the express module. */
const app = express();
/* Loading the MongoClient class from the mongodb module. */
const MongoClient = require("mongodb").MongoClient;
const PORT = 2121;
/* Loading the environment variables from the .env file. */
require("dotenv").config();

let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo";
// console.log(dbConnectionStr) // This is the connection string for the database. It is stored in the .env file. It is not visible to the public. It is only visible to the server. It is not visible to the client. It is not visible to the user.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    /* Logging "Connected to todo Database" to the console and setting the db variable to the
  todo database. */
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);

/* Telling the server to use the ejs templating engine. */
app.set("view engine", "ejs");
/* Telling the server to use the public folder. */
app.use(express.static("public"));
/* Telling the server to use the express.urlencoded() middleware function. */
app.use(express.urlencoded({ extended: true }));
/* Telling the server to use the express.json() middleware function. */
app.use(express.json());

/* Telling the server to listen for a request from the client. on starting route / */
app.get("/", async (request, response) => {
  /* Finding all the documents in the todos collection and converting them to an array. */
  const todoItems = await db.collection("todos").find().toArray();
  /* Counting the number of documents in the todos collection that have the completed property set to
  false. */
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

/* Listening for a request from the client. It is listening for a request from the client on the route
/addTodo. */
app.post("/addTodo", (request, response) => {
  /* Accessing the todos collection in the database. */
  db.collection("todos")
    /* Inserting a document into the todos collection. The document has two properties. The first
    property is thing. The second property is completed. The thing property is set to the value of
    the todoItem property of the request.body object. The completed property is set to false. */
    .insertOne({ thing: request.body.todoItem, completed: false })
    .then((result) => {
      console.log("Todo Added");
      /* Redirecting the client to the starting route. */
      response.redirect("/");
    })
    /* Catching any errors that occur and logging them to the console. */
    .catch((error) => console.error(error));
});

/* Listening for a request from the client on the route /markComplete. */
app.put("/markComplete", (request, response) => {
  /* Accessing the todos collection in the database. */
  db.collection("todos")
    /* Updating the document in the todos collection that has the thing property set to the value of the
   itemFromJS property of the request.body object. It is setting the completed property of the
   document to true. It is sorting the documents in the todos collection in descending order by the
   _id property. It is not inserting a new document if the document does not exist. */
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
    /* Logging "Marked Complete" to the console and sending a response to the client. The response is a
    JSON object. The JSON object has a property called message. The message property is set to
    "Marked Complete". */
    .then((result) => {
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    .catch((error) => console.error(error));
});

/* Listening for a request from the client on the route /markUnComplete. It is accessing the todos
collection in the database. It is updating the document in the todos collection that has the thing
property set to the value of the itemFromJS property of the request.body object. It is setting the
completed property of the document to false. It is sorting the documents in the todos collection in
descending order by the _id property. It is not inserting a new document if the document does not
exist. It is logging "Marked Complete" to the console and sending a response to the client. The
response is a JSON object. The JSON object has a property called message. The message property is
set to "Marked Complete". */
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

/* Listening for a request from the client on the route /deleteItem. It is accessing the todos
collection in the database. It is deleting the document in the todos collection that has the thing
property set to the value of the itemFromJS property of the request.body object. It is logging "Todo
Deleted" to the console and sending a response to the client. The response is a JSON object. The
JSON object has a property called message. The message property is set to "Todo Deleted". */
app.delete("/deleteItem", (request, response) => {
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      console.log("Todo Deleted");
      response.json("Todo Deleted");
    })
    .catch((error) => console.error(error));
});

/* Telling the server to listen for a request from the client on the port specified by the
PORT variable. If the PORT variable is not defined, it is telling the server to listen for a request

from the client on the port specified by the PORT environment variable. */
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
