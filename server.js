// Reuqiring necessary modules
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()
// Setting local port
const PORT = 2121

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// Connection to database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        // Successful connection message
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

// Creating ejs template
app.set('view engine', 'ejs')
// Setting static folder/path
app.use(express.static('public'))
// Parse incoming req object as strings & arrays
app.use(express.urlencoded({ extended: true }))
// Parsing incoming JSON data
app.use(express.json())

// Handling (/) get request
app.get('/',async (request, response)=>{
    // Obtain to-do documents/objects (list items) from database
    const todoItems = await db.collection('todos').find().toArray() 
    // Obtains no. of incomplete tasks
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) 
    // Data objects (list items) passed into ejs template
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

// Handling (/addTodo) post request
app.post('/addTodo', (request, response) => {
    // todoItem from request is added to database
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) 
    .then(result => {
        // Success message & Refresh triggered after document creation
        console.log('Todo Added')
        response.redirect('/')
    })
    // Handling error
    .catch(error => console.error(error))
})

// Handling (/markComplete) put request
app.put('/markComplete', (request, response) => {
    // Update first document with 'thing' property from inputted text
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ 
        $set: {
            // Set document's 'completed' property to true
            completed: true
          }
    },{
        // Allows us to grab first item matching condition
        sort: {_id: -1},
        // If we can't find target object, New one WILL NOT be inserted 
        upsert: false
    })
    .then(result => {
        // Success message/response
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    // Handling error
    .catch(error => console.error(error))

})

// Handling (/markUncomplete) put request
app.put('/markUnComplete', (request, response) => {
    // Update first document with 'thing' property from inputted text
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ 
        $set: {
            // Change document's 'completed' property to false
            completed: false 
          }
    },{
        // Allows us to grab first item matching condition
        sort: {_id: -1},
        // If we can't find target object, New one WILL NOT be inserted 
        upsert: false
    })
    .then(result => {
        // Success message/response
        console.log('Marked Uncomplete')
        response.json('Marked Uncomplete')
    })
    // Handling error
    .catch(error => console.error(error))

})


app.delete('/deleteItem', (request, response) => {
    // Delete document from database
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // Delete document from database
    .then(result => {
        // Success message/response
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    // Handling error
    .catch(error => console.error(error))

})

// Conncting to server
app.listen(process.env.PORT || PORT, ()=>{
    // Successful connection message
    console.log(`Server running on port ${PORT}`)
})