// import express module (a JS file/library that you can import into other code)
const express = require('express')
// saves express as a function in the variable
const app = express() 
// import mongo module
const MongoClient = require('mongodb').MongoClient
// setting port extension 
const PORT = 2121
// import dotenv file code, which contains the database string with username/password for the database
require('dotenv').config()

// declare three variables for the database
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// connects the database to the server.js file
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // returns the DB client as a Promise
    .then(client => {
        // console logs when the DB connection has been completed
        console.log(`Connected to ${dbName} Database`)
        // reassigns the db variable as the DB returned from the Promise on line 20
        db = client.db(dbName)
    })
    
// setting out templating language to EJS
app.set('view engine', 'ejs')
// shortcut to send any file from the public folder immediately
app.use(express.static('public'))
// returns middleware that only parses JSON and only looks at requests where the content-type header matches the type option (https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded)
app.use(express.urlencoded({ extended: true }))
// returns middleware that only parses JSON and only looks at requests where the content-type header matches the type option (https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded)
app.use(express.json())

// READ: whenever we get a request for the home page, the async event handler will be triggered. Since we don't know how long it will take us to receive the info, we tag it async
app.get('/',async (request, response)=>{
    // we pull all of our 'todo' out of our db collection and put it into an array and set todoItems value to the array
    const todoItems = await db.collection('todos').find().toArray()
    // we pull all of our 'todo' out of our db collection and counts how many to do list items have the attribute 'false'
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // will send the response to the 'index.ejs' file
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    
    // Commented out code is the same as above but without using Promises

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// CREATE: whenever we get a request to create a new document, the event handler will be triggered
app.post('/addTodo', (request, response) => {
    // accesses database collection todos, insertOne (add) one thing - item - append to body the todo item created
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // if the Promise is successfully resolved, the server will complete the 'then' method and refresh the page
    .then(result => {
        // console log goes to the server
        console.log('Todo Added')
        // redirect to the home page to update the list with the new added to do
        response.redirect('/')
    })
    // if error, console log the error
    .catch(error => console.error(error))
})

// UPDATE: whenever we get a request to update a document (mark complete), the event handler will be triggered
app.put('/markComplete', (request, response) => {
    // identify the item as item from JS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // command to set completed to true value; this is a MongoDB command
        $set: {
            completed: true
          }
    },{
        // changes id to -1, so we can sort the todo list
        sort: {_id: -1},
        // update and insert, searches body for item, if not found - if upsert were true it would create a new item, since false it does not
        upsert: false
    })
    // when the Promise is fulfilled, then return console.log and response.json
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// UPDATE: whenever we get a request to update a document (mark uncomplete), the event handler will be triggered
app.put('/markUnComplete', (request, response) => {
    // identify the item as item from JS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // command to set completed to false value; this is a MongoDB command
        $set: {
            completed: false
          }
    },{
        // changes id to -1, so we can sort the todo list
        sort: {_id: -1},
        // update and insert, searches body for item, if not found - if upsert were true it would create a new item, since false it does not
        upsert: false
    })
    // when the Promise is fulfilled, then return console.log and response.json
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// DELETE: whenever we get a request to delete a document, the event handler will be triggered
app.delete('/deleteItem', (request, response) => {
    // identify the item as item from JS
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// it tells the server to listen to a specific port for requests
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})