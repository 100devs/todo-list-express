// Imports express for use
const express = require('express')
// Assigns an easy handle to use for the express application
const app = express()
// Imports the mongoDB client for use
const MongoClient = require('mongodb').MongoClient
// Sets a default port number for the server
const PORT = 2121
// Enables the use and imports environment variables from the .env file
require('dotenv').config()

// Assigns needed variables for the database connection and name
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// Uses the mongo client to connect to the MongoDB database using the connection string
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        // Console logs to indicate a successful connection to the database
        console.log(`Connected to ${dbName} Database`)
        // Selects the specific database needed
        db = client.db(dbName)
    })
    
// Establishes EJS as the view engine to be used for rendering out HTML
app.set('view engine', 'ejs')
// Allows express to connect to and use any static files within the public folder
app.use(express.static('public'))
// Enables the server to obtain data from HTML forms
app.use(express.urlencoded({ extended: true }))
// Enables the server to obtain data from JSON
app.use(express.json())


// Read request using the GET method and the / route to connect to the homepage
app.get('/',async (request, response)=>{
    // Creates an array of all the to-do items found on the database
    const todoItems = await db.collection('todos').find().toArray()
    // Determines the integer amount of documents (aka to-do items) that are marked as completed:false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Renders both the array of to-do items and the uncompleted amount to the index.ejs file
    response.render('index.ejs', { items: todoItems, left: itemsLeft })

    // Previous version of code using a more basic method to achieve the needed results, lacking the 'async / await' functionality
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// Create request using the POST method and the /addTodo route to insert a new to-do item in the database
app.post('/addTodo', (request, response) => {
    // Adds a document to the database collection with the prefilled values of the provided to-do item from the request, as well as setting completed:false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        // Console logs that a to-do item was successfully added to the database
        console.log('Todo Added')
        // Redirects to the homepage, presumably with the new to-do item appearing
        response.redirect('/')
    })
    .catch(error => console.error(error)) // Console logs any errors should they occur during process
})

// Update request using the PUT method and the /markComplete route to assign a completed:true value to a specific to-do item
app.put('/markComplete', (request, response) => {
    // Find a document within the database collection that has thing = request.body.itemFromJS, then sets completed:true for that document
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        // Console logs that a to-do item was successfully marked as completed
        console.log('Marked Complete')
        // Responds to the server that the to-do item was marked as completed
        response.json('Marked Complete')
    })
    .catch(error => console.error(error)) // Console logs any errors should they occur during process

})

// Update request using the PUT method and the /markUnComplete route to assign a completed:false value to a specific to-do item
app.put('/markUnComplete', (request, response) => {
    // Find a document within the database collection that has thing = request.body.itemFromJS, then sets completed:false for that document
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        // Console logs that a to-do item was successfully marked as completed
        console.log('Marked Uncomplete') // changed line from 'Marked Complete' to 'Marked Uncomplete'
        // Responds to the server that the to-do item was marked as uncompleted
        response.json('Marked Uncomplete') // changed line from 'Marked Complete' to 'Marked Uncomplete'
    })
    .catch(error => console.error(error)) // Console logs any errors should they occur during process

})

// Delete request using the DELETE method and the /deleteItem route to remove a specified to-do item from the databse
app.delete('/deleteItem', (request, response) => {
    // Find a document within the database collection that has thing = request.body.itemFromJS, then deletes that document
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        // Console logs that a to-do item was successfully deleted
        console.log('Todo Deleted')
        // Responds to the server that the to-do item was deleted
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error)) // Console logs any errors should they occur during process

})

// Sets up the server to listen for connections from either a provided PORT number, or the one set above
app.listen(process.env.PORT || PORT, ()=>{
    // Console logs what port number the server is set to run on
    console.log(`Server running on port ${PORT}`)
})