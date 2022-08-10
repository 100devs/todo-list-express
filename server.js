// Making it possible to use express in this file
const express = require('express')
// Crete app var and assigning it to the instance of express
const app = express()
// Makes it possible to use methods associated with MongoClient
// and talk to our DB
const MongoClient = require('mongodb').MongoClient
// Set our PORT constant to define the location where our server will be 
// listening for requests
const PORT = 2121
// Allows us to look for variables inside of our .env file
require('dotenv').config()

// Declaring global db variable
let db,
    // Declaring dbConnectionStr and setting it to our db string in .env file
    dbConnectionStr = process.env.DB_STRING,
    // Declare a var and assigning to it the name of the database
    // we will be using
    dbName = 'todo'


// Creating a connection to Mongodb and passing in our connection string
// Also passing in an additional property
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // Waiting for the connection and then proceeding if successful
    // and also passing in all the client information returned from 
    // previous promise
    .then(client => {
        // Loggin to console the database we connected to 
        console.log(`Connected to ${dbName} Database`)
        // Assign to the previously declared db variable the value that
        // contains a db client factory method
        db = client.db(dbName)
    // Closing our .then
    })
    
// Middleware
// Set view engine to ejs, how we expect our stuff to be rendered
app.set('view engine', 'ejs')
// Sets the location for static assets as the public directory
app.use(express.static('public'))
// Tells express to decode and encode URLs where the header
// matched the content. Supports arrays and objects
app.use(express.urlencoded({ extended: true }))
// Parses JSON conent
app.use(express.json())

// Starts a GET method when the root rout is passed in, sets up req and 
// res parameters
app.get('/',async (request, response)=>{
    // Sets a variable and assign it the list of all documents in the 'todos' collection
    const todoItems = await db.collection('todos').find().toArray()
    // Sets a variable and assing it the number of documents that have their completed 
    // property set to false, which means that they are still uncomplete
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Render our index.ejs and pass back the list of all documents and the 
    // number of uncomplete tasks left
    response.render('index.ejs', { items: todoItems, left: itemsLeft })


    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))


})

// Starts a POST method when the addTodo route is passed in
app.post('/addTodo', (request, response) => {
    // Inserts a new item into the todos collection. This item has two keys:
    // thing gets the value of the stuff inside the form input, and completed gets
    // the value of false 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // If insert is successful, then do something
    .then(result => {
        // Log to console
        console.log('Todo Added')
        // Gets rid of the /addTodo route in the browser and redirects 
        // back to the homepage
        response.redirect('/')
    // Closing the .then
    })
    // Catching errors
    .catch(error => console.error(error))
// Ending POST
})


// Start a PUT method when the markComplete route is passed in
app.put('/markComplete', (request, response) => {
    // Look in the database collection for one item matching the name
    // of the item passed in from the main.js file that was clicked on
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Update the completed value to true
        $set: {
            completed: true
          }
        // Puts items in descending order and prevents insertion if item
        // doesn't already exist
    },{
        sort: {_id: -1},
        upsert: false
    })
    // Starts a .then if update was successful
    .then(result => {
        // Logging successful completion
        console.log('Marked Complete')
        // Sending a response back to the sender
        response.json('Marked Complete')
    // close .then
    })
    // Catch errors
    .catch(error => console.error(error))
// Ending PUT
})


// Start a PUT method when the markUnComplete route is passed in
app.put('/markUnComplete', (request, response) => {
    // Look in the database collection for one item matching the name
    // of the item passed in from the main.js file that was clicked on
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Update the completed value to true
        $set: {
            completed: false
          }
    // Puts items in descending order and prevents insertion if item
    // doesn't already exist
    },{
        sort: {_id: -1},
        upsert: false
    })
    // Starts a .then if update was successful
    .then(result => {
        // Logging successful completion
        console.log('Marked Complete')
        // Sending a response back to the sender
        response.json('Marked Complete')
    // close .then
    })
    // Catch errors
    .catch(error => console.error(error))
// Ending PUT
})


// Start a DELETE method when the deleteItem route is passed in
app.delete('/deleteItem', (request, response) => {
    // Look for ONE item in the database collection that matches the name
    // from our main.js file and remove it from the collection
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // Starts a .then if delete was successful
    .then(result => {
        // Logging successful completion
        console.log('Todo Deleted')
        // Sending a response back to the sender
        response.json('Todo Deleted')
    // close .then
    })
    // Catch errors
    .catch(error => console.error(error))
// Ending DELETE
})


// Specifying which PORT the server should be listening on and either gets
// the one from the .env file if it exists and if not it just uses the global
// PORT constant
app.listen(process.env.PORT || PORT, ()=>{
    // Logs which port our server is running on
    console.log(`Server running on port ${PORT}`)
})