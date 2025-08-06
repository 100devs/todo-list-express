// import express framework
const express = require('express')
// create express application instance
const app = express()
// import MongoDB client for database operations
const MongoClient = require('mongodb').MongoClient
// set local port to 2121
const PORT = 2121
// import environment variables from .env file
require('dotenv').config()

// database connection variables
let db,
    // connection string stored securely in environment variables
    dbConnectionStr = process.env.DB_STRING,
    // set database name to 'todo'
    dbName = 'todo'

// connect to MongoDB database using connection string
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        // log successful database connection
        console.log(`Connected to ${dbName} Database`)
        // assign database instance for use throughout app
        db = client.db(dbName)
    })
   
// configure EJS as the templating engine
app.set('view engine', 'ejs')
// serve static files (CSS, JS, images) from public folder
app.use(express.static('public'))
// middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }))
// middleware to parse JSON request bodies
app.use(express.json())

// GET request for home page route
app.get('/',async (request, response)=>{
    // fetch all todo items from database as array
    const todoItems = await db.collection('todos').find().toArray()
    // count incomplete todo items (completed: false)
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // render index page with todo data
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // catch any errors (Note: this should be in a try-catch block)
    .catch(error => console.error(error))
})

// POST request to add new todo item (connected to addTodo form)
app.post('/addTodo', (request, response) => {
    // insert new todo with text from form and completed status false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        // log successful addition
        console.log('Todo Added')
        // redirect to home page to show updated list
        response.redirect('/')
    })
    // catch and log any errors
    .catch(error => console.error(error))
})

// PUT request to mark todo item as completed (linked to markComplete function in main.js)
app.put('/markComplete', (request, response) => {
    // find todo item by name and update completed status to true
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // set completed property to true
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1}, // sort by newest first (descending order by _id)
        upsert: false    // don't create new document if no match found
    })
    .then(result => {
        // log successful completion
        console.log('Marked Complete')
        // send JSON response to client
        response.json('Marked Complete')
    })
    // catch and log any errors
    .catch(error => console.error(error))

})

// PUT request to mark item as incomplete (linked to markUnComplete function in main.js)
app.put('/markUnComplete', (request, response) => {
    // find todo item by name and update completed status to false
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // set completed property to false
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1}, // sort by newest first (descending order by _id)
        upsert: false    // don't create new document if no match found
    })
    .then(result => {
        // log successful update
        console.log('Marked Incomplete')
        // send JSON response to client
        response.json('Marked Incomplete')
    })
    // catch and log any errors
    .catch(error => console.error(error))

})

// DELETE request to remove todo item (linked to deleteItem function in main.js)
app.delete('/deleteItem', (request, response) => {
    // find and delete todo item by name
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        // log successful deletion
        console.log('Todo Deleted')
        // send JSON response to client
        response.json('Todo Deleted')
    })
    // catch and log any errors
    .catch(error => console.error(error))

})

// start server on environment port or default port 2121
app.listen(process.env.PORT || PORT, ()=>{
    // log server startup confirmation
    console.log(`Server running on port ${PORT}`)
})