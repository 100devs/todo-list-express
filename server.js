// Import the express module
const express = require('express')
// Assign the express method to the 'app' variable
const app = express()
// Assign MongoClient module to a variable to use its associated methods and communicate with the connected database
const MongoClient = require('mongodb').MongoClient
// Declare a variable to define the port location where the server is listening
const PORT = 2121
// Allow access to variables inside .env
require('dotenv').config()

// Declare a variable (no value assigned)
let db,
    // Declare a variable and assign the designated database connection string from .env
    dbConnectionStr = process.env.DB_STRING,
    // Declare a variable and assign the name of the designated database to be used
    dbName = 'todo'

// Establish MongoDB connection and pass in the connection string alongside an additional property
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // Pass in all 'client' information once connection is established
    .then(client => {
        // Console log a template literal, confirming the successful database connection
        console.log(`Connected to ${dbName} Database`)
        // Assign a database client factory method to previously declared 'db' variable
        db = client.db(dbName)
    // Close 'then' method
    })

// MIDDLEWARE
// Set EJS as the default render method
app.set('view engine', 'ejs')
// Set the location for static assets
app.use(express.static('public'))
// Use express to decode and encode URLs where the header matches the content, supporting arrays and objects
app.use(express.urlencoded({ extended: true }))
// Parse JSON content from incoming requests
app.use(express.json())

// Define a route handler with req/res parameters for the GET request to the root route of the URL
app.get('/',async (request, response)=>{
    // Declare a variable that awaits all items from the 'todos' database collection
    const todoItems = await db.collection('todos').find().toArray()
    // Declare a variable that awaits a count of documents (whose 'completed' property is set to false) to later display in EJS
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Render the EJS file with the key/value pairs of all database items, including the incomplete 'itemsLeft'
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // Establish 'catch' method to console log any errors returned from the GET request
    .catch(error => console.error(error))
// End GET method
})

// Define a route handler with req/res parameters for the POST request to the '/addTodo' route of the URL
app.post('/addTodo', (request, response) => {
    // Insert new item into database collection with the 'completed' property set to false by default
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // Pass the result as a parameter upon completion of POST request
    .then(result => {
        // Console log a message, confirming successful completion of POST request
        console.log('Todo Added')
        // Remove '/addTodo' route and redirect to root route of the URL
        response.redirect('/')
    // Close 'then' method
    })
    // Establish 'catch' method to console log any errors returned from the POST request
    .catch(error => console.error(error))
// End POST method
})

// Define a route handler with req/res parameters for the PUT request to the '/markComplete' route of the URL
app.put('/markComplete', (request, response) => {
    // Search database for item matching the same name of the item passed in from main.js that was clicked on
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Replace the value of a field to a specified value
        $set: {
            // Set 'completed' property to true
            completed: true
        // Close '$set' operator
        }
    },{
        // Move item to bottom of list
        sort: {_id: -1},
        // Prevent insertion of new item in database to avoid duplicate documents
        upsert: false
    })
    // Pass the result as a parameter upon completion of PUT request
    .then(result => {
        // Console log a message, confirming successful completion of PUT request
        console.log('Marked Complete')
        // Send the same, successful response back to sender
        response.json('Marked Complete')
    // Close 'then' method
    })
    // Establish 'catch' method to console log any errors returned from the PUT request
    .catch(error => console.error(error))
// End PUT method
})

// Define a route handler with req/res parameters for the PUT request to the '/markUnComplete' route of the URL
app.put('/markUnComplete', (request, response) => {
    // Search database for item matching the same name of the item passed in from main.js that was clicked on
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Replace the value of a field to a specified value
        $set: {
            // Set 'completed' property to false
            completed: false
        // Close '$set' operator
        }
    },{
        // Move item to bottom of list
        sort: {_id: -1},
        // Prevent insertion of new item in database to avoid duplicate documents
        upsert: false
    })
    // Pass the result as a parameter upon completion of PUT request
    .then(result => {
        // Console log a message, confirming successful completion of PUT request
        console.log('Marked Complete')
        // Send the same, successful response back to sender
        response.json('Marked Complete')
    // Close 'then' method
    })
    // Establish 'catch' method to console log any errors returned from the PUT request
    .catch(error => console.error(error))
// End PUT method
})

// Define a route handler with req/res parameters for the DELETE request to the '/deleteItem' route of the URL
app.delete('/deleteItem', (request, response) => {
    // Search database for item matching the same name of the item passed in from main.js that was clicked on
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // Pass the result as a parameter upon completion of DELETE request
    .then(result => {
        // Console log a message, confirming successful completion of DELETE request
        console.log('Todo Deleted')
        // Send the same, successful response back to sender
        response.json('Todo Deleted')
    // Close 'then' method
    })
    // Establish 'catch' method to console log any errors returned from the DELETE request
    .catch(error => console.error(error))
// End DELETE method
})

// Set up listening port (default to declared 'PORT' variable unless another port is specified inside .env)
app.listen(process.env.PORT || PORT, ()=>{
    // Console log a template literal, confirming the successful server connection
    console.log(`Server running on port ${PORT}`)
// End LISTEN method
})