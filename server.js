// Gets the express server Object
const express = require("express");
//instantiates the express server and calles it app
const app = express();
//connects to the mongo database with mongo client
const MongoClient = require("mongodb").MongoClient;
//specifies the server connection port as 2121
const PORT = 2121;
//requires the file to import the dotenv module and the config object.
require("dotenv").config();

//specifies the database connection variables
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo";
//connects to the database lets the user know its connected to the database with the db variable
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);
//sets the exrpress app's templating engine to 'ejs' format.
app.set("view engine", "ejs");
//asks the app to serve static files from the 'public' directory.
app.use(express.static("public"));
//sets the middleware to parse URL encoded data with more options. it extends form submission configurations.
app.use(express.urlencoded({ extended: true }));
//allows our app to accept json objects as payloads.
app.use(express.json());

//tells the express app to use '/' as the default get route.
app.get("/", async (request, response) => {
  //assigns an array from the database as todoItems asynchronously.
  const todoItems = await db.collection("todos").find().toArray();
  //gets the number of todo items that arent completes.
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false });
  //render the todoItems and the items left into the view.
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
//uses the '/addTodo' route to access the database
app.post("/addTodo", (request, response) => {
  //inserts the item specified in the request body and sets the completed boolean to false.
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem, completed: false })
    .then((result) => {
      //logs "Todo Added" and sends the user back to the default route.
      console.log("Todo Added");
      response.redirect("/");
    })
    //sends an error if express encounters something inexpected.
    .catch((error) => console.error(error));
});
//accesses the markComplete routes with express
app.put("/markComplete", (request, response) => {
  //in the todos collection on the database it changes the thing int the request body to completed: false. and sorts the data in descending order.
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
    //logs 'marked completed' and sens the same to the client.
    .then((result) => {
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    //returns an error should one be encounteres.
    .catch((error) => console.error(error));
});
//uses the /markUncompleted route to access the database and updates the items specified in the request body as completed: false. sorts in descending order.
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
      //logs completed although it should probelt say "marked incomplete. "
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    .catch((error) => console.error(error));
});
//uses the delete.deleteItem route to access the database and tells mongo deb to delete the one specified item from the todos collection.
app.delete("/deleteItem", (request, response) => {
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      //logs 'todo Deleted'
      console.log("Todo Deleted");
      response.json("Todo Deleted");
    })
    //returns error should it encounter one.
    .catch((error) => console.error(error));
});
//expres tells the app to listen for changges on the PORT specified in the .env file or if one doesnt exist it should use the variable specified in PORT and if true it logs that the server is running on port PORT
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
