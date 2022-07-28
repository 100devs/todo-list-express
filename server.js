// Collecting depencies
// Import Express Library
const express = require('express')
// Create instance of Express / shortcut
const app = express()
// Import Mongo client
const MongoClient = require('mongodb').MongoClient
// Setup port for Express to listen to
const PORT = 2121
// Call/import .env
// Link to the .env file
require('dotenv').config()

// initialize variables for db
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo';

// Initialize the connection to MongoDB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    // Adding catch for error handling
    .catch(err => console.error(err))

// Tells Express we're using EJS to render
app.set('view engine', 'ejs')
// Tells ? anything in the public folder be used as is
app.use(express.static('public'))
// middleware - allows data to be passed to server via request
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Defines a get method at the root of the server
app.get('/', async (request, response)=>{
    //request to mongo to return all records from 'todos' collection, in an array
    const todoItems = await db.collection('todos').find().toArray()
    // Counting all the documents that haven't been completed yet
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
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

// POST method for receiving new todo item
app.post('/addTodo', (request, response) => {
    // adds new todo to the db, with the completed field defaulted to false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // handles returned promise, logs to the server console and redirects to the root server
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
    // updates a record, using value recieved from "itemFromJS" in the body of the request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        // Place item at the end
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
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

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// starts the server and waits for requests.
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})