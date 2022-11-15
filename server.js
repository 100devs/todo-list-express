const express = require("express"); // require express to be used in this file (express prev installed)
const app = express(); // create a varaible and assigning it to the instance of express
const MongoClient = require("mongodb").MongoClient; // require mongo to be used in this file and connect our database (mongodb prev installed)
const PORT = 2121; // set a constant to set the port our server will be listening
require("dotenv").config(); // allows us to loof for variables inside the .env file

let db, //create a global variable db and se up to create another varaibles
  dbConnectionStr = process.env.DB_STRING, // create the variable and asign it to our data base string
  dbName = "todo"; /// create a varaible and asignt the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // create a connection to mongo db and passing our connection string. Also passing and aditional property name useUnifiedTopology and setting it to true
  .then(
    (client) => {
      // wait for the promise to be fullfilled and pasign the client information
      console.log(`Connected to ${dbName} Database`); // print to console, the database name
      db = client.db(dbName); // asign the database that we are going to use to the db varialbe
    } // close our then instructions
  ); // close our then

app.set("view engine", "ejs"); // using express to set ejs to default view engine
app.use(express.static("public")); // use express to connect static assets inside the pubic folder
app.use(express.urlencoded({ extended: true })); // use express to decode and encode urls where the header matches the content
app.use(express.json()); // parses json content

app.get("/", async (request, response) => {
  // set a route with an async get request
  const todoItems = await db.collection("todos").find().toArray(); //set a variable waiting for all the todos from the database in an array
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false }); // wait a count of uncompleted todos from our database
  response.render("index.ejs", { items: todoItems, left: itemsLeft }); // render our ejs file passing it the todos with the name og items and items left with the name of left

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
  // set a route with an async post request when acces /addTodo
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem, completed: false }) // add one todo and set it to false to our todos tollections in the database
    .then((result) => {
      // setup an then block passing it a result
      console.log("Todo Added"); // print to console a message
      response.redirect("/"); // open route /
    }) //close then block
    .catch((error) => console.error(error)); // set a catch block to pinrit an error if our request fails
}); // close request

app.put("/markComplete", (request, response) => {
  // set a route with an async put request when acces /markComplete
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS }, // setup to update a todo in the list
      { $set: { completed: true } }, // set to completed to true
      { sort: { _id: -1 }, upsert: false } // moves item to the bottom of the list and prevents insertion of element if element does not exists
    )
    .then((result) => {
      // setup an then block passing it a result
      console.log("Marked Complete"); // print to console message
      response.json("Marked Complete"); // send a json with message to client side code
    })
    .catch((error) => console.error(error)); // set a catch block to pinrit an error if our request fails
});

app.put("/markUnComplete", (request, response) => {
  // set a route with an async put request when acces /markUncomplete
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS }, // setup to update a todo in the list
      {
        $set: {
          completed: false, // set to completed to false
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      } // moves item to the bottom of the list and prevents insertion of element if element does not exists
    )
    .then((result) => {
      // setup an then block passing it a result
      console.log("Marked Complete"); // print to console message
      response.json("Marked Complete"); // send a json with message to client side code
    })
    .catch((error) => console.error(error)); // set a catch block to pinrit an error if our request fails
});

app.delete("/deleteItem", (request, response) => {
  // set a route with an async delete request when acces /deleteItem
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS }) // setup to update a todo in the list that match from js file
    .then((result) => {
      // setup an then block passing it a result
      console.log("Todo Deleted"); // print to console message
      response.json("Todo Deleted"); // send a json with message to client side
    })
    .catch((error) => console.error(error)); // set a catch block to pinrit an error if our request fails
});

app.listen(process.env.PORT || PORT, () => {
  // use express figure out wich port we will be listening
  console.log(`Server running on port ${PORT}`); // print message when correctly connecter
});
