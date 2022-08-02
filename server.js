//Declare variables
//Install express, and use it be requiring it.
const express = require("express");
const app = express();
//connect to MongoDB through MongoClient's connect method
const MongoClient = require("mongodb").MongoClient;
const PORT = 2121;
require("dotenv").config();

//
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo";
//Connect to Mongo database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);
//Set Middleware
//This tells Express we’re using EJS as the template engine.
//You need to place it before any CRUD methods.
app.set("view engine", "ejs");
//tell Express to make this public folder accessible to the public by using a built-in middleware called express.static
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (request, response) => {
  //Combining all of our todo items into an array
  const todoItems = await db.collection("todos").find().toArray();
  //Here we declare an itemsLeft variable that determines whether a task was completed or not
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false });
  //Renders items that aren't marked as completed
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

//POST method that adds an item to our database and renders it in the ejs
app.post("/addTodo", (request, response) => {
  //Going into database, collection 'todos', and finding
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem.trim(), completed: false })
    .then((result) => {
      console.log("Todo Added");
      response.redirect("/");
    })
    .catch((error) => console.error(error));
});

//PUT Method that updates the item as completed
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

//PUT Method that updates the item as uncompleted
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
//Create a server that browsers can connect to.
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
