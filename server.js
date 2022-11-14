// Initiate express modules
const express = require('express')
const app = express()
// Initiate MongoDB database
const MongoClient = require('mongodb').MongoClient
// Initiate port # for local host
const PORT = 2121
// Initiate heroku environment configuration
require('dotenv').config()

// Initiate database connectors
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// Connect to MongoDB database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // Log the successful connection
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

// Initiate EJS template modules
app.set('view engine', 'ejs')
// Locate the folder with static files
app.use(express.static('public'))
// Initiate .urlencoded middleware (for PUT and POST reqs) to recognize the incoming Request Object as strings or arrays
app.use(express.urlencoded({ extended: true }))
// Initiate .json middleware to recognize the incoming Request Object as a JSON Object
app.use(express.json())

// Asynchronous Server API handling GET (read) requests from the client on the root route
app.get('/',async (request, response)=>{
    // Variable storing the list of tasks as objects in array.
    const todoItems = await db.collection('todos').find().toArray()
    // Variable storing the number of uncompleted tasks.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Respond with EJS template injected with the list of tasks
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

// Server API handling POST (create) requests from the client on '/addTodo' route
app.post('/addTodo', (request, response) => {
    // Add new task into the data base
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        // In case of success, console log the 'Todo Added',
        console.log('Todo Added')
        // refresh the client
        response.redirect('/')
    })
    // In case of error, console log error body.
    .catch(error => console.error(error))
})

// Server API handling PUT (update) requests from the client on '/markComplete' route
app.put('/markComplete', (request, response) => {
    // Update the status of the DB document passed in by the client-side JS event listener to 'true'.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Set the complete property to 'true'
        $set: {
            completed: true
          }
    },{
        // Sort the task in ascending order by ID
        sort: {_id: -1},
        upsert: false
    })
    // If successfull
    .then(result => {
        // Log 'Marked Completed' in the console
        console.log('Marked Complete')
        // Send the response to the client with 'Marked Complete' in JSON format
        response.json('Marked Complete')
    })
    // If unsuccsessfull, log the error body in the console
    .catch(error => console.error(error))

})

// Server API handling PUT (update) requests from the client on '/markUnComplete' route
app.put('/markUnComplete', (request, response) => {
    // Update the status of the DB document passed in by the client-side JS event listener to 'false'
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Set the complete property to 'false'
        $set: {
            completed: false
          }
    },{
        // Sort the task in ascending order by ID
        sort: {_id: -1},
        upsert: false
    })
    // If successfull
    .then(result => {
        // Log 'Marked Uncomplete' in the console
        console.log('Marked Uncomplete')
        // Send the response to the client with 'Marked Uncomplete' in JSON format
        response.json('Marked Uncomplete')
    })
    // If unsuccsessfull, log the error body in the console
    .catch(error => console.error(error))

})

// Server API handling DELETE requests from the client on '/deleteItem' route
app.delete('/deleteItem', (request, response) => {
    // Delete the DB document passed in by the client-side JS event listener
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // If successfull
    .then(result => {
        // Log 'Todo Deleted' in the console
        console.log('Todo Deleted')
        // Send the response to the client with 'Todo Deleted' in JSON format
        response.json('Todo Deleted')
    })
    // If unsuccsessfull, log the error body in the console
    .catch(error => console.error(error))

})

// Initiate the sever running on either the remote or local server
app.listen(process.env.PORT || PORT, ()=>{
    // Log the message upon success
    console.log(`Server running on port ${PORT}`)
})