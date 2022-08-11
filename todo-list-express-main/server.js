// Declare application variables

// Import the express module
const express = require('express')
// name your application that's using express and store in a variable
const app = express()
// assign MongoClient module to a variable 
const MongoClient = require('mongodb').MongoClient
// Starts a server and listens on port 2121 for connections
const PORT = 2121
// Importing environment variables from .env file
require('dotenv').config()

// Declaring variables for database connections
let db,
// use environment variable from dotenv file
    dbConnectionStr = process.env.DB_STRING,
    // assign database name to dbName variable
    dbName = 'todo'

// Connecting to MongoDB, using the DB_STRING declared above
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        // console log string if connection successful
        console.log(`Connected to ${dbName} Database`)
        // assign 'todo' to the db variable
        db = client.db(dbName)
    })

// Set middleware

// Set app to use EJS for rendering (view engine)
app.set('view engine', 'ejs')
// Tell app to use our 'public' folder for statically-rendered files
app.use(express.static('public'))
// Parses incoming requests with urlencoded payloads and is based on the (now-deprecated) body-parser
app.use(express.urlencoded({ extended: true }))
// Enable Express to read incoming JSON
app.use(express.json())

// How we display everything in the database on page load
app.get('/',async (request, response)=>{
// Finds everything in the 'todos' collection and turns it into an array, storing in todoItems variable
    const todoItems = await db.collection('todos').find().toArray()
// Finds the uncompleted items and returns them in an array and stores them in the itemsLeft variable
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
// Passes the response to ejs file, showing the items to do and the number of items left to be completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft })

    // Following block does same as above but with promises instead of async/await

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// Creates a todo thing
app.post('/addTodo', (request, response) => {
// Goes to todos collection, using the insertOne method to pass in 'request.body.todoItem', adding completed: false by default
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
// Console logs 'Todo Added' if successful, then redirects to the root page (sending GET request)
    .then(result => {
        // console log string if connection successful
        console.log('Todo Added')
        // redirect page to root page, causing GET request
        response.redirect('/')
    })
// Console logs an error if error occurs
    .catch(error => console.error(error))
})

// How to change things already in database
app.put('/markComplete', (request, response) => {
// Goes to todos collection, using the updateOne method to pass in 'request.body.itemFromJS', adding completed: false by default
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
// MongoDB method that sets completed item's property to true
        $set: {
            completed: true
          }
    },{
// Sorts documents by ID, in descending order
        sort: {_id: -1},
// Deliberately will not create new document if no document matching the query is found
        upsert: false
    })
// If successful, console logs completion on both the server and client side
    .then(result => {
        // console log string if successful
        console.log('Marked Complete')
        // pass json to client side JS to console lgoged in browser
        response.json('Marked Complete')
    })
// Console logs an error if error occurs
    .catch(error => console.error(error))
})

// How to change things already in database
app.put('/markUnComplete', (request, response) => {
// Goes to todos collection, using the updateOne method to pass in 'request.body.itemFromJS', adding completed: false by default
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
// MongoDB method that sets completed item's property to false
        $set: {
            completed: false
          }
    },{
// Sorts documents by ID, in descending order
        sort: {_id: -1},
// Deliberately will not create new document if no document matching the query is found
        upsert: false
    })
// If successful, console logs completion on both the server and client side
    .then(result => {
        // console log string if successful       
        console.log('Marked InComplete')
        // pass JSON to client side to be console logged in browser
        response.json('Marked InComplete')
    })
// Console logs an error if error occurs
    .catch(error => console.error(error))

})

// Deletes a thing
app.delete('/deleteItem', (request, response) => {
// Goes to todos collection, using the deleteOne method to pass in 'request.body.itemFromJS', removing the document from database
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
// If successful, console logs completion (of deletion) on both the server and client side
    .then(result => {
        // console log string if successful
        console.log('Todo Deleted')
        // pass JSON to client side to be console logged in browser
        response.json('Todo Deleted')
    })
// Console logs an error if error occurs
    .catch(error => console.error(error))

})

// Server listens to port specified in .env file or locally specified port (2121)
app.listen(process.env.PORT || PORT, ()=>{
    // console log string if connection to PORT successful
    console.log(`Server running on port ${PORT}`)
})