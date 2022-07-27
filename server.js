// Import express
const express = require('express')

// Declare variable to reference express
const app = express()

// Import MongoClient
const MongoClient = require('mongodb').MongoClient

// Declare PORT variable
const PORT = 2121

// Require .env file for environment variables
require('dotenv').config()

// Declare database variables
let db,
    dbConnectionStr = process.env.DB_STRING, // Grab DB_STRING from .env file
    dbName = 'todo' // Collection name

// Connect to database    
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`) // Log to console after successfull connection
        db = client.db(dbName) // Create/Use the todo database
    })
    
// Set Middleware    
app.set('view engine', 'ejs') // Use ejs to render the page
app.use(express.static('public')) // Use public folder
app.use(express.urlencoded({ extended: true })) // Handle URLs 
app.use(express.json()) // Handle JSON data

// Define GET request for root/default endpoint
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray() // Grabs existing items in databse and stores it as an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // Count number of documents with completed property set to false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // Send todoItems and itemsLeft to index.ejs to use and render the page

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// Define POST request for addTodo
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // In todos collection add one document with values added by the user in the form
    .then(result => {
        console.log('Todo Added') // Log after successfully adding the document to db
        response.redirect('/') // Reload the page to see the updated results
    })
    .catch(error => console.error(error)) // Catch any errors that might occur 
})

// Define a PUT request to mark an item as completed
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Find document that matches the thing property with the value of whichever item the user clicked
        $set: {
            completed: true // set completed property to true
          }
    },{
        sort: {_id: -1}, //sort the collection
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete') // Log after successfully updating 
        response.json('Marked Complete') // Respond with 'Marked Complete'
    })
    .catch(error => console.error(error)) // Catch any errors

})

// Define a PUT request to mark an item as uncompleted
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false //Same as above but this time setting the completed property to false
          } 
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked UnComplete')
        response.json('Marked UnComplete')
    })
    .catch(error => console.error(error))

})

// Define a DELETE request to delete one item form database
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //Find the item user clicked and delete it
    .then(result => {
        console.log('Todo Deleted') // Log after successfully deleting
        response.json('Todo Deleted') // Respond with 'todo deleted'
    })
    .catch(error => console.error(error)) //catch any errors

})

// Create server and listen for requests 
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})