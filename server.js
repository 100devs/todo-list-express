// Import express module and assign to variable
const express = require('express')
// Assign express app and functionality to variable
const app = express()
// Import MongoDB and assign to variable
const MongoClient = require('mongodb').MongoClient
// Create a constant for the port
const PORT = 2121
// Import dotenv and use config method to load environment variables from the .env file into process.env
require('dotenv').config()

// Create three variables:
// 'db' for db class instance
// 'dbConnectionStr' for the connection string from the 'DB_STRING' .env file
// 'dbName' for the name of the database
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// Create a connection to MongoDB, and pass connection string variable
// Pass in useUnifiedTypology (now deprecated)
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // Passing client information
    .then(client => {
        // Console log the connection string, notifying the user that the app is connected to the database
        console.log(`Connected to ${dbName} Database`)
        // Assign a value to the 'db' variable with a 'db' method on the 'MongoClient' instance
        db = client.db(dbName)
    })

// Call the set method on the express app, with ejs as the default templating language, allowing the omission of the .ejs extension when specifying view names
app.set('view engine', 'ejs')
// Set the location for static files to the 'public' folder and serve files from said location via middleware
app.use(express.static('public'))
// Use the 'urlencoded' middleware to look at requests coming through and allowing the obtainment of data out of the requests
app.use(express.urlencoded({ extended: true }))
// Parse JSON content from incoming requests
app.use(express.json())

// Add a request handler to the 'get' method with a path of '/' (root route)
app.get('/',async (request, response)=>{
        // Access the 'todos' collection from the connected database, calling 'find' to retrieve all documents, and then calling 'toArray`' to turn the query into a promise that will resolve with an array of document objects
    const todoItems = await db.collection('todos').find().toArray()
    // Access the 'todos' collection from the database, calling the 'countDocuments' with an filter to only include documents that have a 'completed' property of 'false'
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Render the 'index.ejs' view with the 'todoItems' and 'itemsLeft' variables that EJS will use in the view
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

// Add a request handler for the 'post' method of the '/addTodo' path
app.post('/addTodo', (request, response) => {
    // Access the 'todos' collection from the database, calling the 'insertOne' method with an object containing the properties 'thing' and 'completed' set to the value of the 'request.body.todoItem' property and a value of 'false'
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // Do the following if the insertion is successful
    .then(result => {
        // Notify the user of successful insetion
        console.log('Todo Added')
        // Redirect the user to the '/' path
        response.redirect('/')
    })
    // Catch any errors and console them to the user
    .catch(error => console.error(error))
})

// Add a request handler to the 'post' method of the '/markComplete' path
app.put('/markComplete', (request, response) => {
    // Access the 'todos' collection from the database, calling the 'updateOne' method with a filter object with the property 'thing' set to the value of the 'request.body.itemFromJS' property
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // UpdateFilter containing the '$set' update operator, telling MongoDB to set the 'completed' property to 'true'
        $set: {
            completed: true
          }
    },{
        // Sort the document _id's in descending order to get the latest document first, and moving the item updated to the bottom of the list
        sort: {_id: -1},
        // Disable upsert, preventing the insertion of a document if the item does not already exist
        upsert: false
    })
    // Do the following if the update is successful
    .then(result => {
        // Notify the user of a successful update
        console.log('Marked Complete')
        // Send a response back to the client of successful update
        response.json('Marked Complete')
    })
    // Catch any errors and console them to the user
    .catch(error => console.error(error))

})

// Add a request handler to the 'post' method of the '/markUnComplete' path
app.put('/markUnComplete', (request, response) => {
    // Access the 'todos' collection from the database, calling the 'updateOne' method with a filter object with the property 'thing' set to the value of the 'request.body.itemFromJS' property
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // UpdateFilter containing the '$set' update operator, telling MongoDB to set the 'completed' property to 'false'
        $set: {
            completed: false
          }
    },{
        // Sort the document _id's in descending order to get the latest document first, and moving the item updated to the bottom of the list
        sort: {_id: -1},
        // Disable upsert, preventing the insertion of a document if the item does not already exist
        upsert: false
    })
    // Do the following if the update is successful
    .then(result => {
        // Notify the user of a successful update
        console.log('Marked Complete')
        // Send a response back to the client of successful update
        response.json('Marked Complete')
    })
    // Catch any errors and console them to the user
    .catch(error => console.error(error))

})

// Add a request handler to the 'delete' method of the '/deleteItem' path
app.delete('/deleteItem', (request, response) => {
    // Access the 'todos' collection from the database, calling the 'deleteOne'method  with a filter object of property 'thing' set to the value 'request.body.itemFromJS' property to delete the first matching document
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // Do the following if the deletion is successful
    .then(result => {
         // Notify the user of successful deletion
        console.log('Todo Deleted')
        // Send a response back to the client of successful deletion
        response.json('Todo Deleted')
    })
    // Catch any errors and console them to the user
    .catch(error => console.error(error))

})

// Run the server on either the PORT provided via the environment variable, or the default port stored in the 'PORT' variable
app.listen(process.env.PORT || PORT, ()=>{
    // Let user know the server is running on the specified port
    console.log(`Server running on port ${PORT}`)
})
