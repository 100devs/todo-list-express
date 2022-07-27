//load node modules and declare and initialize variables
const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const PORT = 2121;
require("dotenv").config();

//declare database and initializing variables and database connection string.
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo";
//establish connection to Mongo Database.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);
//declare and initializing middlemare
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Root route for
app.get("/", async (request, response) => {
  const todoItems = await db.collection("todos").find().toArray(); //declare todoItems variable, retrieve data from "todos" collection, converting all data into an array.
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false }); //return numbers of items with attribute completed with value false.
  response.render("index.ejs", { items: todoItems, left: itemsLeft }); //send data to ejs to render html
  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
});
//Post route
app.post("/addTodo", (request, response) => {
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem, completed: false }) //add 1 todo item from database, and set thing property to value submitted by form and set completed property value to false.
    .then((result) => {
      console.log("Todo Added");
      response.redirect("/");
    })
    .catch((error) => console.error(error));
});
//Update route
app.put("/markComplete", (request, response) => {
  //update todo item to completed
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: true,
        },
      },
      {
        //sort the collection
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
//Update route
app.put("/markUnComplete", (request, response) => {
  //update todo item to not compeleted
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: false,
        },
      },
      {
        //sort the collection
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
//Delete route
app.delete("/deleteItem", (request, response) => {
  //delete 1 item from the 'todo' collection
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      console.log("Todo Deleted");
      response.json("Todo Deleted");
    })
    .catch((error) => console.error(error));
});
//Setting port
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
