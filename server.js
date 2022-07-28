//require express so we can use it
const express = require("express");
//store express into app for easy typing
const app = express();
//require our mongodb client for connecting to our db
const MongoClient = require("mongodb").MongoClient;
//assign our port to 2121, localhost:
const PORT = 2121;
//require dotenv and config so that we can use secrets in this file
require("dotenv").config();

//assign our db var
let db,
  //set our connection string to our DB env val
  dbConnectionStr = process.env.DB_STRING,
  //assign our dbName
  dbName = "todo";

//connect to MongoDB, and pass in our connection string
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  //after we are connected to our DB
  .then((client) => {
    //log that we are connected and to which DB, for verification
    console.log(`Connected to ${dbName} Database`);
    //assign db to our DB client
    db = client.db(dbName);
    //closing then
  });

//Middleware
//app set ejs as what is rendered
app.set("view engine", "ejs");
//let's server read from public folder, css and main.js
app.use(express.static("public"));
//tells express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.urlencoded({ extended: true }));
//Parses JSON content from incoming requests
app.use(express.json());

//async get request to home page
app.get("/", async (request, response) => {
  //await grab todos from our DB, turn them into an array and store
  const todoItems = await db.collection("todos").find().toArray();
  //when that's done
  //await grab number of items that are not completed and store
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false });
  //after that's done
  //res.render our index.ejs file, with the todo items and items left to do count
  response.render("index.ejs", { items: todoItems, left: itemsLeft });
  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
  //end get
});

//post request to /addToDo
app.post("/addTodo", (request, response) => {
  //go into db todos
  db.collection("todos")
    //insert what is typed into thing, set completed to false
    .insertOne({ thing: request.body.todoItem, completed: false })
    //then
    .then((result) => {
      //log added
      console.log("Todo Added");
      //send user back to homepage
      response.redirect("/");
    })
    //if not resolved, log error
    .catch((error) => console.error(error));
  //end post
});

//put request to /markCompleted
app.put("/markComplete", (request, response) => {
  //go into todos
  db.collection("todos")
    //update
    .updateOne(
      //update the thing typed in
      { thing: request.body.itemFromJS },
      {
        //set it to complete
        $set: {
          completed: true,
        },
      },
      //reduce left to do count
      {
        //moves item to bottom of list
        sort: { _id: -1 },
        //prevent insertion if item does not already exist
        upsert: false,
      }
    )
    //then
    .then((result) => {
      //log marked complete
      console.log("Marked Complete");
      //respond with marked complete
      response.json("Marked Complete");
    })
    //if not resolved, log error
    .catch((error) => console.error(error));
  //end put
});

//put request to markUnComplete
app.put("/markUnComplete", (request, response) => {
  //go into todos
  db.collection("todos")
    //update
    .updateOne(
      //which item is typed
      { thing: request.body.itemFromJS },
      {
        //set it to not completed
        $set: {
          completed: false,
        },
      },
      {
        //moves item to bottom of list
        sort: { _id: -1 },
        //prevent insertion if item does not already exist
        upsert: false,
      }
    )
    //then
    .then((result) => {
      //log marked complete, should be uncompleted
      console.log("Marked Complete");
      //res marked complete, should be uncompleted
      response.json("Marked Complete");
    })
    //if failed, log error
    .catch((error) => console.error(error));
  //end put
});

//delete request to /deleteItem
app.delete("/deleteItem", (request, response) => {
  //go to todos
  db.collection("todos")
    //delete item that is typed in
    .deleteOne({ thing: request.body.itemFromJS })
    //then
    .then((result) => {
      //log todo deleted
      console.log("Todo Deleted");
      //res todo deleted
      response.json("Todo Deleted");
    })
    //if not resolved, log error
    .catch((error) => console.error(error));
  //end delete
});

//listen to port from our env file, or whatever port is given
app.listen(process.env.PORT || PORT, () => {
  //log which server we are running on
  console.log(`Server running on port ${PORT}`);
  //end listen
});
