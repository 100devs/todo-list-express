// import express framework module
const express = require('express')
// create variable with express object
const app = express()
// import mongodb module
const MongoClient = require('mongodb').MongoClient
// declare variable for the port of the server
const PORT = 2121
// import keys or secret variables from the .env files
require('dotenv').config()

// declare database variable, create and assign mongodb variable with password to access database.
// dbName is our collection documents in mongodb
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// Start mongodob connection, console log if the connection to the 'todo' collection was good
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
// Promise to wait for the client data from mongodb
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

// Use set method of express to make 'ejs' the template engine and 'view engine' to get access to the views folder
app.set('view engine', 'ejs')
// Use use method of express to take request of files like css of js from client in our server 'public' folder
app.use(express.static('public'))
// Use use method to allow express to get data from the form in the client side
app.use(express.urlencoded({ extended: true }))
// Allow the server to understans json data
app.use(express.json())

// Get request of the root path, uses an async function instead of .then
// We are requesting the main page from our server with the current todos of the database
// We are responding with an array of objects
// The array of object if send to our index.ejs file which generates an html file to respond with the todos included
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    response.render('index.ejs', { items: todoItems, left: itemsLeft })

    // Below there's commented out code of how to do this without an async function

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// Post request to add a new todo, it uses the path of '/addTodo', which is uses by the form where the input of the todo in the html of the client side.
app.post('/addTodo', (request, response) => {
    // We access the 'todos' collection from mongodb and add one new item
    // The item is the request body, which is the form that submitted the todo
    // We are also adding a property of 'completed' with the value of false, so we know the todo we just added has not been crossed.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        // Once the request is completed, we response redirecting the client to the main page
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// Put request to update a todo item and mark it as completed. It uses the path of '/markComplete'
app.put('/markComplete', (request, response) => {
    // We access the mongodb 'todos' collection to update an item
    // thing is the name of the property that will contain the request.body, but it can be any name
    // itemFromJS comes from the client javascript code.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // $set is a method of mongodb to update a property
        $set: {
            completed: true
          }
    },{
        // sort will order the documents in the mongodb collection base on their id
        sort: {_id: -1},
        // upsert is a property that would create a new document if there is no document to modify
        upsert: false
    })
    .then(result => {
        // We say in the server console all good
        console.log('Marked Complete')
        // We reply to the client js that the operation was successful
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// Put request to update a todo item and unmark it as completed. It uses the path of '/markComplete'
app.put('/markUnComplete', (request, response) => {
    // We access the mongodb 'todos' collection to update an item
    // thing is the name of the property that will contain the request.body, but it can be any name
    // itemFromJS comes from the client javascript code.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // $set is a method of mongodb to update a property
        $set: {
            completed: false
          }
    },{
        // sort will order the documents in the mongodb collection base on their id
        sort: {_id: -1},
        // upsert is a property that would create a new document if there is no document to modify
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        // We say in the server console all good
        console.log('Todo Deleted')
        // We reply to the client js that the operation was successful
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// We use the listen method of express to initialize our server
// process.env.PORT allows web servers like heroku to use the port they choose, otherwise, it will be the port from our variable PORT
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})