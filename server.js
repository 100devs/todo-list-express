// import modules

const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const PORT = 2121;

// environment variable .env file

require("dotenv").config();

// Database connection from .env file

let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo";

// connect to the Database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);

// express app

app.set("view engine", "ejs"); // using ejs as a view engine
app.use(express.static("public")); //css and client side js in 'public' folder
app.use(express.urlencoded({ extended: true })); // parsing array and object from the body
app.use(express.json()); //parsing json files

// the GET (READ) request to te root route

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

// the POST (CREATE) request to add todo items

app.post("/addTodo", (request, response) => {
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem, completed: false })
    .then((result) => {
      // console logging the task that has been added
      console.log("Todo Added");
      // Refresh the ejs to the root route
      response.redirect("/");
    })
    .catch((error) => console.error(error));
});

// the PUT (UPDATE) request to mark the task as completed

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

// the PUT (update) request to mark as uncompleted  tasks

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

// the DELETE (DEELAYTAY) request to delete tasks

app.delete("/deleteItem", (request, response) => {
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      console.log("Todo Deleted");
      response.json("Todo Deleted");
    })
    .catch((error) => console.error(error));
});

// starting the server

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
