// Import the express module
const express = require('express')
// Create an instance of an Express app
const app = express()
// Import the MongoClient from mongodb to interact with the database
const MongoClient = require('mongodb').MongoClient
// Define the default port for the server to listen on
const PORT = 2121
// Load environment variables from a .env file
require('dotenv').config()

// Declare variables for the database and connection string
let db,
    dbConnectionStr = process.env.DB_STRING, // Get the MongoDB connection string from .env
    dbName = 'todo' // Define the database name

// Connect to MongoDB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // Use unified topology to avoid warnings
    .then(client => {
        console.log(`Connected to ${dbName} Database`) // Log connection success
        db = client.db(dbName) // Store reference to the connected database
    })

// Set EJS as the templating engine
app.set('view engine', 'ejs')
// Serve static files (like CSS and JS) from the "public" folder
app.use(express.static('public'))
// Parse incoming request bodies (form data)
app.use(express.urlencoded({ extended: true }))
// Parse incoming JSON data
app.use(express.json())

// Handle GET request for the homepage
app.get('/', async (request, response) => {
    const todoItems = await db.collection('todos').find().toArray() // Fetch all to-do items
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false }) // Count items not completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // Render the EJS view with data

    // --- Alternative approach using .then() instead of async/await ---
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// Handle POST request to add a new to-do item
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false }) // Insert new item
    .then(result => {
        console.log('Todo Added') // Log success
        response.redirect('/') // Redirect back to homepage
    })
    .catch(error => console.error(error)) // Log any errors
})

// Handle PUT request to mark an item as completed
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne(
        { thing: request.body.itemFromJS }, // Match the item by its text
        { $set: { completed: true } }, // Set "completed" to true
        { sort: { _id: -1 }, upsert: false } // Sort and prevent upsert
    )
    .then(result => {
        console.log('Marked Complete') // Log success
        response.json('Marked Complete') // Send JSON response
    })
    .catch(error => console.error(error)) // Log any errors
})

// Handle PUT request to mark an item as uncompleted
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne(
        { thing: request.body.itemFromJS }, // Match the item by its text
        { $set: { completed: false } }, // Set "completed" to false
        { sort: { _id: -1 }, upsert: false } // Sort and prevent upsert
    )
    .then(result => {
        console.log('Marked Complete') // Still logs "Marked Complete" (could update message for clarity)
        response.json('Marked Complete') // Send JSON response
    })
    .catch(error => console.error(error)) // Log any errors
})

// Handle DELETE request to remove an item
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS }) // Delete the item
    .then(result => {
        console.log('Todo Deleted') // Log success
        response.json('Todo Deleted') // Send JSON response
    })
    .catch(error => console.error(error)) // Log any errors
})

// Start the server on the specified port
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`) // Log the port the server is running on
})
