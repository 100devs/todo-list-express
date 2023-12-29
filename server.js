//this block of code initialises all the modules to be used in the application backend
const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

//this is the port that is going to be used when setting up the application on a host
const PORT = 2121;

// here we are initialising the variables so that we can use them later for the database
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo";
// this is where the database is being connected, using the connection string of dbConnectionStr, this is better done using a .env file, the use unified topology is so that we dont get deprecation warnings
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  //after connecting a string is console.logged to let us know that it is now active and the previously initialised db variable is given a value
  .then((client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  });

// this is where the initial ejs, or rather html is referred to when ejs is called, which is a templating engine
app.set("view engine", "ejs");
// the public folder is whipped up and rendered onto the DOM
app.use(express.static("public"));
//this is what allows us to access the URL
app.use(express.urlencoded({ extended: true }));
//parses the incoming requests into JSON and allows us to use them in the backend
app.use(express.json());

//the get function for the EJS ONLY, since it needs to wait for the database to send it the data, and process it, then render it, the rest of the page, as in the css and js is sent along the static method
app.get("/", async (request, response) => {
  //adds all the doccuments in the todo collection into an array
  const todoItems = await db.collection("todos").find().toArray();
  //counts how many of the todo Items are not yet completed
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false });
  //renders the EJS using the two variables just initialised
  response.render("index.ejs", { items: todoItems, left: itemsLeft });
});

//a listener for the /addTodo channel, so that whenever a request is sent there, this function is called, which then uses the information sent in the form and adds it to the database using .insertOne
app.post("/addTodo", (request, response) => {
  //access DB
  db.collection("todos")
    //inserts value
    .insertOne({ thing: request.body.todoItem, completed: false })
    //console.logs the success and redirects the client to the main page, which then calls the get request again
    .then((result) => {
      console.log("Todo Added");
      response.redirect("/");
    })
    //console.errors the errer IF there is one
    .catch((error) => console.error(error));
});

//a listener for the /markComplete channel, so that whenever a request is sent there, this function is called
app.put("/markComplete", (request, response) => {
  //looks at the todo collection
  db.collection("todos")
    //uses the updateOne method to lookfor and edit a specific value
    .updateOne(
      //the thing is the parent node sent by the frontend and searches for it in the databse
      { thing: request.body.itemFromJS },
      //then marks it as complete
      {
        $set: {
          completed: true,
        },
      },
      //upsert means that it creates a doccument if there is none, which we dont want
      {
        sort: { _id: -1 },
        upsert: false,
      }
    )
    //once the process is done, a response is sent to the frontend to then refresh the page
    .then((result) => {
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    //console.error the error if there is one
    .catch((error) => console.error(error));
});

//a listener for the /markUnComplete channel, so that whenever a request is sent there, this function is called
app.put("/markUnComplete", (request, response) => {
  //looks at the todo collection
  db.collection("todos")
    //uses the updateOne method to lookfor and edit a specific value
    .updateOne(
      //the thing is the parent node sent by the frontend and searches for it in the databse
      { thing: request.body.itemFromJS },
      //then marks it as incomplete
      {
        $set: {
          completed: false,
        },
      },
      //upsert means that it creates a doccument if there is none, which we dont want
      {
        sort: { _id: -1 },
        upsert: false,
      }
    )
    //once the process is done, a response is sent to the frontend to then refresh the page
    .then((result) => {
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    //console.error the error if there is one
    .catch((error) => console.error(error));
});

//a listener for the /deleteItem channel, so that whenever a request is sent there, this function is called
app.delete("/deleteItem", (request, response) => {
    //looks at the todo collection
  db.collection("todos")
  //the thing is the parent node sent by the frontend and searches for it in the database, and deletes it
    .deleteOne({ thing: request.body.itemFromJS })
    //responds with the result to the frontend to then have it refresh the page
    .then((result) => {
      console.log("Todo Deleted");
      response.json("Todo Deleted");
    })
    //console.error the error if there is one
    .catch((error) => console.error(error));
});

//this whole code is then ran on a server of kind albeit your own local system or an actual server to start listening for users
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});