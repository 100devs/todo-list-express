// Imports Express framework
const express = require('express')
// Initializes the express application
const app = express()
// Imports MongoDO client
const MongoClient = require('mongodb').MongoClient
// Defines the port number server will listen on
const PORT = 2121
// 
require('dotenv').config()

// Initializes db variable
let db,
    // Retrieves the MongoDB connecting string from environment variables and sets it
    dbConnectionStr = process.env.DB_STRING,
    // Sets name of database
    dbName = 'todo'

// Connects to the MongoDB database using the connecting string
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // Beginning of connection logic/promise handling for successful connection
    .then(client => {
        // Logs successful database connection
        console.log(`Connected to ${dbName} Database`)
        // Sets db variable as the connected database
        db = client.db(dbName)
    })

// Sets the view engine for rending EJS templates
app.set('view engine', 'ejs')
// Serves statis files from the "public" dir
app.use(express.static('public'))
// Middleware function parses URL encoded data to make it available in req.body
app.use(express.urlencoded({ extended: true }))
// Middleware function parses JSON data to make it available in req.body
app.use(express.json())


// Handles get requests to the root URL
app.get('/',async (request, response)=>{
    // Retrieves all todo list items from the db and stores them in an array
    const todoItems = await db.collection('todos').find().toArray()
    // Counts the number of todo items that are not completed and sets that number in a variable
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Renders the index.ejs template with this data
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

// Handles post requests to add a new todo item
app.post('/addTodo', (request, response) => {
    // Inserts a new todo item with completed set to false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        // Logs successful addition of a new todo item
        console.log('Todo Added')
        // Redirects back to the root URL
        response.redirect('/')
    })
    // Handles/logs any errors that occur
    .catch(error => console.error(error))
})

// Handles put requests to mark a todo item as complete
app.put('/markComplete', (request, response) => {
    // Finds the specified todo list item
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Sets the "completed" field of the found todo item to "true"
        $set: {
            completed: true
          }
    },{
        // Sorts the update operation by _id field in descending order
        sort: {_id: -1},
        // Disables the creation of a new document if no match is found
        upsert: false
    })
    .then(result => {
        // Logs a message indicating successful completion
        console.log('Marked Complete')
        // Sends a JSON response indicating successful completion
        response.json('Marked Complete')
    })
    // Handles any errors that occur during the update operation
    .catch(error => console.error(error))

})

// Handles put requests to mark a todo item as uncomplete
app.put('/markUnComplete', (request, response) => {
    // Finds the specified todo list item
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Sets the "completed" field of the found todo item to "false"
        $set: {
            completed: false
          }
    },{
        // Sorts the update operation by _id field in descending order
        sort: {_id: -1},
        // Disables the creation of a new document if no match is found
        upsert: false
    })
    .then(result => {
         // Logs a message indicating successful completion
        console.log('Marked Complete')
        // Sends a JSON response indicating successful completion
        response.json('Marked Complete')
    })
    // Handles any errors that occur during the update operation
    .catch(error => console.error(error))

})

// Handles delete requests to delete a todo item
app.delete('/deleteItem', (request, response) => {
    // Deletes a specified todo list item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        // Logs successful deletion of a todo item
        console.log('Todo Deleted')
        // Sends a JSON response
        response.json('Todo Deleted')
    })
    // Handles any errors that occur
    .catch(error => console.error(error))

})

// Starts the server and listens on the port defined in the .env, or at the top of server.js
app.listen(process.env.PORT || PORT, ()=>{
    // Logs the port where the server is running
    console.log(`Server running on port ${PORT}`)
})