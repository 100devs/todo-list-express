// Adds express
const express = require("express");
// sets "app" var to use express
const app = express();
// Adds MongoDB and sets "MongoClient" var
const MongoClient = require("mongodb").MongoClient;
// Set port
const PORT = 2121;
// Use the dotenv
require("dotenv").config();

// define vars for the db url and the db name
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo";

// Connect to Mongodb
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);

// Set view engine to ejs, so we can use templates
app.set("view engine", "ejs");
// Allow use of the public folder
app.use(express.static("public"));
// urls
app.use(express.urlencoded({ extended: true }));
// use json parsing
app.use(express.json());

// what to do when the user asks for the root page
app.get("/", async (request, response) => {
  // make an array of to-do itesm from the database
  const todoItems = await db.collection("todos").find().toArray();
  // count the amount of todos that are not completed
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false });
  // render the template and return the items todo and itemsleft into the template
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

// add a to-do item
app.post("/addTodo", (request, response) => {
  // go to database collection todos
  db.collection("todos")
    // add one object with the body todoItem and completed = false
    .insertOne({ thing: request.body.todoItem, completed: false })
    .then((result) => {
      console.log("Todo Added");
      // go back to the root page
      response.redirect("/");
    })
    .catch((error) => console.error(error));
});

// update is something is marked as completed
app.put("/markComplete", (request, response) => {
  // go to database todos
  db.collection("todos")
    // update the completed to true
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: true,
        },
      },
      // sort them and grab the first matching one
      {
        sort: { _id: -1 },
        // if this item doesn't exist, create it
        upsert: false,
      }
    )
    .then((result) => {
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    .catch((error) => console.error(error));
});

// mark item as uncomplete
app.put("/markUnComplete", (request, response) => {
  // go to database collection todos
  db.collection("todos")
    // update completed to false
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: false,
        },
      },
      {
        sort: { _id: -1 },
        // if this item doesn't exist create it
        upsert: false,
      }
    )
    .then((result) => {
      // This should be uncompleted?
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    .catch((error) => console.error(error));
});

// delete an item
app.delete("/deleteItem", (request, response) => {
  //go to database "todos"
  db.collection("todos")
    // delete one using itemFromJS
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      console.log("Todo Deleted");
      response.json("Todo Deleted");
    })
    .catch((error) => console.error(error));
});

// listening on port
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
