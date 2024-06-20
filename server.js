// Import tools we'll be using
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

// Establishing variables for database, database connection string, and database name
let db,
    dbConnectionStr = process.env.DB_STRING, // grabbing connection string from env file
    dbName = 'todo' // ?

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })  // Try to connect to the database
    .then(client => {
        console.log(`Connected to ${dbName} Database`) 
        db = client.db(dbName) // grab db from the database based on dbName set above
    });

app.set('view engine', 'ejs') // set view to use ejs file type
app.use(express.static('public')) // set express to use public folder as location of static files
app.use(express.urlencoded({ extended: true })) // set express to parse url
app.use(express.json()) // set express to parse json

// GET request for main page, refresh
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray() // pull all existing todo items from db in array form
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // count uncompleted todo items
    response.render('index.ejs', { items: todoItems, left: itemsLeft })  // render index ejs with data pulled from db
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// POST request for adding a todo item
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // adds new todo item to collection, initialized to incomplete
    .then(result => {
        console.log('Todo Added')   // prints confirmation to the console
        response.redirect('/')  // redirects to root
    })
    .catch(error => console.error(error)) // catch any errors
})

// PUT request to update todo item to complete
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // grab selected todo item
        $set: {
            completed: true // updates complete to true
          }
    },{
        sort: {_id: -1}, // sort id in ascending order
        upsert: false // will not update existing item if already exists
    })
    .then(result => {
        console.log('Marked Complete') // print completion to console
        response.json('Marked Complete') // log competion in json response
    })
    .catch(error => console.error(error)) // catch any errors

})

// PUT request to update todo item to incomplete
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // grab selected todo item
        $set: {
            completed: false // updates complete to false
          }
    },{
        sort: {_id: -1}, // sort id in ascending order
        upsert: false // will not update existing item if already exists
    })
    .then(result => {
        console.log('Marked Complete') // print completion to console -> !! need to update text to say incomplete !!
        response.json('Marked Complete') // log completion in json response -> !! need to update text to say incomplete !!
    })
    .catch(error => console.error(error)) // catch any errors

})

// DELETE request to delete todo item
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // grab and delete selected todo item
    .then(result => {
        console.log('Todo Deleted') // print confirmation to conosole
        response.json('Todo Deleted') // log confirmation in json response
    })
    .catch(error => console.error(error)) // catch any errors

})

// Listen on port assigned in env file
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`) // log confirmation of port number to console
})