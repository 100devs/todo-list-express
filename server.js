// importing express into server.js
const express = require('express')

// instantiating a new instance of an express app, allows you to use easy to use variable name app
const app = express()

// import mongodb and instantiate a new MongoClient instance which allows you to manipulate,create,connect to a mongo db
const MongoClient = require('mongodb').MongoClient

// variable for port number
const PORT = process.env.PORT || 2121;

// allows us to use .env file
require('dotenv').config()

/**
 * db - database
 * dbConnectionStr - allows us to connect to mongo atlas db
 * dbName - database name
 */
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

/**
 * connect app to mongoclient 
 * useUnifiedTopology: true - allows us to
 */
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        // creates a new db with a name you pass to it, allows you to access Mongo DB
        db = client.db(dbName)
    })
    
// sets our view engine to ejs, allows us to use ejs
app.set('view engine', 'ejs')
// sets up public folder that will serve files to client
app.use(express.static('public'))
// It parses incoming requests with urlencoded payloads and is based on body-parser.
app.use(express.urlencoded({ extended: true }))
// It parses incoming JSON requests and puts the parsed data in request.
app.use(express.json())


// defines a GET request at default endpoint
app.get('/',async (request, response)=>{
    // accessing db collection called 'todos', .find documents and store them into an array
    const todoItems = await db.collection('todos').find().toArray()

    // count documents in database that have false as a value for key "completed"
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})

    // pass todoItems and itemsLeft to index.ejs file in order to be rendered.
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
})

// defined a POST request at /addTodo endpoint, used to Create a new document
app.post('/addTodo', (request, response) => {
    // adds new document to do todos collection, todoItem property is pulled from our request body 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        // redirects to base endpoint after the document is added
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// defines a PUT request at /markComplete endpoint, used to update a document
app.put('/markComplete', (request, response) => {
    // updates a document from the todos collection
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            // sets the completed key to true (in our ejs, will add a class "completed" to the span)
            completed: true
        }
    },{
        // method specifies the order in which the query returns the matching documents from the given collection
        sort: {_id: -1},
        // makes sure a new document isnt created if the document isnt found in our DB
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        // respond with json indicating the marking is complete
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// defines a PUT request at /markComplete endpoint, used to update a document
app.put('/markUnComplete', (request, response) => {
    // set the completed property of a document to false
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Uncomplete')
        response.json('Marked Uncomplete')
    })
    .catch(error => console.error(error))
})

// adds DELETE request to /deleteItem endpoint
app.delete('/deleteItem', (request, response) => {
    // delete document from todos collection that has the thing key's value as the document passed to the request
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))
})

// run the server on port 2121
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})