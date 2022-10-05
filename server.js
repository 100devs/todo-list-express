// Import express
const express = require('express')
// Assign app as an instance of express
const app = express()
// import MongoClient from mongodb
const MongoClient = require('mongodb').MongoClient
// Set the port number the server should listen to 
const PORT = 2121
// Import dotenv to access private credentials
require('dotenv').config()
 
// Instantiate variables
let db, 
    dbConnectionStr = process.env.DB_STRING, // Access private DB_STRING value
    dbName = 'todo' // Declare database name 
 
// Make a connection to Mongo Database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        // On succesful connection log message   
        console.log(`Connected to ${dbName} Database`)
        // Assign MongoDb db (database) constructor to previously delcare variable    
        db = client.db(dbName) 
    })
 
// Set ejs as the default view engine
app.set('view engine', 'ejs') 
// Serve static files/assets from public directory
app.use(express.static('public'))
// Parse json data from HTML form
app.use(express.urlencoded({ extended: true }))
// Parse json data from POST & PUT request
app.use(express.json())
 
// Instantiate root route for displaying all todos
app.get('/', async (request, response) => {
    // Get all todo items from database
    const todoItems = await db.collection('todos').find().toArray()
    // Filter todos that are not completed
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Render index ejs with data from database
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
 
// Instantiate '/addTodo' route for creating todo item
app.post('/addTodo', (request, response) => {
    // Add new todo item with completed as 'false' to 'todos' collection
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        // On success: Log message
        console.log('Todo Added')
        // Redirect to root route
        response.redirect('/')
    })
    .catch(error => console.error(error))
})
 
// Instantiate '/markComplete' route for updating todo item as completed
app.put('/markComplete', (request, response) => {
    // Find todo item with the same content in database to update
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Set completed as true
        $set: {
            completed: true
          }
    },{
        // Reorder item to the bottom of the list
        sort: {_id: -1},
        // Prevent insertion if item doesn't exist
        upsert: false
    })
    .then(result => {
        // On success: Log message
        console.log('Marked Complete')
        // Send response back to client
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))
 
})
 
// Instantiate '/markUnComplete' route for updating todo item as incomplete
app.put('/markUnComplete', (request, response) => {
    // Find todo item with the same content in database to update
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Set completed as false
        $set: {
            completed: false
          }
    },{
        // Reorder item to the bottom of the list
        sort: {_id: -1},
        // Prevent insertion if item doesn't exist
        upsert: false
    })
    .then(result => {
        // On success: Log message
        console.log('Marked Complete')
        // Send response back to client
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))
 
})
 
// Instantiate '/deleteItem' route for removing todo item
app.delete('/deleteItem', (request, response) => {
    // Find and delete todo item with the same content in 'todos' collection
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        // On success: Log message
        console.log('Todo Deleted')
        // Send response back to client
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))
 
})
 
// Start a server and listen on either the ENV PORT number or the port we created above
app.listen(process.env.PORT || PORT, ()=>{
    // Log the port number the server is listening on     
    console.log(`Server running on port ${PORT}`)
})