// Use express in this file.
const express = require('express')
// Assign the instance of express to a variable.
const app = express()
// Use MongoDB in this file.
const MongoClient = require('mongodb').MongoClient
// Variable holding the port we will listen to.
const PORT = 2121
// Enables the loading of environment variables from .env files.
require('dotenv').config()


let db, // Variable declaration that will have a value later.
    dbConnectionStr = process.env.DB_STRING, // Grab MongoDB string from .env file.
    dbName = 'todo' // Database name that will be used.

// Connect to MongoDB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // After promise is resolved, the result is passed to an arrow function.
    .then(client => {
        // Console log the success of connecting to dbName database. 
        console.log(`Connected to ${dbName} Database`)
        // Set db variable to the MongoDB database.
        db = client.db(dbName)
    })

// Set express to use EJS template as the view engine.
app.set('view engine', 'ejs')
// Serve files in the public folder.
app.use(express.static('public'))
// Allows server to read data sent to server by action of form element.
app.use(express.urlencoded({ extended: true }))
// Allows server to accept JSON data being sent in requests.
app.use(express.json())

// Listen for Read (GET) request sent to root.
app.get('/',async (request, response)=>{
    // Find all items inside the todos collection and put the object into an array.
    const todoItems = await db.collection('todos').find().toArray()
    // Checks how many elements are in the collection that have not been completed.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Pass the todoItems and itemsLeft variable to the index.ejs template and respond with the HTML file that is returned.
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

// Listen for Create (POST) request sent to addTodo.
app.post('/addTodo', (request, response) => {
    // In the todos collection, insert with the value passed through request.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // Once promise is resolved pass the result to an arrow function.
    .then(result => {
        // Console log informing the successful addition of a todo item.
        console.log('Todo Added')
        // Refresh page by redirecting to root.
        response.redirect('/')
    })
    // If the promise is rejected, console log the error.
    .catch(error => console.error(error))
})

// Listen for Update (UPDATE) request sent to markComplete.
app.put('/markComplete', (request, response) => {
    // In the todos collection, update the item matching the value passed through request.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Replace the value of a field.
        $set: {
            // Set complete to true.
            completed: true
          }
    },{
        sort: {_id: -1}, // Move item to the bottom of list.
        upsert: false // Prevent update from inserting a new item when no match is found.
    })
    // Once the promise is resolved, pass the result to an arrow function.
    .then(result => {
        // Console log informing the successful database update.
        console.log('Marked Complete')
        // Send a JSON response to client. 
        response.json('Marked Complete')
    })
    // If promise is rejected, console log the error.
    .catch(error => console.error(error))

})

// Listen for Update (UPDATE) request sent to markUnComplete.
app.put('/markUnComplete', (request, response) => {
    // In the todos collection, update the item matching the value passed through request.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Replace the value of a field.
        $set: {
            // Set complete to true.
            completed: false
          }
    },{
        sort: {_id: -1}, // Move item to the bottom of list.
        upsert: false // Prevent update from inserting a new item when no match is found.
    })
    // Once the promise is resolved, pass the result to an arrow function.
    .then(result => {
        // Console log informing the successful database update.
        console.log('Marked Complete')
        // Send a JSON response to client. 
        response.json('Marked Complete')
    })
    // If promise is rejected, console log the error.
    .catch(error => console.error(error))

})

// Listen for Delete (DELETE) request sent to deleteItem.
app.delete('/deleteItem', (request, response) => {
    // In the todos collection, delete the item matching the value passed through request.
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // Once the promise is resolved, pass the result to an arrow function.
    .then(result => {
        // Console log informing the successful deletion of an item from database.
        console.log('Todo Deleted')
        // Send a JSON response to client. 
        response.json('Todo Deleted')
    })
    // If promise is rejected, console log the error.
    .catch(error => console.error(error))

})

// Setting the port (from environment variable, or PORT variable) that the server will listen to.
app.listen(process.env.PORT || PORT, ()=>{
    // Console log informing the server is is running and listening on the assigned port.
    console.log(`Server running on port ${PORT}`)
})