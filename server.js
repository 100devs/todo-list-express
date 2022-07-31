// Our framework import
const express = require('express')
// Framework object
const app = express()
// MongoDB client
const MongoClient = require('mongodb').MongoClient
// specify port
const PORT = 2121
// Use dotenv for mongo string, which includes password
require('dotenv').config()

// global db for database, dbConnectionStr is the mongo URI, dbName is the db created in Mongo
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// connect to Mongo database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
// Once connected, let's do something with the client we've contacted
    .then(client => {
        // Like debug statement
        console.log(`Connected to ${dbName} Database`)
        // Which database will we connect to and reference later? todo
        db = client.db(dbName)
    })

// Middleware usage of ejs templating
app.set('view engine', 'ejs')
// Usage of static folder public for assets, including main.js
app.use(express.static('public'))
// URL parsing using the urlencoded package in Express
app.use(express.urlencoded({ extended: true }))
// JSON read & write 
app.use(express.json())

// First things first, establish a link to root route
app.get('/',async (request, response)=>{
    // Wait for Mongo to bring back our set of documents and put in array
    const todoItems = await db.collection('todos').find().toArray()
    // Also wait for Mongo to give us a count of docs that haven't been completed
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Look at ejs page for todoItems ul contents and itemsLeft (above) and bring the page into sync with both bits of info
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // => Following is an alternate way to setup the Promise =>
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// Set up our POST route, which we must access from the HTML in the form
app.post('/addTodo', (request, response) => {
    // Whatever data we get, use the request body to use Mongo's insertOne method for adding it, default of completed is false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // Once we've done that, get our result
    .then(result => {
        // Debug
        console.log('Todo Added')
        // And take us back to root
        response.redirect('/')
    })
    // Any issues, tell us
    .catch(error => console.error(error))
})

// If we enter this PUT method, we're going to create a strikethrough text style and change the completed property to true 
app.put('/markComplete', (request, response) => {
    // In order to know which one, main.js will send the item in the body through this put route
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Mongo PUT syntax
        $set: {
            completed: true
          }
    },{
        // Display it reverse order of entry
        sort: {_id: -1},
        // Don't add a new document if it doesn't already exist
        upsert: false
    })
    // Once done, review with debugging statements
    .then(result => {
        // prints to the console
        console.log('Marked Complete')
        // along with a 200 response header, returns this object if successful
        response.json('Marked Complete')
    })
    // If unsuccessful, tell us
    .catch(error => console.error(error))

})

// This second PUT route will alter the completed property when reached
app.put('/markUnComplete', (request, response) => {
    // Find the item in question in Mongo, enter editing mode
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Change the property completed back to false
        $set: {
            completed: false
          }
    },{
        // Again, leave in order entered as documents
        sort: {_id: -1},
        // Also, don't change this to a POST method
        upsert: false
    })
    // Once it's all done, debug
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    // Complain as needed
    .catch(error => console.error(error))

})

// Delete route removes documents
app.delete('/deleteItem', (request, response) => {
    // Identified through main.js call body itemFromJS
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // debug when done
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// Voltron assemble! (start the app on this port)
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})