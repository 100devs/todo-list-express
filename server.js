// Requiring Express
const express = require('express')
// Saving the express call to the 'app' variable'
const app = express()
// Requiring Mongodb
const MongoClient = require('mongodb').MongoClient
// Declaring port variable
const PORT = 2121
// Requiring dotenv
require('dotenv').config()

let db,     // Declaring an empty 'db' variable, 
    dbConnectionStr = process.env.DB_STRING, // a connection string variable that gets the string from .env or heroku's variables
    dbName = 'todo' // Declaring the name of the database to the 'dbName' variable

// Connecting to the database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

    // Setting up EJS   
app.set('view engine', 'ejs')
    // Setting up the public folder
app.use(express.static('public'))
    // Tells express to decode and encode URLs automatically
app.use(express.urlencoded({ extended: true }))
    // Tells express to use JSON
app.use(express.json())

// Responding to a get request to the '/' route
app.get('/', async (request, response)=>{
    // Getting to-do items from the database
    const todoItems = await db.collection('todos').find().toArray()
    // Getting items with a 'completed' value of 'false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Sending over the variables todoItems and itsmeLeft to EJS
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

// Responding to a post request to the /'addTodo' route
app.post('/addTodo', (request, response) => {
    // Inserting a new todo item into the list
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})

    // Console logging that the todo list was added, then telling client to refresh the page
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    // Console log errors if they occur
    .catch(error => console.error(error))
})

// Responding to an update request to mark an item complete
app.put('/markComplete', (request, response) => {
   // Going into database, collection 'todos', and finding a document that matches request.body.itemFromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Setting that document's 'completed' status to true
        $set: {
            completed: true
          }
    },{
        // Sorting by oldest first
        sort: {_id: -1},
        // If the document doesn't already exist, don't create a new one
        upsert: false
    })
    // Console logging that it's been marked complete, and also responding back to the client in JSON, saying it's been marked complete
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    // Console logs errors if there are any
    .catch(error => console.error(error))

})

// Responding to an update request to mark an item uncomplete
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

// Responding to a request to delete an item from the list 
app.delete('/deleteItem', (request, response) => {
    // Going into the database and deleting the item that matches request.body.itemFromJS
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // Console logging and responding to the client that it's been deleted
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    // Console logs errors if there are any
    .catch(error => console.error(error))

})

// Setting the server to listen to requests
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})