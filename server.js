//Import the 'express' library
const express = require('express')
//Create the instance of the express application
const app = express()
//Import the 'MongoClient' class from the 'mongodb' library
const MongoClient = require('mongodb').MongoClient
//Define the port number for the server
const PORT = 2121
//Load environment variables from a .env file
require('dotenv').config()

//Declare variables for the database connection and configuration
let db,
    dbConnectionStr = process.env.DB_STRING,//MongoDB connection string from environment variables
    dbName = 'todo'//Database name

//Connect to the MongoDB database using the MongoClient
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)//Store the database connection
    })

//Set the view engine to EJS
app.set('view engine', 'ejs')
//Serve static files from the 'public' directory
app.use(express.static('public'))
//Enable parsing of URL-encoded and JSON data in requests
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//Define a route for the root URL('/) using an async function
app.get('/',async (request, response)=>{
    //Retrieve todo items from the 'todos' collection in the database and convert them to an array
    const todoItems = await db.collection('todos').find().toArray()

    //Count the number of uncompleted items in the 'todos' collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //Render the 'index.ejs' template with data and send it as a response
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

//Define a route for adding a new todo item
app.post('/addTodo', (request, response) => {
    //Insert a new todo item into the 'todos' collection with the specified data
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//Define a route for marking a todo item as complete
app.put('/markComplete', (request, response) => {
    //Update the specified todo item in the 'todos' collection to mark it as completed
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

//Define a route for marking a completed todo item as incomplete
app.put('/markUnComplete', (request, response) => {
    //Update the specified todo item in the 'todos collection to mark it as incomplete
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

//Define a route for deleting a todo item
app.delete('/deleteItem', (request, response) => {
    //Delete the specified todo item from the 'todos' collection
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//Start the server ,listening on the specified port or a dynamic port
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})