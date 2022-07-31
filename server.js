const express = require("express") //makes it possible to use express in the file
const app = express() //setting a constant and assigning it to instance of express
const MongoClient = require("mongodb").MongoClient //makes it works with our DB in Mongo
const PORT = 2121 //Sets a constant location(port) for the server to listen to
require("dotenv").config() // allows us to hide sensitive data in an .env file

let db, //declare db as variablwe but not assign a value
  dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our database connection string to it
  dbName = "todo" //declaring a var and assigning the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Create a connection to MongoDB. pass in connect string and some weird true thingy.
  .then((client) => {
    //waiting for connection and continuing if succesful and passes in all client info
    console.log(`Connected to ${dbName} Database`) //log to the console a template literal to show db name
    db = client.db(dbName) //assign a value to the previous db var.
  }) //close then

//Welcome to middleware
app.set("view engine", "ejs") //sets ejs as default render method
app.use(express.static("public")) //sets location for static assets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URLs where header matches the content. can be arrays and obj
app.use(express.json()) //Parses JSON content from incoming requests.

//starts a GET method when the root route is passed in and sets up req and res params.
//sets a variable and awaits ALL items from the todos collection
//sets a var and awaits count of uncomplete items to display in ejs file
app.get("/", async (request, response) => {
  const todoItems = await db.collection("todos").find().toArray()
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false })

  response.render("index.ejs", { items: todoItems, left: itemsLeft })
  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
})

app.post("/addTodo", (request, response) => {
  //starts a POST method when the add route is passed
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem, completed: false }) //inset new item into todo collection. false value default
    .then((result) => {
      console.log("Todo Added") //log in console todo added
      response.redirect("/") //refreshed page
    })
    .catch((error) => console.error(error)) //error catching
})

app.put("/markComplete", (request, response) => {
  //starts a PUT method when the markComplete route is passed in
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS }, //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
      {
        $set: {
          completed: true, //sets status to true
        },
      },
      {
        sort: { _id: -1 }, //moves item to bottom of list
        upsert: false, ///prevents insertion if item does not already exist
      }
    )
    .then((result) => {
      //starts a then if update was successful
      console.log("Marked Complete") //logs it
      response.json("Marked Complete") //send res to sender
    })
    .catch((error) => console.error(error)) //catch errors
})

app.put("/markUnComplete", (request, response) => {
  //starts a PUT method when the markUnComplete route is passed in
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
          completed: false, //set completed status to false
        },
      },
      {
        sort: { _id: -1 }, //moves item to the bottom of the list
        upsert: false, //prevents insertion if item does not already exist
      }
    )
    .then((result) => {
      //starts a then if update was successful
      console.log("Marked Complete") //logging successful completion
      response.json("Marked Complete") //sending a response back to the sender
    }) //closing .then
    .catch((error) => console.error(error)) //catching errors
}) //ending put

app.delete("/deleteItem", (request, response) => {
  //starts a delete method when the delete route is passed
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS }) //look inside the todos collection for the ONE item that has a matching name from our JS file
    .then((result) => {
      //starts a then if delete was successful
      console.log("Todo Deleted") //logging successful completion
      response.json("Todo Deleted") //sending a response back to the sender
    }) //closing .then
    .catch((error) => console.error(error)) //catching errors
}) //ending delete

app.listen(process.env.PORT || PORT, () => {
  //setting up which port we will be listening on - either the port from the .env file or the port vairable we set
  console.log(`Server running on port ${PORT}`) //console.log the running port.
}) //end the listen method
