//Import express module into the application
const express = require('express')

//create an instance of an express application, define routes, handle middleware, and HTTP requests
const app = express()

//import MongoClient class from the mongodb module
const MongoClient = require('mongodb').MongoClient

//set port number to 2121
const PORT = 2121

//import and configure the dotenv module to load environment variable from a .env file
require('dotenv').config()

//declare variables for the database connection and configuration
let db,
    // get the database string from the environment variable
    dbConnectionStr = process.env.DB_STRING,
    // specify name for the database 
    dbName = 'todo'

// attempt to connect to the MongoDB database using Mongoclient
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        // upon successful connection, log a message indictating the successful connection in console
        console.log(`Connected to ${dbName} Database`)
        // set the 'db' variable to reference the connected database
        db = client.db(dbName)
    })

// set the view engine for rendering dynamic content to ejs
app.set('view engine', 'ejs')
// serve static files from the 'public' directory
app.use(express.static('public'))
// parse incoming request with urlencoded and jason payloads
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Handle get request to the root directory
app.get('/',async (request, response)=>{
    // fetch all todoitems from todo collection and convert it to an array 
    const todoItems = await db.collection('todos').find().toArray()
    // count the number of incomplete todoItems in the todo collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // render in index.ejs view and pass the data to be used in the template
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

// Handle post requests to the /addTodo endpoint. This route handler is responsible for receiving data from a form submission, inserting it into the database, and then redirecting the user to the root path
app.post('/addTodo', (request, response) => {
    // insert new todo item into todo collection with provided data as incomplete item
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        // log a message indicating that the todo was successfully added
        console.log('Todo Added')
        // redirect user to root path after adding todo
        response.redirect('/')
    })
    // log any errors 
    .catch(error => console.error(error))
})




// Handle PUT request to the /markComplete endpoint
app.put('/markComplete', (request, response) => {
    //update the todo collection to mark a todo as completed based on provided data
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ 
        $set: {
            completed: true //set completed field to true
          }
    },{
        sort: {_id: -1}, //sort by '_id' field in descending order
        upsert: false //do not perform an upsert(insert if not exist)
    })
    .then(result => {
        // log message indicating to do is marked complete
        console.log('Marked Complete')
        //response with a JSON message indicating successful completion
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//handle PUT request for /markUncomplete endpoint
app.put('/markUnComplete', (request, response) => {
    //update the todos collection as incomplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // filter condition
        $set: {
            completed: false // set completed field as false
          }
    },{
        sort: {_id: -1}, //sort _id in descending order
        upsert: false //do not perform an upsert
    })
    .then(result => {
        //log a message indicating the the todo was marked incomplete
        console.log('Marked Incomplete')
        // respond with JSON message indicating successfully marked as Incomplete
        response.json('Marked Incomplete')
    })
    .catch(error => console.error(error))

})

//Handle DELETE request to the /deleteItem endpoint
app.delete('/deleteItem', (request, response) => {
    // delete todoItem from todo collection based on provided data
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //filter condition
    .then(result => {
        //log message indicating that the todo was successfully deleted
        console.log('Todo Deleted')
        //respond with a json message indicating successful deletion
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//start server and listen for incoming requests
app.listen(process.env.PORT || PORT, ()=>{
    
    //log a message indicating that the server is running and listening to a specific port
    console.log(`Server running on port ${PORT}`)
})