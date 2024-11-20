// import the express library 
const express = require('express')
//  Create an instance of an Express application
const app = express()
// Import the MongoClient from the MongoDB library
const MongoClient = require('mongodb').MongoClient
// define the port
const PORT = 2121

// Load environment variables from a .env file into process.env
require('dotenv').config()

// Declare variables for the database connection and name
let db,
    dbConnectionStr = process.env.DB_STRING, // Connection string for MongoDB, stored in environment variable
    dbName = 'todo'  // Name of the database
// Connect to MongoDB using the connection string
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) // Assign the connected database instance to the variable 'db'
    })
    .catch(error => console.error(error)) // Catch any errors during connection
 
    // Set EJS as the templating engine
app.set('view engine', 'ejs')
// Serve static files from the 'public' directory
app.use(express.static('public'))
// Parse URL-encoded bodies (form submissions)
app.use(express.urlencoded({ extended: true }))
// Parse JSON bodies (incoming JSON requests)
app.use(express.json())

// Define a route to handle GET requests to the root URL
app.get('/', async (request, response) => {
     // Fetch all todo items from the 'todos' collection
    const todoItems = await db.collection('todos').find().toArray()
    // Count the number of incomplete todo items
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
      // Render the 'index.ejs' template with the fetched data
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
// Define a route to handle POST requests for adding a new todo item
app.post('/addTodo', (request, response) => {
     // Insert a new todo item into the 'todos' collection
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/') // Redirect to the root URL after adding the item
    })
    .catch(error => console.error(error))
})

// Define a route to handle PUT requests for marking a todo item as complete
app.put('/markComplete', (request, response) => {
       // Update the 'completed' field to true for the specified todo item
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
            
          }
    },{
        sort: {_id: -1},// Sort the documents in descending order by _id
        upsert: false // Do not insert a new document if no match is found
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete') // Send a JSON response
    })
    .catch(error => console.error(error))

})

// Define a route to handle PUT requests for marking a todo item as incomplete
app.put('/markUnComplete', (request, response) => {
    // Update the 'completed' field to false for the specified todo item
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1}, // Sort the documents in descending order by _id
        upsert: false // Do not insert a new document if no match is found
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete') // Send a JSON response
    })
    .catch(error => console.error(error))

})

// Define a route to handle DELETE requests for deleting a todo item
app.delete('/deleteItem', (request, response) => {
    // Delete the specified todo item from the 'todos' collection
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted') // Send a JSON response
    })
    .catch(error => console.error(error))

})
// Start the server and listen on the specified port
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})