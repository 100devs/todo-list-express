const express = require("express"); // bring the express module into the server.
const app = express(); //intializing the express object.
const MongoClient = require("mongodb").MongoClient; // Bringing the mongo client into the server.
const PORT = 2121; // setting port for use
require("dotenv").config(); // setting the ability to use local environment variables using .env files.

let db, //declaring db
  dbConnectionStr = process.env.DB_STRING, // declaring dbconnection string to be imported from the environment variables
  dbName = "todo"; // declaring name of collection in database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  //connects to database.
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName); // asigns database to client db of "todo"
  }
);

app.set("view engine", "ejs"); // sets view engine to EJS
app.use(express.static("public")); // tells express to use the public field for static files like css/client js
app.use(express.urlencoded({ extended: true })); // parses incoming url encoded requests
app.use(express.json()); // parses incoming requests with json

app.get("/", async (request, response) => {
  // read function of the root directory /
  const todoItems = await db.collection("todos").find().toArray(); // assigns todoItems to an array of all the todos in the database.
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false }); // goes to db, gets all todos, and returns a count of the ones that have a completed value of false
  response.render("index.ejs", { items: todoItems, left: itemsLeft }); // renders the page with items being what items are in todos, and how many are left uncompleted
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
      response.redirect("/"); // everything above adds a new todo into the db and then if successful it redirects to the root
    })
    .catch((error) => console.error(error));
});

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
    .catch((error) => console.error(error)); // this whole route goes to the collection of todos, gets the one to update from js
  // sets completed to true, sorts the collection, then console log and respons that it was marked complete
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
  // this whole route goes to the collection of todos, gets the one to update from js
  // sets completed to false, sorts the collection, then console log and respons that it was marked incomplete
});

app.delete("/deleteItem", (request, response) => {
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      console.log("Todo Deleted");
      response.json("Todo Deleted");
    })
    .catch((error) => console.error(error));
  // this entire route goes to the collection, finds the one that was sent from js and then deletes it and console logs/respond
  // that it was delete
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`); // starts the server and tells it to listen on the port specified in the environment 
  //file if there is one, or the port number defined at the top of the class if not
});
