// Import Express library and assign to variable `express`
const express = require('express')
// Call the Express function and create instance of Express application
const app = express()
// Import MongoDB client
const MongoClient = require('mongodb').MongoClient
// Defines port number where server will listen for requests
const PORT = 2121
// Loads environment variables from `.env` file into `process.env`
require('dotenv').config()

// Sets up variables necessary for conencting to database named `todo` and the string stored in `process.env`
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// Connects to database and console logs when connection is successful
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

// Sets templating language for Express applicaiton as EJS to generate HTML
app.set('view engine', 'ejs')
// Tells Express application to serve static files (CSS and JS) in `public` file
app.use(express.static('public'))
// Tells Express application to use middleware that can read and process url-encoded data from requests
app.use(express.urlencoded({ extended: true }))
// Parses incoming requests as JSON format
app.use(express.json())

// Handles GET requests to root URL
app.get('/',async (request, response)=>{
    // Goes to database and finds all items in the `todos` collection and converts it to an array and stores it into `todoItems` variable
    const todoItems = await db.collection('todos').find().toArray()
    // Goes to database and counts all the objects in the `todos` collection with a `completed` property of `false`
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Renders the `index.ejs` template, passing the `todoItems` and `itemsLeft` variables into the template
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

// Defines route handler for POST requests to `/addToDo` endpoint
app.post('/addTodo', (request, response) => {
    // Goes to database collection `todoes` and adds a new document with data from the request body 2 properties, including property `thing` with a value of `todoItem`
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // Once the document is added to the collection, console log and redirects to root URL
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// defines route handler for PUT requests to `/markComplete` endpoint
app.put('/markComplete', (request, response) => {
    // Updates one document with `thing` property and value `itemFromJS` in `todos` collection with `completed` of `true`
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1}, // Sort by descending `_id`
        upsert: false // Don't insert a new document to collection if not found
    })
    // If successul update, console logs and sends JSON response
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    // Catches and logs any errors that occur in PUT
    .catch(error => console.error(error))

})

// Handles PUT requests to `/markUncComplete` enpoint
app.put('/markUnComplete', (request, response) => {
    // Updates one document in `todos` collection that matches property `thing` and value of `itemFromJS` from request body
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Updates `completed` property to `false`
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1}, // Sorts `_id` in descending order
        upsert: false // Do not add new document if not found
    })
    // If successul, console log it and respond with JSON data
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// Handles DELETE request to remove an item from `todos` list
app.delete('/deleteItem', (request, response) => {
    // Goes into database to collection `todos` and deletes document that matches with value from request body of `itemFromJS` 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // If deleted, console log `Todo Deleted` and send a JSON response
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    // If delete operation failes, console log the `error`
    .catch(error => console.error(error))

})

// Express application listens for incoming requests on specified  port provides a fallback URL. Logs to console if succesful
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})