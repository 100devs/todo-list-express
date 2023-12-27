// Import required modules
const express = require('express') // Import Express.js framework
const app = express() // Create an Express application
const MongoClient = require('mongodb').MongoClient // Import MongoClient from MongoDB
const PORT = 2121 // Set the port number
require('dotenv').config() // Load environment variables from a .env file


let db,
    dbConnectionStr = process.env.DB_STRING, // Retrieve MongoDB connection string from environment variables
    dbName = 'todo' // Set the name of the MongoDB database ('todo')

    // Connect to the MongoDB database using MongoClient
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`) // Log successful connection to the database
        db = client.db(dbName) // Set 'db' to the connected database
    })
  
 
app.set('view engine', 'ejs')// Set the view engine for rendering templates to 'ejs' 
app.use(express.static('public')) // Serve static files from the 'public' directory
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies for form data
app.use(express.json())// Parse JSON bodies

// Handle GET request at the root URL ('/')
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray() // Fetch all todoItems from the 'todos' collection and count incomplete items
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Render 'index.ejs' template with retrieved data
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    db.collection('todos').find().toArray()
    .then(data => {
        db.collection('todos').countDocuments({completed: false})
        .then(itemsLeft => {
            response.render('index.ejs', { items: data, left: itemsLeft })
        })
    })
    .catch(error => console.error(error))
})

// Handle POST request to add a new todo item
app.post('/addTodo', (request, response) => {
    // Insert a new todoItem into the 'todos' collection with completed status as false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')// Log successful addition of a new todo item
        response.redirect('/') // Redirect to the root URL after adding the item or refresh page
    })
    .catch(error => console.error(error))
})

// Handle PUT request to mark a todo item as complete
app.put('/markComplete', (request, response) => {
    // Update a todoItem to mark it as completed based on the provided itemFromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete') // Log successful marking of an item as complete
        response.json('Marked Complete') // Respond with a JSON message
    })
    .catch(error => console.error(error))

})

// Handle PUT request to mark a todo item as incomplete
app.put('/markUnComplete', (request, response) => {
    // Update a todoItem to mark it as incomplete based on the provided itemFromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete') // Log successful marking of an item as complete
        response.json('Marked Complete') // Respond with a JSON message
    })
    .catch(error => console.error(error))

})

// Handle DELETE request to delete a todo item
app.delete('/deleteItem', (request, response) => {
    // Delete a todoItem based on the provided itemFromJS
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted') // Log successful deletion of a todo item
        response.json('Todo Deleted') // Respond with a JSON message
    })
    .catch(error => console.error(error))

})

// Start the server on the specified port or a default port (process.env.PORT || PORT)
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`) // Log server start
})