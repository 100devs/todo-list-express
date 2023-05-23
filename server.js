const express = require('express')  // Sets up Express for use
const app = express()   // Set the app variable to be Express for convenience
const MongoClient = require('mongodb').MongoClient  // Sets up MongoDB for use
const PORT = 2121   // Sets the port to be used for this server
require('dotenv').config()  // Sets up the dotenv dependency


let db, // Global variable for MongoDB database
    dbConnectionStr = process.env.DB_STRING,    // Variable for MongoDB connection string
    dbName = 'todo' // Variable for database name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })  // Creates a connection to MongoDB database using our connection string
    .then(client => {   // Waits for the connection to be made and then continues if successful
        console.log(`Connected to ${dbName} Database`)  // Logs successful connection string to console
        db = client.db(dbName)  // Selects the specified MongoDB database
    })
    
app.set('view engine', 'ejs')   // Sets EJS as the render method
app.use(express.static('public'))   // Sets the location for static assets to be used by clients
app.use(express.urlencoded({ extended: true })) // Express middleware function which parses incoming request objects as strings or arrays
app.use(express.json()) // Express middleware function that parses incoming requests with JSON content


app.get('/',async (request, response)=>{    // GET request on the root route
    const todoItems = await db.collection('todos').find().toArray() // Variable that awaits all DB objects from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})   // Variable that awaits the count of uncompleted DB documents
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // Renders EJS file with all specified DB documents and the count of uncompleted documents
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {   // POST request on the /addTodo route
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})  // Inserts a new document into the todos collection
    .then(result => {   // Gets the item from the form and sets the value of the completed property to be false by default
        console.log('Todo Added')   // Logs message to console
        response.redirect('/')  // Redirects client to root route (refresh)
    })
    .catch(error => console.error(error))   // Catch for errors and logs to console
})

app.put('/markComplete', (request, response) => { // PUT request on the /markComplete route
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Searches DB for item matching the name of the item being passed
        $set: { // Modify object property
            completed: true // Sets the value of the completed property to be true
          }
    },{
        sort: {_id: -1},    // Moves item to the bottom of the list
        upsert: false   // Prevents a new document from being created if it doesn't already exist
    })
    .then(result => {   // If the update was successful
        console.log('Marked Complete')  // Logs message to console
        response.json('Marked Complete')    // Responds with JSON message
    })
    .catch(error => console.error(error))   // Catch for errors and logs to console

})

app.put('/markUnComplete', (request, response) => { // PUT request on the /markUnComplete route
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Searches DB for item matching the name of the item being passed
        $set: { // Modify object property
            completed: false    // Sets the value of the completed property to be false
          }
    },{
        sort: {_id: -1},    // Moves item to the bottom of the list
        upsert: false   // Prevents a new document from being created if it doesn't already exist
    })
    .then(result => {   // If the update was successful
        console.log('Marked Complete')  //  Logs message to console
        response.json('Marked Complete')    // Responds with JSON message
    })
    .catch(error => console.error(error))   // Catch for errors and logs to console

})

app.delete('/deleteItem', (request, response) => {  // DELETE request on the /deleteItem route
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})  // Searches DB for item matching the name of the item being passed
    .then(result => {   // If the delete was successful
        console.log('Todo Deleted') // Logs message to console
        response.json('Todo Deleted')   // Responds with JSON message
    })
    .catch(error => console.error(error))   // Catch for errors and logs to console

})

app.listen(process.env.PORT || PORT, ()=>{  // Specifies the port to be used by the server to either the port set in .env or PORT variable
    console.log(`Server running on port ${PORT}`)   // Logs message to console
})