// In order for functionality to be implemented more succinctly, this line is added so that express can be connected to the server
const express = require('express')
// Assigns th express method to the variable named "app"
const app = express()
// Creates a new Mongo client instance that connects server to MongoDB
const MongoClient = require('mongodb').MongoClient
// Assigns primary port number to access server on
const PORT = 2121
// Loads environment variables from an .env file into the actual process.env object.
require('dotenv').config()

// Creates the 3 different variables that will be needed throughout the server build.
let db,
    // Prepares for connection of the server to MongoDB client whilst giving privacy so that others cannot hack the server
    dbConnectionStr = process.env.DB_STRING,
    // Name of the database to be used throughout server connection
    dbName = 'todo'

// Actually connects the server to the MongoDB client    
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // Checks to see if client is connected to server
    .then(client => {
        // If so, then the template literal `Connected to [name of database] Database` will pop up in the console
        console.log(`Connected to ${dbName} Database`)
        // assigning database name to the db variable to be used whenever is needed
        db = client.db(dbName)
    })

// Express will load the module called "ejs" internally; to be used as a template
app.set('view engine', 'ejs')
// Express will then take ahold access of any and all folders/items that live within the public folder
app.use(express.static('public'))
// Causes server to recognize the incoming POST or PUT request object whichever data type applies 
app.use(express.urlencoded({ extended: true }))
// Causes server to recognize the incoming POST or PUT as a JSON object
app.use(express.json())

// The application starts from the root (or base) with an async function; parameters include "request" and "response"
app.get('/',async (request, response)=>{
    // Declares a variable named "todoItems" which contains awaited responses and stores collection to do items as an array.
    const todoItems = await db.collection('todos').find().toArray()
    // Defines a variable named "itemsLeft" which contains awaited responses; these items end up here when there are items left over; 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Displays items from the index.ejs files that fall in to the category of whats todo and what items are left.
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

// The application continues from the route of "/addTodo" whenever a post needs to be added; parameters include "request" and "response"
app.post('/addTodo', (request, response) => {
    // Calls on MongoDB collection called "Todos" and inserts a doc with a key called "thing" from the form in the index.ejs file; this takes place whenever an item is NOT completed (ergo the "completed: false")
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // The result is passed as a parameter
    .then(result => {
        // When added successfully, "Todo Added" will appear in the console
        console.log('Todo Added')
        // Will take users back home to the main (root) directory 
        response.redirect('/')
    })
    // If an error were to appear, it is checked for and message containing an error will appear in the console
    .catch(error => console.error(error))
})

// The application continues from the route of "/markComplete" whenever a post needs to be marked as complete; parameters include "request" and "response"
app.put('/markComplete', (request, response) => {
     // Calls on MongoDB collection called "Todos" and updates the corresponding doc with the key called "thing" from the form in the index.ejs file; this takes place whenever an item IS completed.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // sets
        $set: {
            // the completed item to "true" (which will mark it off of the list)
            completed: true
          }
    },{
        // sorts the collections docs by their individual IDs in descending order
        sort: {_id: -1},
        // This makes sure that the doc is NOT updated and there is not another doc that is inserted.
        upsert: false
    })
    // Once the request is completed, "result" is passed as a parameter 
    .then(result => {
        // Prints to console that item in question has been marked as completed
        console.log('Marked Complete')
        // Shows task that has been marked as completed in JSON form.
        response.json('Marked Complete')
    })
     // If an error were to appear, it is checked for and message containing an error will appear in the console
    .catch(error => console.error(error))

})

// The application continues from the route of "/markUnComplete" whenever a post needs to be marked as incomplete; parameters include "request" and "response"
app.put('/markUnComplete', (request, response) => {
    //  Calls on MongoDB collection called "Todos" and updates the corresponding doc with the key called "thing" from the form in the index.ejs file; this takes place whenever an item IS NOT completed.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // sets
        $set: {
            // the completed item to "false" (which will keep it on the list as it is NOT complete)
            completed: false
          }
    },{
        // sorts the collections docs by their individual IDs in descending order
        sort: {_id: -1},
        // This makes sure that the doc is NOT updated and there is not another doc that is inserted.
        upsert: false
    })
    // Once the request is marked as NOT completed, "result" is passed as a parameter 
    .then(result => {
        // Prints to console that item in question has been marked as incomplete
        console.log('Marked Incomplete')
        // Shows task that has been marked as incomplete in JSON form
        response.json('Marked Incomplete')
    })
     // If an error were to appear, it is checked for and message containing an error will appear in the console
    .catch(error => console.error(error))

})

// The application continues from the route of "/deleteItem" whenever a post needs to be deleted; parameters include "request" and "response"
app.delete('/deleteItem', (request, response) => {
    //  Calls on MongoDB collection called "Todos" and deletes the corresponding doc with the key called "thing" from the form in the index.ejs file; this takes place whenever an item needs to be removed.
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
     // Once the request is marked for deletion, "result" is passed as a parameter
    .then(result => {
        //  Prints to console that item in question has been marked for deletion
        console.log('Todo Deleted')
        // Shows task that has been marked for deletion in JSON form
        response.json('Todo Deleted')
    })
    // If an error were to appear, it is checked for and message containing an error will appear in the console
    .catch(error => console.error(error))

})

// Application listens for either the port number that the computer chooses or the port number that has been supplied within the code.
app.listen(process.env.PORT || PORT, ()=>{
    // Prints message to the console: `Server running on port ${PORT}`; the port that application is running on appears within the curly braces.
    console.log(`Server running on port ${PORT}`)
})