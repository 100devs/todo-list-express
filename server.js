// Imports
const express = require('express') // Adds express
const app = express() // Sets the instance of express to 'app'
const MongoClient = require('mongodb').MongoClient // Imports the MongoDB client.
const PORT = 2121  // Default port.

// Import config.
require('dotenv').config({ path: './config/config.env'})

// Initialise the db fields.
let db,
    dbConnectionStr = process.env.DB_URI,
    dbName = 'todo'

// Connects to DB.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) // sets the db object to the 'todo' db in your MongoDB
    })
    

// Middleware for EJS.
app.set('view engine', 'ejs') // Sets the render engine to 'ejs'
app.use(express.static('public'))  // This will use the 'public' folder for the static assets folder.
app.use(express.urlencoded({ extended: true })) // Will allow express to use URLEncoded strings.
app.use(express.json()) // Allows express to respond with JSON.

// Root index.
app.get('/',async (request, response)=>{
    // An array of items on the todo list.
    const todoItems = await db.collection('todos').find().toArray()
    // An array of items that are not complete on the list.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Renders index.ejs with 'items' and 'left' as parameters passed.
    response.render('index.ejs', { 
        items: todoItems, 
        left: itemsLeft 
    })
})

// Function to clear completed items.
app.post('/clear', (request, response) => {
    db.collection('todos').deleteMany({ completed: true }) // Deletes all completed items.
    response.redirect('/') // Goes back to root.
})

// Function to change all incomplete items to "Pet Codex" (My cat)
app.post("/pet", (request, response) => {
  db.collection("todos").updateMany(
    { completed: false },
    { $set: {
        thing: "Pet Codex"
    }}
  )
  response.redirect("/") // Goes back to root.
})

// Add a new item to the todo list.
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// Mark a task as completed.
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1}, // Sorts by ID from high to low (?)
        upsert: false // Will not default to insert if nothing found to update.
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete') // Responds with a json object of 'Marked Complete'.
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

// Deletes a specific task from the db.
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// Launches the server to listen on the imported port.
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})