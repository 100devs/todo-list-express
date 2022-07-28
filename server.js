//dependencies declarations
const express = require("express");
//tells the code base to use the express modules
const app = express();
//tells the code base the variable for express is "app" which will execute express everytime you call express
const MongoClient = require("mongodb").MongoClient;
//creates the variable for mongodb module
const PORT = 2121;
// declaring the variable for the port to be used
require("dotenv").config();
//obscures data for the database (ie the connection string for monogo & password)

let db,
  //declaring db variable
  dbConnectionStr = process.env.DB_STRING,
  //declaring connection string which gets its data from the process environment
  dbName = "todo";
// declaring name of the db we're importing

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  //The unified topology is available now behind the useUnifiedTopology feature flag. You can opt in to using it by passing the option to your MongoClient constructor: const client = MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });
  .then((client) => {
    //once useUnifiedTopology = true, then perform client function
    console.log(`Connected to ${dbName} Database`);
    //console log database connection
    db = client.db(dbName);
    //establish db variable value from Database
  });

app.set("view engine", "ejs");
//Tells express to use ejs to produce our views that are "painted" to the screen. (Front End)
app.use(express.static("public"));
//Tells express the static route for where to find the ejs files. i.e what folder they live in.
app.use(express.urlencoded({ extended: true }));
//Converts characters into a format that can be sent over the internet.
app.use(express.json());
//Middleware that allows express to read json format.

//get the root folder and responding with todo (array)
//counts the number of documents completed as false
//left has the items and todoItems
//assigning the variables todo items
//possibly defaults to false
app.get("/", async (request, response) => {
  const todoItems = await db.collection("todos").find().toArray();

  //counts the database and see whats false and list whats left TODO
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false });
  response.render("index.ejs", { items: todoItems, left: itemsLeft });
  db.collection("todos")
    .find()
    .toArray()
    .then((data) => {
      db.collection("todos")
        .countDocuments({ completed: false })
        .then((itemsLeft) => {
          //It renders the HTML with two columns
          response.render("index.ejs", { items: data, left: itemsLeft });
        });
    })
    //catches an error if any
    .catch((error) => console.error(error));
});

//Creating a toDo  list - inserting one more document to the body. Our doc in the DB will have a properrt called thing and it will
//be set tothe . Todo item.. sent with a FORM (pathing)
//action="/addTodo"  from EJS file
//updating the data base from the CREATE
app.post("/addTodo", (request, response) => {
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem, completed: false })
    .then((result) => {
      console.log("Todo Added");

      //so it takes you back to the root route
      response.redirect("/");
    })
    //declares error if occurs
    .catch((error) => console.error(error));
});

//css puts a line through completed items
app.put("/markComplete", (request, response) => {
  //update in the CRUD.
  //request.body.itemFromJS = pathing
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        //declared db ='todo's. Todo's is table of data in db. We making a request to update the body with this data.
        $set: {
          //from main js file line 37
          completed: true,
        },
      },
      {
        //"To specify sorting order 1 and -1 are used. 1 is used for ascending order while -1 is used for descending order."
        sort: { _id: -1 },
        //sorts so that completed items are on the bottom of the page
        // This tells the request to try to update the object if it exists and to insert the object specified if it doesn't already exist
        upsert: false,
      }
    )
    .then((result) => {
      console.log("Marked Complete");
      //result is console logged
      response.json("Marked Complete");
      //main.js awaiting response.json: line 47 in main.js
    })
    .catch((error) => console.error(error));
});

//similar to '/markComplete' LET'S GO!
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
        //"To specify sorting order 1 and -1 are used. 1 is used for ascending order while -1 is used for descending order."
        sort: { _id: -1 },
        upsert: false,
      }
    )
    .then((result) => {
      console.log("Marked Incomplete");
      response.json("Marked Incomplete");
    })
    .catch((error) => console.error(error));
});

app.delete("/deleteItem", (request, response) => {
  // create Delaytay route to delete todo item
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS })
    //get item clicked from index.ejs and delete
    .then((result) => {
      console.log("Todo Deleted");
      //respond in console that the item was deleted
      response.json("Todo Deleted");
      //respond to main.js that item was deleted
    })
    .catch((error) => console.error(error));
  //throw error if error
});


//And of course, we're listening at either our defined port or our port from our .env file
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});