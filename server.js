// import express framework to be utilized through the express const
const express = require('express')
// create express application, accessed through app const
const app = express()
// import mongodb, interact with via MongoClient
const MongoClient = require('mongodb').MongoClient
// define local port
const PORT = 2121
// import dotenv to utilize environment variables hidden in .env file via process.env
require('dotenv').config()

// declare db variable not yet assigned a value
let db,
    // assign value of mongodb connection string hidden in .env file
    dbConnectionStr = process.env.DB_STRING,
    // establish db name
    dbName = 'todo'
// connect to MongoClient utilizing connection string credentials
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // when successful
    .then(client => {
        // console log that connection with db has been made
        console.log(`Connected to ${dbName} Database`)
        // create new db instance named 'todo', interact with through db variable
        db = client.db(dbName)
    })
// to render template files, define templating engine, express will look for a views directory
// in the root and render the ejs file found within
app.set('view engine', 'ejs')
// utilize built-in express static middleware to serve static files
// identifying that they will be found in the 'public' directory in the root
app.use(express.static('public'))
// utilize built-in express urlencoded middleware to parse incoming requests with urlencoded payloads
// populates request body property with the parsed data
app.use(express.urlencoded({ extended: true }))
// utilize built-in express json middleware to parse incoming requests with JSON data
// populates request body property with the parsed data (JSON to JS)
app.use(express.json())

// establish route handler, to handle GET (read) requests made to endpoint '/'
// when received, execute async callback
app.get('/',async (request, response)=>{
    // await resolved promise when making async call to db to collect ALL todos,
    // formatted as an array of todos assigned to todoItems const
    const todoItems = await db.collection('todos').find().toArray()
    // await resolved promise when making async call to db to collect the count of
    // todos with the completed property value of false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // renders a view and sends rendered HTML string to client
    // the view is the 'index.ejs' file found in views directory
    // locals object (2nd arg) defines local variables for the view,
    // all of the todos will be accessed via the 'items' variable
    // and the items left count will be accessed via the 'left' variable
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
// establish route handler, to handle POST (create) requests made to endpoint '/addTodo'
// when received, execute callback
// (interacting with db, will be async utilizing .then/.catch, vs above async/await promise handling)
app.post('/addTodo', (request, response) => {
    // access the bd collection named 'todos', add a new todo resource
    // using the info attached to the request body from the front end, populate the
    // info for the new todo; thing & completed properties
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // when successful
    .then(result => {
        // log in the console that the creation of the new todo in the db was successful
        console.log('Todo Added')
        // send response back to front end to redirect to app root
        response.redirect('/')
    })
    // if an exception was thrown, display the error in the console
    .catch(error => console.error(error))
})
// establish route handler, to handle PUT (update) requests made to endpoint '/markComplete'
// when received, execute callback; handles async calls to db
app.put('/markComplete', (request, response) => {
    // access db collection named 'todos' and update a specific resource
    // using the data passed from the frontend containing information from the specific todo
    // search the db for a resource whose data matches and
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // set its completed property to true
        $set: {
            completed: true
          }
    },{
        // sort the todos by descending id values
        sort: {_id: -1},
        // do not create a new resource if resource to update is not found
        upsert: false
    })
    // when successful
    .then(result => {
        // console log that update was completed
        console.log('Marked Complete')
        // send response that request was completed to frontend in json format
        response.json('Marked Complete')
    })
    // if an exception was thrown, display the error in the console
    .catch(error => console.error(error))
})
// establish route handler, to handle PUT (update) requests made to endpoint '/markUnComplete'
// when received, execute callback handling async calls to db
app.put('/markUnComplete', (request, response) => {
    // access db collection named 'todos' and update a specific resource
    // using the data passed from the frontend containing information from the specific todo
    // search the db for a matching resource and
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // set its completed property to false
        $set: {
            completed: false
          }
    },{
        // sort the todos by descending id values
        sort: {_id: -1},
        // do not create a new resource if resource to update is not found
        upsert: false
    })
    // when successful
    .then(result => {
        // console log that update was completed
        console.log('Marked Complete')
        // send response that request was completed to frontend in json format
        response.json('Marked Complete')
    })
    // if an exception was thrown, display the error in the console
    .catch(error => console.error(error))
})
// establish route handler, to handle DELETE requests made to endpoint '/deleteItem'
// when received, execute callback handling async calls to db
app.delete('/deleteItem', (request, response) => {
    // access db collection named 'todos' and delete the specific resource
    // using data passed from the frontend containing information from the specific todo
    // search the db for a matching resource and delete it
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // when successful
    .then(result => {
        // console log that the deletion was completed
        console.log('Todo Deleted')
        // send a response that the request was completed to frontend in json format
        response.json('Todo Deleted')
    })
    // if an exception was thrown, display the error in the console
    .catch(error => console.error(error))
})
// have the server running / listen for requests on the port defined by the environment or local port
app.listen(process.env.PORT || PORT, ()=>{
    // if server is up, console log that server is running on the specified port
    console.log(`Server running on port ${PORT}`)
})