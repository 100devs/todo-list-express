const express = require('express') // Imports Express
const app = express() // Sets a variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient // Makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 // Sets a variable to determine the location where our server will be listening
require('dotenv').config() // Allows us to look for variables inside the .env file


let db, // Initializes variable db globally so we can use it in multiple places
    dbConnectionStr = process.env.DB_STRING, // Sets a variable to store our DB connection string from .env folder
    dbName = 'todo' // Sets a variable to store our DB name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // Creates a connection to MongoDB and passing in our connection string
    .then(client => { // Waits for the connection and passing in client information once successful
        console.log(`Connected to ${dbName} Database`) // Log DB connection message to the console
        db = client.db(dbName) // Assigns a value to previously declared db variable that contains a db client factory method
    }) // Close .then block

// Middleware to open communication channels for our requests
app.set('view engine', 'ejs') // Sets EJS as the default render method
app.use(express.static('public')) // Sets the location for static assets (public folder)
app.use(express.urlencoded({ extended: true })) // Tells express to decode and encode URLs where the header matches the content
app.use(express.json()) // Parses JSON content from incoming requests


app.get('/',async (request, response)=>{ // Starts a GET (read) method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() // Sets a variable and awaits all items from "todos" collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // Sets a variable and awaits a count of uncompleted items to display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // Renders the EJS file and passes through the db items and count remaining inside an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) // Close the GET block

app.post('/addTodo', (request, response) => { // Starts a POST (create) method when the "/addTodo" route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // Inserts a new item into todos collection and gives it a completed value of false
    .then(result => { // If item is added successfully, then do something
        console.log('Todo Added') // Log the action to the console
        response.redirect('/') // Redirects back to the homepage and refreshes with updated database
    }) // Closes .then block
    .catch(error => console.error(error)) // Start a catch block to handle any errors
}) // Close the POST block

app.put('/markComplete', (request, response) => { // Start a PUT (update) method when the "/markCompelte" route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Look in the database for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: true // Set completed to true
          }
    },{
        sort: {_id: -1}, // Moves item to the bottom of the list
        upsert: false // Prevents insertion if item does not already exist
    }) // Closes updateOne method
    .then(result => { // If update is successful, then do something
        console.log('Marked Complete') // Log successful completion message to the console
        response.json('Marked Complete') // Sends a response back to the sender
    }) // Close .then block
    .catch(error => console.error(error)) // Start a catch block to handle any errors
}) // Close the PUT block

app.put('/markUnComplete', (request, response) => { // Start a PUT (update) method when the "/markUnComplete" route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Look in the database for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false // Set completed to false
          }
    },{
        sort: {_id: -1}, // Moves item to the bottom of the list
        upsert: false // Prevents insertion if item does not already exist
    }) // Closes updateOne method
    .then(result => { // If update is successful, then do something
        console.log('Marked Complete') // Log successful completion message to the console
        response.json('Marked Complete') // Sends a response back to the sender
    }) // Close .then block
    .catch(error => console.error(error)) // Start a catch block to handle any errors
}) // Close the PUT block

app.delete('/deleteItem', (request, response) => { // Start a DELETE (delete) method when the "/deleteItem" route is passed in
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // Look inside the todos collection for the ONE item that has a matching name from our JS file
    .then(result => { // If delete is successful, then do something
        console.log('Todo Deleted') // Log successful deletion message to the console
        response.json('Todo Deleted') // Sends a response back to the sender
    }) // Close .then block
    .catch(error => console.error(error)) // Start a catch block to handle any errors
}) // Close the DELETE block

app.listen(process.env.PORT || PORT, ()=>{ // Specifying which port we will be listening on - either the port in the .env file or the port variable previously set
    console.log(`Server running on port ${PORT}`) // Log the running port to the console
}) // Close the listen method
