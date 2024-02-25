// import express module into the project.
const express = require("express");
// initialize express.
const app = express();
// import mongoclient from mongodb.
const MongoClient = require("mongodb").MongoClient;
// specifies port to run server on.
const PORT = 2121;
// import variables storing key information in the .env file.
require("dotenv").config();

let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo";

// connects to database using the connection string from the .env file and logs the a mesage if connections is successful. it also creates a db collection.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);

// sets the view engine to ejs
app.set("view engine", "ejs");
// handle the static files for us.
app.use(express.static("public"));
// body parser.
app.use(express.urlencoded({ extended: true }));
// enables json parsing.
app.use(express.json());

// creates a request handler for the home page and runs an anonymous async function;
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

// creates a request handler to handle form submission and runs an anonymous async function;
app.post("/addTodo", (request, response) => {
  db.collection("todos")
    //   insert a new document into the collection
    .insertOne({ thing: request.body.todoItem, completed: false })
    .then((result) => {
      console.log("Todo Added");
      // redirects back to the home page. a new get request
      response.redirect("/");
    })
    // error handler
    .catch((error) => console.error(error));
});

// creates a request handler to handle completed tasks and runs an anonymous async function;
app.put("/markComplete", (request, response) => {
  db.collection("todos")
    .updateOne(
      // this is the document to be updated. it is the item on which the event listener was triggered on.
      { thing: request.body.itemFromJS },
      {
        // sets the value of the completed key to true.
        $set: {
          completed: true,
        },
      },
      {
        sort: { _id: -1 },
        // if set to true, it would create a new document in the absense of a document to be updated.
        upsert: false,
      }
    )
    .then((result) => {
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    // error handler
    .catch((error) => console.error(error));
});

// creates a request handler t handle the user request to remove the completed class from a task and runs an anonymous async function;
app.put("/markUnComplete", (request, response) => {
  db.collection("todos")
    //   updates the document
    .updateOne(
      // this is the document to be updated. it is the item on which the event listener was triggered on
      { thing: request.body.itemFromJS },

      {
        // sets the value of the completed key to true.
        $set: {
          completed: false,
        },
      },
      {
        sort: { _id: -1 },
        // if set to true, it would create a new document in the absense of a document to be updated.
        upsert: false,
      }
    )
    .then((result) => {
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    // error handler
    .catch((error) => console.error(error));
});

// creates a request handler to delete documents in the collection and runs an anonymous async function;
app.delete("/deleteItem", (request, response) => {
  db.collection("todos")
    //   deleteOne method deletes an item from the collection.  // thing is the document to be deleted. it is the item on which the event listener was triggered on
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      console.log("Todo Deleted");
      response.json("Todo Deleted");
    })
    // error handler
    .catch((error) => console.error(error));
});

// runs the server on a port
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
