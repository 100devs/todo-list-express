//Requiring express middleware
const express = require("express");
//save express function in app variable
const app = express();
//requiring mongoDB
const MongoClient = require("mongodb").MongoClient;
//The port on which the server should run
const PORT = 2121;
//Requiring dotenv dependency
require("dotenv").config();

//Declaring a variable db
let db,
  //Assigning "dbConnectionStr" variable the mongoDB connection string saved in .env file
  dbConnectionStr = process.env.DB_STRING,
  //Defining a variable
  dbName = "todo";
//Connecting to mongoDB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    //If successfully connected console.log
    console.log(`Connected to ${dbName} Database`);
    //Renaming the db collection to the value "todo" saved in dbName variable
    db = client.db(dbName);
  }
);

//Register or setting up view engine/ejs
app.set("view engine", "ejs");
//Informing express to make the public folder accessible to the public
app.use(express.static("public"));
//A middleware that comes with express that parses data into a object that can be used with req object
app.use(express.urlencoded({ extended: true }));
//Instructing the server to read JSON
app.use(express.json());

//Making an async read request to "/" route
app.get("/", async (request, response) => {
  //Awaiting a respose from the request made to get all items, convert them to an array and save them in todoItems variable
  const todoItems = await db.collection("todos").find().toArray();
  //Count the number of items that are not completed from the response gotten
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false });
  //Send the responses received saved in todoItems and itemsLeft variables to EJS to be rendered
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

//Making an async post request to "/addTodo" route
app.post("/addTodo", (request, response) => {
  //Inserts or add a new todo item to the DB
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem, completed: false })
    .then((result) => {
      //display the below string in the console after item has been inserted
      console.log("Todo Added");
      //Redirect to the homepage
      response.redirect("/");
    })
    //if error, catch and display the error message in the console.
    .catch((error) => console.error(error));
});

//Making an async put/update request to "/marrkComplete" route
app.put("/markComplete", (request, response) => {
  //Search for the item that matches request.body.itemFromJS
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        //Updates the item by setting its "completed" property to true
        $set: {
          completed: true,
        },
      },
      {
        //Sort the data from old to new
        sort: { _id: -1 },
        //Upsert means to update and insert. Setting it to false is instructing mongo to not create a new item if it doesn't exist already
        upsert: false,
      }
    )
    .then((result) => {
      //Display marked complete in the console
      console.log("Marked Complete");
      //Responds back to the client with a "Marked complete" text in Json format
      response.json("Marked Complete");
    })
    //Catch and display error message if any
    .catch((error) => console.error(error));
});

//Making an async put/update request to "/markUnComplete" route
app.put("/markUnComplete", (request, response) => {
  //Search for the item that matches request.body.itemFromJS
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        //Updates the item by setting its completed property to false
        $set: {
          completed: false,
        },
      },
      {
        //Sort the data from old to new
        sort: { _id: -1 },
        //Upsert means to update and insert. Setting it to false is instructing mongo to not create a new item if it doesn't exist already
        upsert: false,
      }
    )
    .then((result) => {
      //Display marked complete in the console
      console.log("Marked Complete");
      //Responds back to the client with a "Marked complete" text in Json format
      response.json("Marked Complete");
    })
    //Catch and display error message if any
    .catch((error) => console.error(error));
});

//Making a delete request to "/deleteItem" route
app.delete("/deleteItem", (request, response) => {
  //Search for the item that matches request.body.itemFromJS and delete it
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      //Display "Todo Deleted" in the console after delete occurs
      console.log("Todo Deleted");
      //Responds back to the client with a "Todo Deleted" text in Json format
      response.json("Todo Deleted");
    })
    //Catch and display error message if any
    .catch((error) => console.error(error));
});
//Instructing the server the port to listen/respond to requests
//Either the port stated by us or the one made available by our host enviroment
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
