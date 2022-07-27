// import express
const express = require('express')

// instantiate a new instance of an express app - allows you to use easy to use variable name app
const app = express()

// import mongodb and instantiate a new MongoClient instance which allows you to manipulate, create, and connect to a mongo db
const MongoClient = require('mongodb').MongoClient

// stores port number - looks for env variable else = 2121
const PORT = process.env.PORT || 2121;

// enables the use of .env file
require('dotenv').config()

/**
 * db - will represent mongodb database
 * dbConnectionStr - allows us to connect to mongo atlas db
 * dbName - database name
 */
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// connect app to mongoclient db
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        // create a new db named 'todo'
        db = client.db(dbName)
    })
    
// set view engine to ejs, allows us to render data using ejs
app.set('view engine', 'ejs')
// sets up public folder that will serve files to client
app.use(express.static('public'))
// parses incoming requests with urlencoded payloads (in replace of body-parser)
app.use(express.urlencoded({ extended: true }))
// parses incoming JSON requests
app.use(express.json())


// define a GET request at default endpoint
app.get('/',async (request, response)=>{
    // access db collection called 'todos', find documents and store them in an array
    const todoItems = await db.collection('todos').find().toArray()

    // count documents in db that have false as a value for key "completed"
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})

    // pass todoItems and itemsLeft to index.ejs file in order to be rendered
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
})

// define a POST request at /addTodo endpoint, used to Create a new document
app.post('/addTodo', (request, response) => {
    // add new document to do todos collection, todoItem property is pulled from our request body 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        // redirect to base endpoint after a document is added to db
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// define a PUT request at /markComplete endpoint, used to update a document
app.put('/markComplete', (request, response) => {
    // update a document from the todos collection
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            // set the completed key to true (in our ejs, add a class "completed" to the span if "completed" key has a value of true)
            completed: true
        }
    },{
        // specifies the order of documents from a collection
        sort: {_id: -1},
        // makes sure a new document isnt created if the document isnt found in our db
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        // respond with json if marked is completed
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// define a PUT request at /markComplete endpoint, used to update a document
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
        console.log('Marked UnComplete')
        response.json('Marked UnComplete')
    })
    .catch(error => console.error(error))
})

// add DELETE request to /deleteItem endpoint
app.delete('/deleteItem', (request, response) => {
    // delete document from todos collection with key "thing"'s value as the text passed to the request
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))
})

// create server and listen on PORT for requests 
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})