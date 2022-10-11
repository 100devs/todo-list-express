// set up express server
const express = require('express')
// initialize express, use and evoke express
const app = express()
// set up mongoDB
const MongoClient = require('mongodb').MongoClient
// set up port
const PORT = 1000

// load config file
require('dotenv').config()

// variable for DB
let db,
// variable for credentials used access MongoDB
    dbConnectionStr = process.env.DB_STRING,
// variable for DB name
    dbName = 'todo'

    // connects to MongoDB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })


// MIDDLEWARE - methods/functions/operations that are called BETWEEN processing the Request and sending the Response in your application method
// sets EJS as the rendering engine
app.set('view engine', 'ejs')
// serves static files to all pages
app.use(express.static('public'))
// required for POST and PUT requests - sending data (in the form of some data object) to the server and you are asking the server to accept or store that data (object), which is enclosed in the body (i.e. req.body) of that (POST or PUT) Request
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// get request

// use express module to render index.ejs
app.get('/',async (request, response)=>{
    // finds all the 'todo' documents and puts them in an array
    const todoItems = await db.collection('todos').find().toArray()
    // counts all the completed tasks/object/document from 'todos' collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // render index.ejs and creates variables for EJS to use
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

// use express module to add a document to DB, route from form action in index.ejs
app.post('/addTodo', (request, response) => {
    // in DB collection 'todos', add task and default complete to false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // if request is a success, log in the console and redirect to index page
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    // if requests fails, log error
    .catch(error => console.error(error))
})

// use express module to update DB, route in fetch function markComplete in main.js
app.put('/markComplete', (request, response) => {
    // in DB collections 'todos', find the document and set completed to true
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        // brings object/document to the end of the array (sorts from first created to most recently created, decending order)
        // upsert: false tells mongoDB to not insert a new document
        sort: {_id: -1},
        upsert: false
    })
    // if request is a success, log in the console and pass into JSON
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    // if requests fails, log error
    .catch(error => console.error(error))

})

// use express module to update DB, route in fetch function markUnComplete in main.js
app.put('/markUnComplete', (request, response) => {
    // in DB collections 'todos', find the document and set completed to false
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        // brings object/document to the end of the array (sorts from first created to most recently created, decending order)
        // upsert: false tells mongoDB to not insert a new document
        sort: {_id: -1},
        upsert: false
    })
    // if request is a success, log in the console and pass into JSON
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    // if requests fails, log error
    .catch(error => console.error(error))

})

// use express module to delete a document in the DB, route is in fetch (function deleteItem in main.js)
app.delete('/deleteItem', (request, response) => {
    // in DB collection 'todos', find and delete the document from the DB
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // if request is a success, log in the console and pass into JSON
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    // if request fails, log error
    .catch(error => console.error(error))

})

// "listen" connects on a specified host and port
// "process.env" using varibles in env, if not available use PORT varible
// log in console
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})