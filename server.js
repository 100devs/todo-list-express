// In order for functionality to be implemented more succinctly, this line is added so that express can be connected to the server
const express = require('express')
// Assigns th express method to the variable named "app"
const app = express()
// Creates a new Mongo client instance that connects server to MongoDB
const MongoClient = require('mongodb').MongoClient
// Assigns primary port number to access server on
const PORT = 2121
// Loads environment variables from an .env file into the actual process.env object.
require('dotenv').config()

// Creates the 3 different variables that will be needed throughout the server build.
let db,
    // Prepares for connection of the server to MongoDB client whilst giving privacy so that others cannot hack the server
    dbConnectionStr = process.env.DB_STRING,
    // Name of the database to be used throughout server connection
    dbName = 'todo'

// Actually connects the server to the MongoDB client    
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // Checks to see if client is connected to server
    .then(client => {
        // If so, then the template literal `Connected to [name of database] Database` will pop up in the console
        console.log(`Connected to ${dbName} Database`)
        // assigning database name to the db variable to be used whenever is needed
        db = client.db(dbName)
    })

// Express will load the module called "ejs" internally; to be used as a template
app.set('view engine', 'ejs')
// Express will then take ahold access of any and all folders/items that live within the public folder
app.use(express.static('public'))
// Causes server to recognize the incoming POST or PUT request object whichever data type applies 
app.use(express.urlencoded({ extended: true }))
// Causes server to recognize the incoming POST or PUT as a JSON object
app.use(express.json())

// The application starts from the root (or base) with an async function
app.get('/',async (request, response)=>{
    // Declares a variable named "todoItems" which contains awaited responses and stores collection to do items as an array.
    const todoItems = await db.collection('todos').find().toArray()
    // Defines a variable named "itemsLeft" which contains awaited responses; these items end up here when there are items left over; 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Displays items from the index.ejs files that fall in to the category of whats todo and what items are left.
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

app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

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

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})