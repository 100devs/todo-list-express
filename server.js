const express = require('express') // Import Express library
const app = express() // Initialize Express app
const MongoClient = require('mongodb').MongoClient // Import MongoClient for MongoDB
const PORT = 2121 // Default port for server
require('dotenv').config() // Load environment variables from .env file


let db,
    dbConnectionStr = process.env.DB_STRING, // MongoDB connection string from environment
    dbName = 'todo' // Name of the database

// Connect to MongoDB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) // Assign the connected database to variable
    })
    
app.set('view engine', 'ejs') // Set EJS as the templating engine
app.use(express.static('public')) // Serve static files from 'public' folder
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies (from HTML forms)
app.use(express.json()) // Parse JSON bodies

// GET route for home page
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray() // Fetch all todo items from 'todos' collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // Count how many items are not completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft })  // Render index.ejs with the todo items and remaining count

    // Old promise-based approach (commented out)
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// POST route to add a new todo
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // Add a new todo to the database, initially not completed
    .then(result => {
        console.log('Todo Added')
        response.redirect('/') // Redirect back to home page
    })
    .catch(error => console.error(error)) // Catch and log any errors
})

// PUT route to mark a todo as complete
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne(
        { thing: request.body.itemFromJS }, // Find item by text
        { $set: { completed: true } }, // Set completed to true
        { sort: { _id: -1 }, upsert: false} // Update latest item, do not create if missing
    )
    .then(result => {
        console.log('Marked Complete') // Log to the server console that the item was marked complete
        response.json('Marked Complete') // Send a JSON response back to the client confirming the update
    })
    .catch(error => console.error(error)) // Catch and log any errors

})

// PUT route to mark a todo as incomplete
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne(
        { thing: request.body.itemFromJS }, // Find item by text
        { $set: { completed: false } }, // Set completed to false
        { sort: { _id: -1 }, upsert: false } // Update latest item, do not create if missing
    )
    .then(result => {
        console.log('Marked Incomplete') //Log to the server console that the item was marked incomplete
        response.json('Marked Incomplete') // Send a JSON response back to the client confirming the update
    })
    .catch(error => console.error(error)) // Catch and log any errors

})

// DELETE route to remove a todo
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')  //Log to the server console that a todo item was successfully deleted
        response.json('Todo Deleted') // Respond with JSON message
    })
    .catch(error => console.error(error)) // Catch and log any errors

})

// Start the server
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})