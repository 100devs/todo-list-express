// Import the express module
const express = require('express')
// Create express application
const app = express()
// Import MongoDB client
const MongoClient = require('mongodb').MongoClient
// Declaring local port where server is listening
const PORT = 2121
// Import and configure dotenv
require('dotenv').config()

// Declare variable for the database
let db,
    // Declare variable to hold the connection string from the .env file
    dbConnectionStr = process.env.DB_STRING,
    // Declare variable for the name of the collection in the database
    dbName = 'todo'

// Connect to MongoDB with the database connection string
// Set useUnifiedTopology to true 
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // Response from MongoDB
    .then(client => {
        // Console log to confirm connection to database collection
        console.log(`Connected to ${dbName} Database`)
        // Assign db variable the collection in the database
        db = client.db(dbName)
    })

// Middleware
// Set template engine to use ejs as a template file    
app.set('view engine', 'ejs')
// Gives express access to the public folder
app.use(express.static('public'))
// Parse incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: true }))
// Parse incoming JSON requests
app.use(express.json())

// Fetch data from database 
app.get('/',async (request, response)=>{
    // Set variable to find all todo items from the database and put them in an array
    const todoItems = await db.collection('todos').find().toArray()
    // Set variable to return the count of uncompleted items in the database
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Renders todoItems and itemsLeft into the ejs file
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

// Send data to the database to create a todo item
app.post('/addTodo', (request, response) => {
    // Insert uncompleted todoItem from form input in ejs file
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // Response from MongoDB
    .then(result => {
        // Console log to confirm the todoItem was added to the database successfully
        console.log('Todo Added')
        // Redirect the DOM to index.ejs
        response.redirect('/')
    })
    // If the POST fails, console log error
    .catch(error => console.error(error))
})

// Update data when marked as completed
app.put('/markComplete', (request, response) => {
    // Update item in database when completed
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Set operator
        $set: {
            // Replace value of completed field with true
            completed: true
          }
    },{
        // Sort items in descending order
        sort: {_id: -1},
        // Do not upsert (update + insert)
        upsert: false
    })
    // Response from MongoDB
    .then(result => {
        // Console log to confirm the item was marked as complete
        console.log('Marked Complete')
        // Return a JSON object 'Marked Complete'
        response.json('Marked Complete')
    })
    // If PUT fails, console log error
    .catch(error => console.error(error))
})

// Update data when marked as uncompleted
app.put('/markUnComplete', (request, response) => {
    // Update item in database when marked uncompleted
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Set operator
        $set: {
            // Replace value of completed field with false
            completed: false
          }
    },{
        // Sort items in descending order
        sort: {_id: -1},
        // Do not upsert (update + insert)
        upsert: false
    })
    // Response from MongoDB
    .then(result => {
        // Console log to confirm the item was marked as uncomplete (is 'Marked Complete' a typo?)
        console.log('Marked Complete')
        // Return JSON object 'Marked Complete' (probably should be 'Marked Uncomplete'?)
        response.json('Marked Complete')
    })
    // If PUT fails, console log error
    .catch(error => console.error(error))
})

// Delete item from database
app.delete('/deleteItem', (request, response) => {
    // Delete one item from the database
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // Response from MongoDB
    .then(result => {
        // Console log to confirm item was deleted
        console.log('Todo Deleted')
        // Return JSON object 'Todo Deleted'
        response.json('Todo Deleted')
    })
    // If DELETE fails, console log error
    .catch(error => console.error(error))
})

// Set port for server to listen on
app.listen(process.env.PORT || PORT, () => {
    // Console log to confirm which port the server is running on
    console.log(`Server running on port ${PORT}`)
})