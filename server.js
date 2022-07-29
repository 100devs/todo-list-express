// declaring the variable express and assigning the value of require('express') so that you don't have to change it in multiple places
const express = require('express')
// declaring the variable app and assigning the value of the express() module so that you don't have to change it in multiple places
const app = express()
// declaring the variable MongoClient and assigning the value of require('mongodb').MongoClient so that you don't have to change it in multiple places
const MongoClient = require('mongodb').MongoClient
// declaring the constant variable PORT and assigning a port number to is so that you can easily change it later
const PORT = 2121

// importing the dotenv module and calling the config method, which reads from the .env file and adds them all to process.env
require('dotenv').config()

// declaring unassigned db variable
let db,
    // declaring dbConnectionStr variable and assigning process.env.DB_STRING, which is the data from .env
    dbConnectionStr = process.env.DB_STRING,
    // declaring dbName variable and assigning the string todo so that you don't have to change it in multiple places
    dbName = 'todo'

/* Connecting server to mongoDB client */
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    /* Console logs a string and assigns the database name when the promise is fulfilled */
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

/* sets 'ejs' as the renering engine for the .render() method */
app.set('view engine', 'ejs')

// serves 'public' folder contents as is
app.use(express.static('public'))
//middleware (intercepts requests/responses) - allows query data to be passed to server via request
app.use(express.urlencoded({ extended: true }))
// middle ware to load the json body parser for incoming requests
app.use(express.json())

// defvines a 'get method to the root of the se5r4ver
app.get('/',async (request, response)=>{
    // request to mongo to return all records from 'todos' collection in an array
    const todoItems = await db.collection('todos').find().toArray()
    // request to monogoDB to return 
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

// POST request to add items to todo list
app.post('/addTodo', (request, response) => {
    // Adds new todo item to the db, with the completed field defaulted to false.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // Handles returned promise, logs to the server console and redirects back to the root page.
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    // logs an error to the console if there is one.
    .catch(error => console.error(error))
})

// PUT request (update) updating one item in the todo list
app.put('/markComplete', (request, response) => {
    // selecting the 'todos' collection of our db and updating an item
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // using $set operator from mongoDB to change the completed key to true
        $set: {
            completed: true
          }
    },{
        // using the mongoDB sort method to sort by id. -1 means that we are getting the latest first (descending order)
        sort: {_id: -1},
        // setting the upsert (insert + update) mongoDB method to false
        upsert: false
    })
    // Sends console log to server and in json format when the promise is completed.
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    // Sends console log to server if there is an error.
    .catch(error => console.error(error))

})

// Add request handler to the `PUT` method of the `/markUnComplete` path
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // UpdateFilter containing the `$set` update operator, telling MongoDB to set the completed property to false.
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

// handles DELETE requests at the defined endpoint
app.delete('/deleteItem', (request, response) => {
    // mongoDB function to delete a single todo item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // Handles returned promise, logs to the server console and sends json response.
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    // Sends message to server console if there is an error.
    .catch(error => console.error(error))

})
// Starts the server and tells it to listen on the environment's defined port number. It will default to the provided PORT number if the environment doesn't define the port.
app.listen(process.env.PORT || PORT, ()=>{
    // Logs to the server console if the server successfully starts
    console.log(`Server running on port ${PORT}`)
})