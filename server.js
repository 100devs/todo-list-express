// import express library package the we already install it through npm
const express = require("express");
// fire the express ability and put it in the app variable
const app = express();
// import MongoClient class from mongodb library package that we already install it through npm
const MongoClient = require("mongodb").MongoClient;
// spedify the port which we cann access (listen) our server through
const PORT = 2121;
// import dotenv package specifically config method which we could use it to introduce .env file to the server then we could read the .env file here
require("dotenv").config();

// declare variables
let db,// make db variable globally available so we could use anywhere in the server the db will take values after the connection established to the mongodb database
  dbConnectionStr = process.env.DB_STRING, // set the dbConnectionStr value to the value of the .env secret connection string 'DB_STRING'
  dbName = "todo"; // set the name of the database that we will connect to 


// establish a connection to the database with the connection string and with options {useUnifiedTopology: true} the connection will take time so we will receive a promise solved with then functionality
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  // after connection we will receive the client as a result of the connection
  (client) => {
    // show info that we can connect to the db
    console.log(`Connected to ${dbName} Database`);
    // update the previouse declared variable 'db' to hole the database functionality available through mongodb to our db 'todo'
    db = client.db(dbName);
  }
);

// set the view engine to handle render generated html file to the client to EJS
app.set("view engine", "ejs");
// locate the folder that hold the static files like css and js then it will link to the generated html
app.use(express.static("public"));
// use this middleware encode the url that may contain extra data like parameters
app.use(express.urlencoded({ extended: true }));
// use middleware to use json encode and decode inside the server
app.use(express.json());

// routes definitions:
// the root route that will display the main page of the app
// it has the get method represent the R of Read in CRUD
// the route is '/' and has the async function take request and response
app.get("/", async (request, response) => {
  // hold the data received from the todos collection on the db after converted to array in todoItems variable (await used because they will take time to come back from the db)
  const todoItems = await db.collection("todos").find().toArray();
  // hold the number of all documents on todos collection that has a property {completed" false} so show all uncompleted todos (await used because they will take time to come back from the db)
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false });
    // render the index.ejs file as a response from the server when the root called, injecting data in an object containing the todos list and number of incompleted todos
    response.render("index.ejs", { items: todoItems, left: itemsLeft });
  // the equivalent method but with the '.then' method instead of 'await'
  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
});

// the addTodo route that will handle todo add to the database
// it has the post method represent the C of Creat in CRUD
// the route is '/addTodo' and has the function take request and response
app.post("/addTodo", (request, response) => {
  // choose the collection in the database 'todos'
  db.collection("todos")
    // use insertOne method to add one document to the db with the iformation of:
    // thing: the data came from the frontend form that can catched here with the request.body.todoItem
    // completed: give it a default value 'false' as it incomplete
    .insertOne({ thing: request.body.todoItem, completed: false })
    // use .then method to wait for response come from the db
    .then((result) => {
      // inform the user that the todo added successfully
      console.log("Todo Added");
      // refresh the page so we go to the root rout '/' to refresh the data and show the recently added todo in the list
      response.redirect("/");
    })
    // if there is an error witht above the following catch it and console the error
    .catch((error) => console.error(error));
});

// the markComplete route that will handle mark the todo as completed in the database
// it has the put method represent the U of Update in CRUD
// the route is '/markComplete' and has the function take request and response
app.put("/markComplete", (request, response) => {
  // choose the collection in the database 'todos'
  db.collection("todos")
    // use updateOne method to update one document in the db with the iformation of:
    // thing: the data came from the frontend click on specific todo text that can catched here with the request.body.todoItem then search the db by its text
    .updateOne(
      { thing: request.body.itemFromJS },
      // after find the document update the completed property by making it true use the $set method came form the db of mongodb
      {
        $set: {
          completed: true,
        },
      },
      // sort the result by _id decendently
      // upsert set to false so if it dosnt find the document not create new one
      {
        sort: { _id: -1 },
        upsert: false,
      }
    )
    // use .then method to wait for response come from the db
    .then((result) => {
      // inform the user in the console that the updated done
      console.log("Marked Complete");
      // send json data "Marked Complete" as a response to the request from the fronend
      response.json("Marked Complete");
    })
    // if there is an error witht above the following catch it and console the error
    .catch((error) => console.error(error));
});

// the markUnComplete route that will handle mark the todo as uncompleted in the database
// it has the put method represent the U of Update in CRUD
// the route is '/markUnComplete' and has the function take request and response
app.put("/markUnComplete", (request, response) => {
  // choose the collection in the database 'todos'
  db.collection("todos")
    // use updateOne method to update one document in the db with the iformation of:
    // thing: the data came from the frontend click on specific todo text that can catched here with the request.body.todoItem then search the db by its text
    .updateOne(
      { thing: request.body.itemFromJS },
      // after find the document update the completed property by making it false use the $set method came form the db of mongodb
      {
        $set: {
          completed: false,
        },
      },
      // sort the result by _id decendently
      // upsert set to false so if it dosnt find the document not create new one
      {
        sort: { _id: -1 },
        upsert: false,
      }
    )
    // use .then method to wait for response come from the db should be "Marked Un Complete"
    .then((result) => {
      // inform the user in the console that the updated done
      console.log("Marked Complete");
      // send json data "Marked Complete" should be "Marked Un Complete" as a response to the request from the fronend
      response.json("Marked Complete");
    })
    // if there is an error witht above the following catch it and console the error
    .catch((error) => console.error(error));
});


// the deleteItem route that will handle delete selected todo from the database
// it has the delete method represent the D of Delete in CRUD
// the route is '/deleteItem' and has the function take request and response
app.delete("/deleteItem", (request, response) => {
  // choose the collection in the database 'todos'
  db.collection("todos")
    // use deleteOne method to delete one document in the db with the iformation of:
    // thing: the data came from the frontend click on specific todo text that can catched here with the request.body.todoItem then search the db by its text
    .deleteOne({ thing: request.body.itemFromJS })
    // use .then method to wait for response come from the db should be "Marked Un Complete"
    .then((result) => {
      // inform the user in the console that the delete done
      console.log("Todo Deleted");
      // send json data "Todo Deleted" as a response to the request from the fronend
      response.json("Todo Deleted");
    })
    // if there is an error witht above the following catch it and console the error
    .catch((error) => console.error(error));
});

// the main function that will fire the server to run and listening in the predefined port number either as the variable or from the .env file 2121
app.listen(process.env.PORT || PORT, () => {
  // anouncement that it is run and ready to listen to the requests
  console.log(`Server running on port ${PORT}`);
});
