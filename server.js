// Imports the 'express' library 
const express = require('express')
// Creates an instance of the express library
const app = express()
// Imports the MongoDB Client
const MongoClient = require('mongodb').MongoClient
// sets the port for express to listen on
const PORT = 2121

// Imports 'dotenv' and runs the config method, which in turn loads the vars from '.env'
require('dotenv').config()

// initialize variables for 'db' (no val), 'dbConnectionStr' (MongoDB connection string from .env), 'dbName' (MongoDB collection 'todo')
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//initialize the connection to MongoDB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // handling a successfully resolved promise & printing to console.log
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        // assigning the connected client instance, attached to the 'to-do' collection to the 'db' variable
        db = client.db(dbName)

        // if the request fails, this will print the error to the console
    }).catch(err => console.error(err))
    
// sets 'ejs' as the rendering engine for the .render() method
app.set('view engine', 'ejs')

//serves 'public' folder contents as is
app.use(express.static('public'))

//middleware 9intercepts requests/responses) allows query data to be passed to the server via request (http://localhost/route?variable=value&otherVariable=otherValue)
app.use(express.urlencoded({ extended: true }))

// middleware to load the json body parser for incoming requests
app.use(express.json())

// defines a 'get' method at the root of the server
app.get('/', async (request, response)=>{
    // request to database to return all documents in the collection as an array, and store it in a variable
    const todoItems = await db.collection('todos').find().toArray()
    //returns a count of the number of documents wih the 'completed' key set to false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // express passes the data contained in the todoItems and itemsLeft variables to the ejs template
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
// POST method for receiving a new to-do item
app.post('/addTodo', (request, response) => {
    //adds a new to-do item to the db, with the completed field defaulted to false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // handles returned promise, logs to the server console and redirects back to root page.
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    //logs an error to the console if the request was rejected
    .catch(error => console.error(error))
})
// defines an endpoint to handle a PUT request
app.put('/markComplete', (request, response) => {
    // updates a document, using the value received from 'itemFromJS' in the body of the request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // sets completed key value to true
        $set: {
            completed: true
          }
    },{
        // sorts the db by ids of elements in descending order
        sort: {_id: -1},
        // updates the newest matching document. if there are no matching documents, don't create one
        upsert: false
    })
    // if sucessful, log and send response
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    // if failed, log error
    .catch(error => console.error(error))

})
// does the opposite of the previous request - sets completed to false.
app.put('/markUnComplete', (request, response) => {
    // updates a document, using the value received from 'itemFromJS' in the body of the request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // sets completed key value to false
        $set: {
            completed: false
          }
    },{
        // sorts the db by ids of elements in descending order
        sort: {_id: -1},
        // updates the newest matching document. if there are no matching documents, don't create one
        upsert: false
    })
    // if sucessful, log and send response
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    // if failed, log error
    .catch(error => console.error(error))
})
// handles DELETE request at the defined endpoint
app.delete('/deleteItem', (request, response) => {
    //mongodb function to delete a single to-do item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //if successful, log and send response
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    // if it fails, log the error
    .catch(error => console.error(error))

})
// starts the server and waits for requests
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})