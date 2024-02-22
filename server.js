// import express framework
const express = require('express')
// creates instance of Express to app variable
const app = express()
// import mongodb.client from mongodb module
const MongoClient = require('mongodb').MongoClient
// save port number to PORT variable
const PORT = 2121
// load environment variables from .env file into process.env
require('dotenv').config()

// initalize db variable
let db,
// sets the value of the environment variable to dbConnectionSTR
// environment variables are often used to store sensitive information such as database credentials or API keys
    dbConnectionStr = process.env.DB_STRING,
// sets dbName to string 'todo'. Likely the name of the database
    dbName = 'todo'

//connect to mongoDB database and console.log success message
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
//MIDDLEWARE
// sets view engine to EJS
app.set('view engine', 'ejs')
// allows any files in public folder to be accessible to clients from / route
app.use(express.static('public'))
// parses incoming requests with URL-encoded payloads. Mostly used to parse form submissions sent via POST requests.
app.use(express.urlencoded({ extended: true }))
// parses incoming requests with JSON payloads. Useful for receiving data from API or AJAX
app.use(express.json())


// ROOT '/' ROUTE
// sets up GET request
app.get('/',async (request, response)=>{
    // gets all the items in the 'todo' db collection and stores in the array todoItems
    const todoItems = await db.collection('todos').find().toArray()
    // counts how many items in the 'todos' collection that are not completed. 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //sends HTML page to user, generated from the template called 'index.ejs'
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
})


// '/addTodo' ROUTE
// sets up POST reqest
app.post('/addTodo', (request, response) => {
    // creates new item in the todo collection. has two properties, the 'todo' and a completed true or false/
    // console.log success message and redirects
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// '/markComplete' ROUTE
// sets up a PUT request
app.put('/markComplete', (request, response) => {
    // find a single document that matches 'thing: ...' and changes complete to true
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
        }
    },{
        // sorts the results in descending order by _id field
        sort: {_id: -1},
        // if no match found, do nothing
        upsert: false
    })
    // console.log and respond JSON with success message
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))
})

// '/markUnComplete' Route
// sets up PUT request
app.put('/markUnComplete', (request, response) => {
    // find item in todos collection that matches 'thing... ' and set complete to false
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
        }
    },{
        // sort by _id
        sort: {_id: -1},
        //if no match do nothing
        upsert: false
    })
    //console.log and respond JSON with success message
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))
})

// '/deleteItem' ROUTE
// set up DELETE request
app.delete('/deleteItem', (request, response) => {
    // find item in todos collection that matches 'thing...' and delete item from collection
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        //console.log and respond JSON with success message
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))
})

// tells server to listen to requests/
// either PORT in the environment variable or PORT that was assigned at top
// console.log success message 
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})