//require express to use
const express = require("express");
//sets const and assigns to instance of express
const app = express();
//alllow use methods associated with MongoClient and talk to DB
const MongoClient = require("mongodb").MongoClient;
//sets const to define location where server is listening
const PORT = 2121;
//allows us to look for variables inside of .env file
require("dotenv").config();

//declares var db to assign later
let db,
  //delcares var and assigns our db connection string
  dbConnectionStr = process.env.DB_STRING,
  //declares var and assigns name of db to use in proj
  dbName = "todo";

//creates connection to MongoDB and passes our connection string
//and passing additional property
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  //waits for connection and proceeds if successful-passing in all client info
  (client) => {
    //log to console if connected to db
    console.log(`Connected to ${dbName} Database`);
    //assigns value to previously declared db var contains db client factory method
    db = client.db(dbName);
  } //closes .then
);

//middleware
//sets ejs as default render
app.set("view engine", "ejs");
//sets location of static files
app.use(express.static("public"));
//tells express to decode/encode URLs where header matched content
//supports arrays/objects
app.use(express.urlencoded({ extended: true }));
//parses JSON content from incoming request
app.use(express.json());

//starts GET method when root route passed in-sets up req/res params
app.get("/", async (request, response) => {
  //sets const and awaits ALL items from todos collection
  const todoItems = await db.collection("todos").find().toArray();
  //sets const and awaist count of uncompleted items to displary later in ejs
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false });
  //renders ejs file and passes through db items and the count remaining inside object
  response.render("index.ejs", { items: todoItems, left: itemsLeft });
  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  //.catch(error => console.error(error))
});

//starts POST method when add route is passed in--comes from form
app.post("/addTodo", (request, response) => {
  //inserts a new item into todos collection, gives it a completed value of false
  //by default
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem, completed: false })
    //if insert is successful, do something
    .then((result) => {
      //log todo added
      console.log("Todo Added");
      //redirects to home page
      response.redirect("/");
    }) //closes .then
    //catches err
    .catch((error) => console.error(error));
}); //ends POST

//starts PUT method when markComplete route is passed in
app.put("/markComplete", (request, response) => {
  //looks at todos collection for one item matching task name of item passed in from main.js that was clicked on
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: true,
          //set completed status to true
        },
      },
      {
        //sorts item in descending order
        sort: { _id: -1 },
        //prevents insertion if item does not already exist
        upsert: false,
      }
    )
    //starts then if update was successful
    .then((result) => {
      //log msg to console
      console.log("Marked Complete");
      //sends res back to sender
      response.json("Marked Complete");
    }) //closes then
    .catch((error) => console.error(error)); //catch err
}); //end PUT

//starts PUT method when markUnComplete route is passed in
app.put("/markUnComplete", (request, response) => {
  //looks at todos collection for one item matching name of item passed in from main.js that was clicked on
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          //set complete to false
          completed: false,
        },
      },
      {
        //sorts item in descending order
        sort: { _id: -1 },
        //prevents insertion if item does not already exist
        upsert: false,
      }
    )
    //starts then if update was successful
    .then((result) => {
      //logs  msg to console
      console.log("Marked Complete");
      //sends res back to sender
      response.json("Marked Complete");
    }) //closes then
    .catch((error) => console.error(error));
}); //end PUT

//starts DELETE method when delete route is passed in
app.delete("/deleteItem", (request, response) => {
  //looks at todos collection for one item has a matching name from main.js
  db.collection("todos");
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS })
    //starts a then if delete was successful
    .then((result) => {
      //log msg to console
      console.log("Todo Deleted");
      //sends res back to sender
      response.json("Todo Deleted");
    }) //closes then
    //catches err
    .catch((error) => console.error(error));
}); //ends delete

//set up port to listen for server - either port from .env or one we set
app.listen(process.env.PORT || PORT, () => {
  //logs msg to console if port is running
  console.log(`Server running on port ${PORT}`);
});

//to build
//npm init
//npm install
