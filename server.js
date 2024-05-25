//Import Express library that's accessed by variable app. 
//Import MongoClient from MongoDB.
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
//Assign 2121 to PORT. Can be any port not already in use.
const PORT = 2121
//Import config from Dotenv library.
require('dotenv').config()

//Assign connection string from dotenv.
//Our Mongo database name is 'todo'.
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//Connect to 'todo' database using the connection string.
//Of the 7 topology classes, we are using Unified Topology:
// - fully support Server Discover and Monitoring, Server Selection and Max Staleness specs
// - reduce maintenance, model all supported topolgy types with a single engine
// - remove confusing functionality
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
//The view engine/HTML template we are using is EJS.
app.set('view engine', 'ejs')
//Default folder to access static resources (imgs, js, css, etc) is 'public'
app.use(express.static('public'))
//Recognise requested objects as strings or arrays.
app.use(express.urlencoded({ extended: true }))
//Recognise requested JSON objects.
app.use(express.json())

//GET request from path '/'
//Asynchronously execute the callback function.
app.get('/',async (request, response)=>{
    //Await variable values to be assigned from the database before continuing.
    //todoItems holds an array.
    //itemsLeft will hold a number representing the amount of objects with the attribute completed with the value false.
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //Render our HTML template file. Local variables (item, left) are assigned values for the view (HTML template file).
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    //Code below uses promises with .then and .catch handlers instead of async/await above.
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//POST response to path '/addTodo'
app.post('/addTodo', (request, response) => {
    //Insert an object into the database. Variables (thing, completed) are assigned values. Requesting from the body (main content, index.ejs).
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //Then handler redirect the user back to path '/'. Catch errors
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//UPDATE response to path '/markComplete'
app.put('/markComplete', (request, response) => {
    //Update database with request from the body (main content, main.js)
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //Replace the value of variables (completed).
        $set: {
            completed: true
          }
    },{
        //Sort by _id in descending order.
        sort: {_id: -1},
        //Update and Insert: when false does not insert a new document when no match is found.
        upsert: false
    })
    //Send 'Marked Complete' in response. Catch errors.
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//UPDATE response to path '/markUnComplete'
app.put('/markUnComplete', (request, response) => {
    //Update database with request from the body (main content, main.js)
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //Replace the value of variables (completed).
        $set: {
            completed: false
          }
    },{
        //Sort by _id in descending order.
        sort: {_id: -1},
         //Update and Insert: when false does not insert a new document when no match is found.
        upsert: false
    })
    //Send 'Marked Complete' in response. Catch errors.
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//DELETE in response to path '/deleteItem'
app.delete('/deleteItem', (request, response) => {
    //Delete from database the requested data from body (main content, main.js)
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //Send 'Todo Deleted' in response. Catch errors.
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//To access what is being served, and send requests we must go to where the server is listening.
//We will try the port supplied by dotenv, otherwise we are sent to port 2121.
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})