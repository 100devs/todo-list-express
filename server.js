const express = require("express"); //require the server to have express
const app = express(); //sets express to the app variable
const MongoClient = require("mongodb").MongoClient; //requires MongoDB client
const PORT = 2121; //default port for server to listen on
require("dotenv").config(); //has a .env file for server

let db,
  dbConnectionStr = process.env.DB_STRING, //sets variable to the string to access DB
  dbName = "todo"; //sets the database name to todo when looking in MongoDB

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connect to MongoDB
  .then((client) => {
    //once you connect do the below
    console.log(`Connected to ${dbName} Database`); //once connected, console log name of DB
    db = client.db(dbName);
  });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (request, response) => {
  //listen to a get request
  const todoItems = await db.collection("todos").find().toArray(); //grab all of documents in DB and put into array and variable
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false }); //if completed is false, add to itemsLeft
  response.render("index.ejs", { items: todoItems, left: itemsLeft }); //put items, and itemsleft into EJS and respond with it
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
  //listen for put requests on addTodo route
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem, completed: false }) //go to DB with todo item from request and add one
    .then((result) => {
      //once that is done, complete below code
      console.log("Todo Added"); //once done, console log saying it was added
      response.redirect("/"); //refresh the page
    })
    .catch((error) => console.error(error)); //if error, print error in console
});

app.put("/markComplete", (request, response) => {
  //listen to put request on markComplete route
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        //go to DB, and update the requested item
        $set: {
          //change the completed property
          completed: true, //change it to true
        },
      },
      {
        sort: { _id: -1 }, //sort the list from not completed to completed
        upsert: false,
      }
    )
    .then((result) => {
      //once done, do the below code
      console.log("Marked Complete"); //when done, print to the console that it's done
      response.json("Marked Complete"); //respond with JSON saying it's completed
    })
    .catch((error) => console.error(error)); //if error, print to console the error
});

app.put("/markUnComplete", (request, response) => {
  //listen for put request on markUncomplete route
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        //got to DB and update document from request body
        $set: {
          //change the below property
          completed: false, //change completed property to false
        },
      },
      {
        sort: { _id: -1 }, //sort collection again by not completed to completed
        upsert: false,
      }
    )
    .then((result) => {
      //after the above code is done, do below
      console.log("Marked Complete"); //print to console that it is completed
      response.json("Marked Complete"); //send JSON saying action is completed
    })
    .catch((error) => console.error(error)); //if error, print to console
});

app.delete("/deleteItem", (request, response) => {
  //listen for a delete request on deleteItem route
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS }) //go to DB, and delete the item from request
    .then((result) => {
      //once done, do below code
      console.log("Todo Deleted"); //once done, print to console saying it's done
      response.json("Todo Deleted"); //once done, send JSON saying it's done
    })
    .catch((error) => console.error(error)); //if error, print to console the error
});

app.listen(process.env.PORT || PORT, () => {
  //tell the enviroment to listen to the port assigned to it from environment or the port we assigned in PORT
  console.log(`Server running on port ${PORT}`); //when server is running, print to the console the server is running on PORT
});
