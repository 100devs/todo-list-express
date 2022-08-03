//To connect to mongoDB you need connection string and put in .env file

// Import express library, setting the result to the express variable
const express = require('express')
// Execute the expressf unction, saving it's result to the app variable
const app = express()
// Import the Mongoclient from the mongo library, setting the result to the MongoClient Variable
const MongoClient = require('mongodb').MongoClient
//Declare a variable named PORT with the value 2121
const PORT = 2121
// Import the dotenv library and call its config function
require('dotenv').config()

// Declare a variable named db
let db,
// Delcare a variable named dbConnectionStr whose value from the DB_STRING environment variable.
    dbConnectionStr = process.env.DB_STRING,
    // Declare a varible named dbName with the value todo. This is the MongoDB database we will store todo items in
    dbName = 'todo'

// Call the MongoClient connection method to connect to our MongoDB database. The useUnifiedTopology option uses the new unified topology layer
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // MongoClient.connection returns a promise, which we'll resolve with .then
    .then(client => {
        // Log the connected database
        console.log(`Connected to ${dbName} Database`)
        // Tell the MongoClient to use the dbName database. Store the returned Db class in the db variable
        db = client.db(dbName)
    })

// Set the express application view engine setting to use ejs as its rendering engine
app.set('view engine', 'ejs')
// Tell the express application to serve static files from the public directory
app.use(express.static('public'))
// Tell the express application to automatically parse urlcoded payload
app.use(express.urlencoded({ extended: true }))
// Tell the express application to automatically parse JSON payloads and make that available in the request.body
app.use(express.json())

//DEFINE HANDLERS
// Listen for the HTTP GET requests on the '/' (root) route and execute the handler (request/response)
app.get('/',async (request, response)=>{
    // Find all documents within the todos collection and return them as an array. Store the result in the todoItems variable. 
    // Since a promise in returned, we await for the promise to resolve or reject.
    const todoItems = await db.collection('todos').find().toArray()
    // Count the number of documents within the todos collection where the completed field is false. 
    // Store the result in the itemsLeft variable. Since a promise is returned, we await
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Render the index.ejs file with the passed in object. Respond to the client with the rendered content
    response.render('index.ejs', { items: todoItems, left: itemsLeft })

})

// Listen for the HTTP POST request on the '/addTodo' route and executes the handler
app.post('/addTodo', async (request, response) => {
    // Inserts a new document into the todos collection with the fields thing and completed set
    try {
        await db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
        // Since the above returns a promise, we handle the resolved promise here
        .then(_ => {
            // Log that a todo was added
            console.log('Todo Added')
            // Redirect the client back to '/'
            response.redirect('/')
        })
        // Handle the rejected promise by logging the error
        .catch(error => console.error(error))
})

// Listen for the HTTP PUT request on the '/markCompleted' route and executes the handler
app.put('/markComplete', (request, response) => {
    // Find a document whose thing field matches request.body.itemFromJS and set its completed field to true.
    // When finding a document, sort the documents by object ID in ascending order. If no document found, do not insert a new one
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // If a document was found, set it's completed field to true
        $set: {
            completed: true
          }
    },{
        // When finding a document, sort the document by object ID in ascending order to find newest one
        sort: {_id: -1},
        // If we don't find a document to update, do not create a new one
        upsert: false
    })
    // Handle the resolved promise.
    .then(_ => {
        // Log that the update was complete
        console.log('Marked Complete')
        // Respond to the client letting them know the update was complete
        response.json('Marked Complete')
    })
    // Handle the rejected promise by logging the error
    .catch(error => console.error(error))

})

// Listen for the HTTP PUT request on the '/markUnComplete' route and executes the handler
app.put('/markUnComplete', (request, response) => {
    // Find a document whose thing field matches request.body.itemFromJS and set its completed field to true.
    // When finding a document, sort the documents by object ID in ascending order. If no document found, do not insert a new one
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // If a document was found, set it's completed field to true
        $set: {
            completed: false
          }
    },{
        // When finding a document, sort the document by object ID in ascending order to find newest one
        sort: {_id: -1},
        // If we don't find a document to update, do not create a new one
        upsert: false
    })
    // Handle the resolved promise.
    .then(_ => {
        // Log that the update was complete
        console.log('Marked Complete')
        // Respond to the client letting them know the update was complete
        response.json('Marked Complete')
    })
    // Handle the rejected promise by logging the error
    .catch(error => console.error(error))

})

// Listen for the HTTP DELETE request on the '/deleteItem' route and executes the handler
app.delete('/deleteItem', (request, response) => {
    //Find a document in the todos collection whose thing field matches request.body.itemFromJS and delete it if found
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //Handle the resolved promise
    .then(_ => {
        // Log that the delete was complet
        console.log('Todo Deleted')
        // Response to the client, letting them know the delete was completed
        response.json('Todo Deleted')
    })
    // Hanld ethe rejected promise by logging the error
    .catch(error => console.error(error))

})

// Start the express web server, listening on port PORT. PORT is retrieved from the PORT environment variable or the PORT variable if not found.
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})