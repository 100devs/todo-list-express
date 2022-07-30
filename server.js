// import express library package the we already install it through npm
const express = require("express");
// fire the express ability and put it in the app variable
const app = express();
// import MongoClient class from mongodb library package that we already install it through npm
const MongoClient = require("mongodb").MongoClient;
// spedify the port which we cann access (listen) our server through
const PORT = 2121;
// import dotenv package specifically config method which we could use it to introduce .env file to the server then we could read the .env file here
require("dotenv").config();

// declare variables
let db,// make db variable globally available so we could use anywhere in the server the db will take values after the connection established to the mongodb database
  dbConnectionStr = process.env.DB_STRING, // set the dbConnectionStr value to the value of the .env secret connection string 'DB_STRING'
  dbName = "todo"; // set the name of the database that we will connect to 


// establish a connection to the database with the connection string and with options {useUnifiedTopology: true} the connection will take time so we will receive a promise solved with then functionality
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  // after connection we will receive the client as a result of the connection
  (client) => {
    // show info that we can connect to the db
    console.log(`Connected to ${dbName} Database`);
    // update the previouse declared variable 'db' to hole the database functionality available through mongodb to our db 'todo'
    db = client.db(dbName);
  }
);


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
  console.log("*****", request.body.itemFromJS, "*****");
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
