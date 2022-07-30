/// create an express application
const express = require('express')
// Calling express to be able to use express 
const app = express() 
// use Mongodb 
const MongoClient = require('mongodb').MongoClient
// declare port 
const PORT = 2121
/// loads environment variables from .env file
require('dotenv').config()

// Declare properties/variables of the database
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// Connection to database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

// Middlewares
// Allows ejs to be used    
app.set('view engine', 'ejs')
// Tells express to look in public folder and use those files
app.use(express.static('public'))
// Validates info that is passed, including arrays and JSONS
app.use(express.urlencoded({ extended: true }))
// Allows json body to be assessed 
app.use(express.json())

// handles GET requests from root which accepts request and response parameters
app.get('/', async (request, response)=>{
    /// go to database finding "todos" then converting to array
    const todoItems = await db.collection('todos').find().toArray()
    // go to database and find in "todos", look for property of "completed" with value of *false*
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    
    // Rendering into .ejs file, and putting in it todoItems & left 
    response.render('index.ejs', { items: todoItems, left: itemsLeft })


    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    .catch(error => console.error(error))
})
/// handles post requests which sends data to server 
app.post('/addTodo', (request, response) => {
    // Gets 'todos' and inserts new todo item 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        //refresh the page
        response.redirect('/')
    })
    // catching error and printing to the console
    .catch(error => console.error(error))
})

// handles put requests, which updates data in the server
app.put('/markComplete', (request, response) => {
    // gets 'todos' and updates 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            // change the 'completed' property value to 'true' in MongoDB document
            completed: true
          }
    },{
        // sorting using ID and newest first
        sort: {_id: -1},
        upsert: false
    })
    // after marking complete of the request, console.logs "marked complete"
    .then(result => {
        console.log('Marked Complete')
        // sent response in json format to front-end DOM
        response.json('Marked Complete')
    })
    // catches error if there is one 
    .catch(error => console.error(error))

})
/// handles put requests and updates data
app.put('/markUnComplete', (request, response) => {
    /// goes to database, finds "todos" and updates itemFromJs
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // changes the completed property to false 
        $set: {
            completed: false
          }
///  sort by id with ID and newest first
    },{
        sort: {_id: -1},
        upsert: false
    })
    // after request, console.log and send 'Marked uncomplete' to the DOM
    .then(result => {
        console.log('Marked unComplete')
        response.json('Marked unComplete')
    })
    // catches error
    .catch(error => console.error(error))

})

// handles DELETE requests and updates the data in the server
app.delete('/deleteItem', (request, response) => {
    // goes into database and deletes item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //  after request, console.log 'Todo deleted' and send to the DOM
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    // catches error if there is one
    .catch(error => console.error(error))

})

// telling express where to listen to run application
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})