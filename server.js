// Import necessary dependencies, including express and MongoClient

const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

// add connection string for DB
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
//connect to DB using connection string
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

// Initialize app middlewares
// Set view engine for dynamic html files, static method set to piblic folder to serve all static files
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Set route for the root
app.get('/',async (request, response)=>{
    // search todo db and return todo items
    // establish count for remaining tasks
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // render index.ejs file, passing in our todo items arr and num of tasks remaining as data
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

// set POST route for adding a task
app.post('/addTodo', (request, response) => {
    // connect to our todo DB and insert a new task based on the data received in the HTTP request body
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// set route for updating a task as complete
app.put('/markComplete', (request, response) => {
    // connect to our todo DB and update corresponding item based on db search params
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // set new value indicating task completion
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        // send a response indicating success
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})


// set route for updating a task as complete
app.put('/markUnComplete', (request, response) => {
    // connect to our todo DB and update corresponding item based on db search params
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // update completed boolean to false
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        // send successful response as JSON message
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// set route for deleting a task
app.delete('/deleteItem', (request, response) => {
    // connect to our todo DB and delete corresponding item based on db search params
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        // send json success message if successful
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// listen for HTTP requests at the PORT
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
