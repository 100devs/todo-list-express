// Importing express, giving us access to its methods
const express = require('express')
// Assigning express to the app variable
const app = express()
// Importing MongoDB client method
const MongoClient = require('mongodb').MongoClient
// Assigning the port we will use to a CONST variable.
const PORT = 2121
// Importing dotenv, this allows us to use .env, in which we can create variables for PORT, and the database string
// With them inside .env, and added to .gitignore, they will be accessable by our server, but hidden from outside users.
require('dotenv').config()

// Declaring the db variable.
    // Declaring the database connection string, which is inside the .env file
    // Declaring the database name to 'todo'
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// This block is connecting to the database with the endpoint being the db connection string.
    // useUnifiedTopology is doing what?
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        // Success string logged to console
        console.log(`Connected to ${dbName} Database`)
        // Assigning the now connected datebase to db variable
        db = client.db(dbName)
    })
// Setting the view html template view engine to ejs
app.set('view engine', 'ejs')
// Giving express access to the public folder, making it the static/default directory where express will look for required files
app.use(express.static('public'))
// Tells express to automatically encode and decode URLS
app.use(express.urlencoded({ extended: true }))
// espress.json allows express to work with json data
app.use(express.json())

// Get request, READ.
    
app.get('/', async (request, response)=>{
    // Searching the 'todos' database and creatng an array of all items in the current todo list, assigning to todoItems
    const todoItems = await db.collection('todos').find().toArray()
    // Searching the 'todos' database for all documents that meet the 'completed: false' parameter and returing total count.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Render the ejs file, and pass (as json?) the todoItems and itemsLeft
    response.render('index.ejs', { items: todoItems, left: itemsLeft })

    // This is what you would have to do WITHOUT using async in the get request.
            // Nesting each find, and countDocuments.

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// Post Method, CREATE, this is adding a new todo item.
app.post('/addTodo', (request, response) => {
    // Adding one new todo into the datebase
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // If success, log success message and redirect to the '/' endpoint
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    // Logs error message
    .catch(error => console.error(error))
})

// Put method. UPDATE
app.put('/markComplete', (request, response) => {
    // Searching and finding the todo in database that matches req.body.itemFromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Setting the completed variable on the todo in the datebase to 'true'
        $set: {
            completed: true
          }
    },{
        // Sorting by id, in decending order
        sort: {_id: -1},
        // If upsert was true, and the todo item DID NOT have a completed property, one would be created
        upsert: false
    })
    // Success is logged, and returned to the markCompleted fetch in main.js
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    // Error msg
    .catch(error => console.error(error))

})

// Same as above, except using a seperate fetch in main.js to set items as UNCOMPLETED.
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


// Delete method, DELETE.
app.delete('/deleteItem', (request, response) => {
    // Search and find one todo item in database and delete it
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // Success message
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    // Error message
    .catch(error => console.error(error))

})


// Setting the servers PORT 
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})