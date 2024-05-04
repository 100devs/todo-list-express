// pull all dependencies into server.js and declaring a port
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
// declare port number for listening
const PORT = 2121
require('dotenv').config()

// declares variables to hold information about database
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// connects to the database on mongo
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
// set up middleware for template engine, public folder, url parsing, json req parsing
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// listen for request for root directory
app.get('/',async (request, response)=>{
    // fetch collection and change to array
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // render index.ejs is todoitems and itemsleft passed in as variables
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

// makes a POST api request to add one entry
app.post('/addTodo', (request, response) => {
    // go to collection, and insert one object with the keys of thing and completed
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        // refresh user's screen after post submission
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// makes and update request to the server to mark something as complete
app.put('/markComplete', (request, response) => {
    // connect to database
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // set item specified in request body to completed with specified options
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        // send back result to show request is complete
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// makes an update request to the server to mark something as incomplete
app.put('/markUnComplete', (request, response) => {
     // connect to database
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // set item specified in request body to uncompleted with specified options
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        // send back result to show request is complete
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// makes a request to delet an item from the database
app.delete('/deleteItem', (request, response) => {
    // connect to the database and delete the first item found that matches thing specified in json request body
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        // send back response to show request is complete
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})
// listen for requests on PORT
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
