// Imports the 'express' library
const express = require('express')

// Creates an instance of the express library
const app = express()

// Imports the MongoDB Client
const MongoClient = require('mongodb').MongoClient

// Sets the defulat port number to the variable of PORT
const PORT = 2121

// Imports 'dotenv' and runs the config method, which in turn loads the vars from '.env'
require('dotenv').config()

// Initialize variables for 'db' (no val), 'dbConnectionStr' (MongoDB connections string from .env), 'dbName' (MongoDB collection 'todo') 
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// Initialize the connection to MongoDB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // Handling a succesfully resolved proimise
    .then(client => {
        console.log(`Connected to ${dbName} Database`)

        // Assigning the connected client instance, attached to the 'todo' collection to the 'db' variable
        db = client.db(dbName)
    })

// Sets 'ejs' as the redering engine 
app.set('view engine', 'ejs')

// Serves 'public' folders content as is
app.use(express.static('public'))

// Middleware (intercepts requests/responses) - allows query data to be passed to server via request (https://localhost/route?variable=value&othervariable=othervalue)
app.use(express.urlencoded({ extended: true }))

// Middleware to load the json body parser for incoming request
app.use(express.json())

// Defines a 'get' method at the root of the server
app.get('/',async (request, response)=>{

    // request to mongo to return all records from 'tods' collection, in and array.
    const todoItems = await db.collection('todos').find().toArray()

    // Returns a count of the number of records with the 'completed' field equal to false.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})

    // Express passes the data from the above two queries in to the ejs
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

// POST method for receiving a new too item 
app.post('/addTodo', (request, response) => {

    // Adds new todo item to the db, with the completed field defaulted to false.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})

    // Handles returned promise, logs to the server console and redirects back to root page
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    // Logs an error to the console, if there is one.
    .catch(error => console.error(error))
})

// Defines an endpoint to handle a PUT request
app.put('/markComplete', (request, response) => {
    // Updates a record, using value recieved from 'itemFromJS' in the body of the request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //  Sets the 'completed' field to true
        $set: {
            completed: true
          }
    },
    // Updates the newest document if multiple results. if no matches, don't create a new record.
    {
        sort: {_id: -1},
        upsert: false
    })
    // if success, log and send response
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    // If no, log error.
    .catch(error => console.error(error))

})

// Defines the endpoint to handle a PUT request with the path of 'markUncomplete' 
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //  Tells mongodb to set the completed property to 'false'
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// Handles a DELETE request at the defined endpoint
app.delete('/deleteItem', (request, response) => {
    // Mongodb function to delete a single todo item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // If successful, log and send response
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    // If it fails, log the error
    .catch(error => console.error(error))

})

// Starts the server and waits for requests.
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})