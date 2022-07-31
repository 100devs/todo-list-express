//Server / dependencies set up
const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient; // DB connection
const PORT = 2121;
require("dotenv").config();

//Database setup - intializes and sets variables
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo";

//DB Connection
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);

//Express Setup / middleware function
app.set("view engine", "ejs"); // Allows you to use EJS
app.use(express.static("public")); // Allows access to public folder
app.use(express.urlencoded({ extended: true })); // Allows easy data transfer (returns object, replaces bodyparser)
app.use(express.json()); // parses incoming JSON requests and puts the parsed data in req

//Manage GET request for Homepage
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

// POSTs new items
app.post("/addTodo", (request, response) => {
  //insert to the todo collection as an item that is not in a completed state
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem, completed: false }) // inserts new item to db collection
    .then((result) => {
      console.log("Todo Added");
      response.redirect("/"); // refreshes client side page
    })
    .catch((error) => console.error(error));
});

// When user checks completed
app.put("/markComplete", (request, response) => {
  db.collection("todos") // requests fetch  from database
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: true, // Set completed property to true
        },
      },
      {
        sort: { _id: -1 }, // sorts in descending order
        upsert: false, // insert and update DB entry
      }
    )
    .then((result) => {
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    .catch((error) => console.error(error));
});

// When user unchecks completed
app.put("/markUnComplete", (request, response) => {
  db.collection("todos") // requests fetch from database
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: false, // Set completed property to false
        },
      },
      {
        sort: { _id: -1 }, // // sorts in descending order
        upsert: false, // insert and update DB entry
      }
    )
    .then((result) => {
      console.log("Marked Uncomplete");
      response.json("Marked uncomplete");
    })
    .catch((error) => console.error(error));
});

// When user clicks DELETE item
app.delete("/deleteItem", (request, response) => {
  db.collection("todos") // requests fetch from database 
    .deleteOne({ thing: request.body.itemFromJS }) // delets what was chosen
    .then((result) => {
      console.log("Todo Deleted");
      response.json("Todo Deleted");
    })
    .catch((error) => console.error(error));
});

// Listening
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
