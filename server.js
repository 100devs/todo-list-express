const express = require('express') // declares a constant variable to to require express framework allowing express to be used
const app = express() // ties app variable to express function call
const MongoClient = require('mongodb').MongoClient // sets up connection to database in MongoClient variable
const PORT = 2121 // defines variable for the port number
require('dotenv').config() // sets up dotenv to allow use of .env files


let db,     // declaring a let variable of db with no value
    dbConnectionStr = process.env.DB_STRING, // declaring a variable for the connection URL to the database linked to the .env file
    dbName = 'todo' // declaring a variable to store the name of the database that will be used

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connect method used to connect to the database, using the db connection string with useUnifiedTopology property
    .then(client => {   // waits for successful connection to the database then runs the following code
        console.log(`Connected to ${dbName} Database`) // logs a message in the console to show that the db connection is successful
        db = client.db(dbName) // assigning client database value to previously delared global let variable
    }) // end of then method code block

// Setting up middleware    
app.set('view engine', 'ejs')   // sets EJS as the renderer
app.use(express.static('public'))   // sets up public folder for static assets
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLs when the header and content match (supports arrays and objects)
app.use(express.json()) // parses JSON content from incoming requests


app.get('/',async (request, response)=>{ // uses GET method to retrieve the root page of the website and sets up req/res parameters
    const todoItems = await db.collection('todos').find().toArray() // defines a constant variable to await all items from todo collection in an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // defines a constant variable to counts the documents in the todos collection that are not completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // renders the EJS file index.ejs and plugs in todoItems and itemsLeft data from the database
    // Previously commented out code (does same as above with promise chains)
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) // end of get method for root dir

app.post('/addTodo', (request, response) => { // starts the POST method to allow new todos documents to be created using the addTodo route, req/res params
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts one new item into the database using the data from the EJS form with the name attribute "todoItem", completed = false because it is a new item
    .then(result => { // after last step is fulfilled, runs following code
        console.log('Todo Added') // logs message to the server to validate operation was successful
        response.redirect('/') // redirects user to root dir to allow new items to render
    }) // end of .then code block
    .catch(error => console.error(error)) // logs error message to console if request is rejected
}) // end of POST method

app.put('/markComplete', (request, response) => { // starts PUT method to update completed property of todo items to mark them as completed using the /markComplete route
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // checks the database for one item with matching "thing" value, and updates the value in the database
        $set: { // mongodb method to toggle a value
            completed: true // updates completed property to true
          } // end of set code
    },{
        sort: {_id: -1}, // moves item to the end of the list
        upsert: false    // prevents insertion of item if it isn't present already
    })
    .then(result => { // starts a then process if previous code was fulfilled successfully
        console.log('Marked Complete') // logs a status message to the console upon successful completion
        response.json('Marked Complete') // sends a response back to sender
    }) // end of .then code
    .catch(error => console.error(error)) // logs error message to console if request is rejected
}) // end of first PUT method

app.put('/markUnComplete', (request, response) => { // starts PUT method to update completed property of todo items to mark them as not completed using the /markUncomplete route
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // checks the database for one item with matching "thing" value, and updates the value in the database
        $set: { // mongodb method to toggle a value
            completed: false // updates completed property to true
          } // end of set code
    },{
        sort: {_id: -1}, // moves item to the end of the list
        upsert: false   // prevents insertion of item if it isn't present already
    })
    .then(result => { // starts a then process if previous code was fulfilled successfully
        console.log('Marked UnComplete') // logs a status message to the console upon successful completion
        response.json('Marked UnComplete') // sends a response back to sender
    }) // end of .then code
    .catch(error => console.error(error)) // logs error message to console if request is rejected
}) // end of second PUT method

app.delete('/deleteItem', (request, response) => { // starts DELETE method to delete todo items using the /deleteItem route
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // checks the todos collection for the matching "thing" from the main.js file
    .then(result => { // starts a then process if previous code was fulfilled successfully
        console.log('Todo Deleted') // logs a status message to the console upon successful completion
        response.json('Todo Deleted') // sends a response back to sender
    }) // end of .then code
    .catch(error => console.error(error)) // logs error message to console if request is rejected
}) // end of DELETE method

app.listen(process.env.PORT || PORT, ()=>{ // sets up which port is used to listen to requests, uses environment variable if .env file exists
    console.log(`Server running on port ${PORT}`) // logs the port number to the console if connection is successful
}) // end of listen method
