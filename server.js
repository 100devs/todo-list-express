// Create a server that browsers can connect to with require("express")
const express = require("express"); //Declares a variable that requires express.
// and requiring it with const app = express();
const app = express();
const MongoClient = require("mongodb").MongoClient; // Used to connect to MongoDB
const PORT = 2121; // setting our port
require("dotenv").config(); // requiring so we can put our "secrets inside"

let db,
  dbConnectionStr = process.env.DB_STRING, // used to connect to mongodb with key contained in .dotenv
  dbName = "todo"; // database name

// this is our promise so when we connect to our mongodb db we will get a console.log returned with Connected to todo database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);

// this is our middleware
app.set("view engine", "ejs"); // for view engine use ejs
app.use(express.static("public")); // helps serve static files that are located in the public folder
app.use(express.urlencoded({ extended: true })); // choose URL-encoded data with the querystring library (when false) or the qs-library (when true)
app.use(express.json()); // in order to access the data easily, we need the help of express json-parse that is taken to use with this command

// handles the read request for the homepage
app.get("/", async (request, response) => {
  // When url returns homepage. This tells the server to SERVE something in the EJS file
  const todoItems = await db.collection("todos").find().toArray(); // going into todo collection database, find the object, and return it to an array
  const itemsLeft = await db.collection("todos").countDocuments({ completed: false }); // you have to wait for the result of a query from the database
  response.render("index.ejs", { items: todoItems, left: itemsLeft });// Will insert the values returned by todoitems and itemsleft into the dom
  //   db.collection("todos").find().toArray().then((data) => {
  //       db.collection("todos")
  //         .countDocuments({ completed: false })
  //         .then((itemsLeft) => {
  //           response.render("index.ejs", { items: data, left: itemsLeft });
  //         });
  //     })
  //     .catch((error) => console.error(error));
});

// adds items to our database
app.post("/addTodo", (request, response) => {
   // tell mongo what we are trying to send with inserOne
   db.collection("todos")
     // we will pass everything you need to toss it up to the db
    .insertOne({ thing: request.body.todoItem, completed: false })//inserts an object into the Mongo database with a 'thing' property with a value pulled from the form and a property 'completed' with a value of false
    .then((result) => {//Once item has been added to the DB
      console.log("Todo Added");// will console log "todo Added"
      response.redirect("/");//Then refresh the page
    })
    .catch((error) => console.error(error));// if item not added to db will throw error
});


app.put("/markComplete", (request, response) => {// put request to update a item in the db to completed when the user clicks completed
  db.collection("todos")//find the todos collection
    .updateOne(//update an item
      { thing: request.body.itemFromJS },// tells the server which item from the user click via markcompleted function in main.js and update the document in the database with that name
      {
        $set: {//tells db to set value of a field in the db
          completed: true,// set value of completed field to true
        },
      },
      {
        sort: { _id: -1 },// sort the ids of the documents in the db in descending order
        upsert: false,//makes sure if there is no matching entry a new entry will not be created in the db
      }
    )
    .then((result) => {//if db entry in successfully updated to completed
      console.log("Marked Complete");// will console log "marked complete"
      response.json("Marked Complete");//responds to client with message "Marked Complete"
    })
    .catch((error) => console.error(error));// if db entry is not successfully updated will throw error
});

app.put("/markUnComplete", (request, response) => { // put request to update a item in the db to not completed when the user clicks not completed
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
        upsert: false, // the upsert option updates a document if one exists; it otherwise it will NOT creates a new document
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

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
