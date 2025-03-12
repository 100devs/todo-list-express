// import Express module from Node.js package manager (npm)
const express = require('express')
// create an Express app
const app = express()
// import MongoDb package. MongoClient class allows connections to be made to MongoDB
const MongoClient = require('mongodb').MongoClient
// set endpoint for server, allowing it to listen for incoming  client-side requests 
const PORT = 2121
require('dotenv').config()

// initialize db (will assign value later when connecting to MongoDB database), dbConnectionStr (environment variable holding database connection string to connect to MongoDB database), and dbName (database name of 'todo') variables
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
// connect to MongoDB database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        //console log name of database once connected
        console.log(`Connected to ${dbName} Database`)
        // calls db() method on client object (usually MongoClient instance) and selects database by dbName. Assign matching object to db variable
        db = client.db(dbName)
    })
// set EJS (Embedded JavaScript) as the view engine in the express app 
app.set('view engine', 'ejs')
// middleware: serve static files (images, css, javascript) in the public folder
app.use(express.static('public'))
// middleware: get data from request body, usually used for form submissions
app.use(express.urlencoded({ extended: true }))
// middleware: parse JSON from req.body into JavaScript object (useful if clients send JSON from APIs)
app.use(express.json())

// when making get request from root route...
app.get('/', async (request, response) => {
// async/await option
    // const todoItems = await db.collection('todos').find().toArray()
    // const itemsLeft = await db.collection('todos').countDocuments({ completed: false })
    // response.render('index.ejs', { items: todoItems, left: itemsLeft })

    // find collection called 'todos' in database and add documents to an array (which can hold objects)
    db.collection('todos').find().toArray()
    // pass resulting array into parameter data
    .then(data => {
        //
        db.collection('todos').countDocuments({completed: false})
        .then(itemsLeft => {
            // data (items AKA objects in arr) passed into EJS
            response.render('index.ejs', { items: data, left: itemsLeft })
        })
    })
    .catch(error => console.error(error))
})

// when making post request (linked to 'addTodo' action on form that made post request) from addTodo route
app.post('/addTodo', (request, response) => {
    // grab value from request body containing todoItem, add to database and give completed value of false
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false })
        .then(result => {
            // console log for debugging
            console.log('Todo Added')
            // respond by refreshing & initiating get request 
            response.redirect('/')
        })
        // console log error if there is one
        .catch(error => console.error(error))
})

// when making put request from markcomplete route (linked to 'markComplete' action on form)
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
        // default is a false value for completed but this will now be set to true
        $set: {
            completed: true
        }
    }, {
        sort: { _id: -1 },
        // if true, updating something that wouldn't there creates document for you with value entered
        upsert: false
    })
    // respond with 'marked completed' in console log and respond as json
        .then(result => {
            console.log('Marked Complete')
            response.json('Marked Complete')
        })
        // return error if there is one
        .catch(error => console.error(error))

})

// when making put request from markUncomplete route (inked to 'markUncomplete' action)
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
        // set value for completed to false 
        $set: {
            completed: false
        }
    }, {
        sort: { _id: -1 },
        // if true, updating something that wouldn't there creates document for you with value entered
        upsert: false
    })
        .then(result => {
            // respond with 'marked completed' in console log and respond as json
            console.log('Marked Complete')
            response.json('Marked Complete')
        })
        //return error if there is one
        .catch(error => console.error(error))

})

// when making delete request from deleteItem route... 
app.delete('/deleteItem', (request, response) => {
    // go to databas, find property with matching thing property, and delete
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS })
        .then(result => {
            // respond with todo deleted
            console.log('Todo Deleted')
            response.json('Todo Deleted')
        })
        // return error if there is one
        .catch(error => console.error(error))

})

// set up Express app to listen for requests on a specific port 
// PORT variable is set by us but process.env.PORT is the PORT environment variable, which can be set on the server where the app is running (usually when deploying to another platform)
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`)
})