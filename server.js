
// Imports the Express framework
const express = require('express')

// Creates an Express application
const app = express()

// Imports the MongoDB client
const MongoClient = require('mongodb').MongoClient

// Sets the default port for the server
const PORT = 2121

// Loads environment variables from the .env file
require('dotenv').config()

// Creates variables for the database connection and database name
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// Connects the application to MongoDB using the connection string
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        // Displays a message when the database connection is successful
        console.log(`Connected to ${dbName} Database`)

        // Selects the todo database
        db = client.db(dbName)
    })

// Sets EJS as the view engine for rendering HTML pages
app.set('view engine', 'ejs')

// Serves static files such as CSS and JavaScript from the public folder
app.use(express.static('public'))

// Allows the server to receive data from HTML forms
app.use(express.urlencoded({ extended: true }))

// Allows the server to receive JSON data
app.use(express.json())

// GET route for the home page
app.get('/', async (request, response) => {

    // Gets all to-do items from the todos collection
    const todoItems = await db.collection('todos').find().toArray()

    // Counts how many to-do items are not completed
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false })

    // Renders the index.ejs page and sends the to-do items and count to it
    response.render('index.ejs', { items: todoItems, left: itemsLeft })

    // Older version of the code that used promises instead of async/await
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// POST route for adding a new to-do item
app.post('/addTodo', (request, response) => {

    // Adds the new to-do item to the todos collection
    // New items start with completed set to false
    db.collection('todos').insertOne({
        thing: request.body.todoItem,
        completed: false
    })

    .then(result => {
        // Displays a message when the to-do item is added
        console.log('Todo Added')

        // Redirects the user back to the home page
        response.redirect('/')
    })

    .catch(error => console.error(error))
})

// PUT route for marking a to-do item as complete
app.put('/markComplete', (request, response) => {

    // Finds the selected to-do item and changes completed to true
    db.collection('todos').updateOne(
        { thing: request.body.itemFromJS },
        {
            $set: {
                completed: true
            }
        },
        {
            sort: { _id: -1 },
            upsert: false
        }
    )

    .then(result => {
        // Displays a message when the item is marked complete
        console.log('Marked Complete')

        // Sends a response back to the JavaScript in the browser
        response.json('Marked Complete')
    })

    .catch(error => console.error(error))
})

// PUT route for marking a completed to-do item as incomplete
app.put('/markUnComplete', (request, response) => {

    // Finds the selected to-do item and changes completed back to false
    db.collection('todos').updateOne(
        { thing: request.body.itemFromJS },
        {
            $set: {
                completed: false
            }
        },
        {
            sort: { _id: -1 },
            upsert: false
        }
    )

    .then(result => {
        // Displays a message when the item is marked incomplete
        console.log('Marked Complete')

        // Sends a response back to the JavaScript in the browser
        response.json('Marked Complete')
    })

    .catch(error => console.error(error))
})

// DELETE route for deleting a to-do item
app.delete('/deleteItem', (request, response) => {

    // Finds and deletes the selected to-do item
    db.collection('todos').deleteOne({
        thing: request.body.itemFromJS
    })

    .then(result => {
        // Displays a message when the item is deleted
        console.log('Todo Deleted')

        // Sends a response back to the JavaScript in the browser
        response.json('Todo Deleted')
    })

    .catch(error => console.error(error))
})

// Starts the Express server
app.listen(process.env.PORT || PORT, () => {

    // Displays the port where the server is running
    console.log(`Server running on port ${PORT}`)
})
