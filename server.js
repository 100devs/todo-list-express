const express = require('express') // Import express module
const app = express() // Create express application
const MongoClient = require('mongodb').MongoClient // Import Mongo module
const PORT = 2121 // Define port where the server will listen
require('dotenv').config() // Enables reading env file


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo' // Storing database connectioon string and name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // Connect to MongoDB
    .then(client => { // Waiting for connection, then passing in client information
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) // Assign database
    })

app.set('view engine', 'ejs') // Set EJS as default render method
app.use(express.static('public')) // Sets location for static assets
app.use(express.urlencoded({ extended: true })) // Encode/deocde URLS where header matches the content
app.use(express.json()) // Parses JSON from requests


// Get todo list
app.get('/',async (request, response)=>{ // GET method for root route
    const todoItems = await db.collection('todos').find().toArray() // Awaits all items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // Awaits count of uncompleted items to tidplay
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // Render EJS template and pass through database items
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// Add a todo
app.post('/addTodo', (request, response) => { // POST method for add route
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // Insert new item into todos collection
    .then(result => { // If post is successful
        console.log('Todo Added')
        response.redirect('/') // Redirect back to root
    })
    .catch(error => console.error(error)) // Catch errors
})

// Mark todo as complete
app.put('/markComplete', (request, response) => { // PUT method for markComplete root
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Find item w/ matching name in database
        $set: {
            completed: true // Set completed to true
          }
    },{
        sort: {_id: -1}, // Move to bottom of list
        upsert: false // Prevents this if item doesn't exist
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete') // Sending response back to request origins
    })
    .catch(error => console.error(error))

})

// Mark todo as incomplete
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

// Delete todo
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