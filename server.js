const express = require("express") // making it possible to use express in this file
const app = express() // setting a constant and assigning it to the instance of express
const MongoClient = require("mongodb").MongoClient // makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 // setting a constant to define the location where our server will be listening
require("dotenv").config() // allows us to look for variables inside of the .env file

let db, // declare db variable globally, currently undefined because didn't assign
    dbConnectionStr = process.env.DB_STRING, // declaring a variable and assigning our database connection string to it
    dbName = "todo" // declaring a variable and assigning the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // Creating a connection to MongoDB, and passing in our connection string.  Also passing in an additional property
    .then(client => {
        // waiting for the connection and proceeding if successful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`) // log to the console a template literal "connected to todo Database"
        db = client.db(dbName) // assigning a value to a previously declared db variable that contains a db client factory method
    }) // closing our .then method

// middleware - helps us faciliate our communication, helps open the communication channels for our requests
app.set("view engine", "ejs") // sets the "view engine" to ejs -- a tool that renders html with javascript-like syntax. Allows the app to render HTML from ejs. Sets ejs as default render method
app.use(express.static("public")) // lets express know that the folder to store "static" files in is called 'public'. Static files examples are HTML, JS, CSS. Static as in they aren't changing.
app.use(express.urlencoded({ extended: true })) // Tells express to decode and encode URLs where the header matches the content. Supports arrays and objects.
app.use(express.json()) // parses json content from incoming requests (replaces body parser)

// READ or GET
app.get("/", async (request, response) => {
    // starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection("todos").find().toArray() // sets a variable and awaits ALL items from the todo collection - toArray() loops through those documents and stores them in an array as objs
    const itemsLeft = await db
        .collection("todos")
        .countDocuments({ completed: false }) // sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render("index.ejs", { items: todoItems, left: itemsLeft }) // rendering the EJS file and passing through the db items and the count remaining inside of an object

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// CREATE or POST
app.post("/addTodo", (request, response) => {
    // starts a POST method when the add route is passed in
    db.collection("todos")
        .insertOne({ thing: request.body.todoItem, completed: false }) // inserts a new item into todos collection, gives it a completed value of false by default
        .then(result => {
            // if insert is successful, do something
            console.log("Todo Added") // console log action
            response.redirect("/") // gets rid of the /addTodo route and redirects back to the homepage
        }) // closing the .then
        .catch(error => console.error(error)) // errors are caught and console logged
}) // ending the POST

//UPDATE OR PUT
app.put("/markComplete", (request, response) => {
    // starts a PUT method when the markComplete route is passed in
    db.collection("todos")
        .updateOne(
            { thing: request.body.itemFromJS }, // look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
            {
                $set: {
                    completed: true, // set completed status to true
                },
            },
            {
                sort: { _id: -1 }, // moves item to the bottom of the list
                upsert: false, // prevents insertion if item does not already exist
            }
        )
        .then(result => {
            // starts a then if update was successful
            console.log("Marked Complete") // logs that a task has been marked complete onto the console
            response.json("Marked Complete") // sends a response back to the sender
        }) // closing the .then
        .catch(error => console.error(error)) // errors are caught and console logged
}) // ending PUT

// UPDATE OR PUT
app.put("/markUnComplete", (request, response) => {
    // starts a PUT method when the markUnComplete route is passed in
    db.collection("todos")
        .updateOne(
            { thing: request.body.itemFromJS }, // look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
            {
                $set: {
                    completed: false, // set completed status to true
                },
            },
            {
                sort: { _id: -1 }, // moves item to the bottom of the list
                upsert: false, // prevents insertion if item does not already exist
            }
        )
        .then(result => {
            // starts a then if update was successful
            console.log("Marked UnComplete") // logs that a task has been marked Uncomplete onto the console
            response.json("Marked UnComplete") // sends a response back to the sender
        }) // end the .then
        .catch(error => console.error(error)) // errors are caught and console logged
}) // end the PUT

//DELETE
app.delete("/deleteItem", (request, response) => {
    // starts a delete method when the delete route is passed
    db.collection("todos")
        .deleteOne({ thing: request.body.itemFromJS }) // look inside the todos collection for the ONE itme that has a matching name from our JS file
        .then(result => {
            // starts a .then if the delete was successful
            console.log("Todo Deleted") // logging successful completion
            response.json("Todo Deleted") // sending a response back to the sender
        }) // closing .then
        .catch(error => console.error(error)) // catching errors
}) // ending delete

app.listen(process.env.PORT || PORT, () => {
    // setting up which PORT we will be listening on - either the PORT from the .env file or the port variable we set
    console.log(`Server running on port ${PORT}`) //console log the running port
}) // end the listen method
