// Comments by Ashley Christman, Stacey Ali, Omar Hernandez, Mark Fehrenbach, Ryan Hardin, Kimberly Scranton

// Instantiate Express
const express = require('express')
const app = express()
// Instantiate MongoDB
const MongoClient = require('mongodb').MongoClient
// Define Default Port
const PORT = 2121
// Instantiate dotenv environment variables
require('dotenv').config()

// Define MongoDB Variables
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo-list-express'

// Connect to MongoDB database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
//Middleware
// Set EJS    
app.set('view engine', 'ejs')
// Set Public folder
app.use(express.static('public'))
// Use URL Encoding
app.use(express.urlencoded({ extended: true }))
// Parse JSON
app.use(express.json())

// Home Route
app.get('/',async (request, response)=>{
    // Returns collection of todos as array
    const todoItems = await db.collection('todos').find().toArray()
    // Returns count of items left that are incomplete
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Renders prior two variables into index.ejs
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

// Add new list item - Add to database, console log, then redirect to home route
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})


// Mark database item as complete when clicked
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
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


// Mark completed database item as incomplete when clicked
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
        console.log('Marked Inomplete')
        response.json('Marked Incomplete')
    })
    .catch(error => console.error(error))

})

// Delete database item when delete button is clicked
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})


// Run server on port defined in env. variable OR default port defined above
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})

