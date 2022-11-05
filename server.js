// import express
const express = require('express')
// use express
const app = express()
// connect to mongo
const MongoClient = require('mongodb').MongoClient
// set port as a constant
const PORT = 2121
// able to use environement variables
require('dotenv').config()

// database connection string connected from environment variables
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// database connection
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

// middleware using express and ejs as our view engine for rendering pages
app.set('view engine', 'ejs')
// serve up static files such as js css without needing to set routes for every file
app.use(express.static('public'))
// allows us to parse the body of a request as JSON
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// handles home/root page get requests 
app.get('/',async (request, response)=>{
    // goes through todos collection, finds all documents and stores in an array with variable todoItems
    const todoItems = await db.collection('todos').find().toArray()
    // same as above to get documents that have not been marked as completed stored as variable itemsLeft
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // serve an ejs render of index.ejs as the response by passing in todoItems and itemsLeft
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

// handles post requests to the route /addToDo
app.post('/addTodo', (request, response) => {
    // inserts one document into the todos collection
    // the inserted "thing" is in the request.body with a completed false property
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        // when inserted the page refreshes and triggers a get request with updated document
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// handles put requests to the /markComplete route
app.put('/markComplete', (request, response) => {
    // updates one document in the todos collection
    // the query will be the itemFromJS from the request.body
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // set "completed" to true for this document
        $set: {
            completed: true
          }
    },{
        // sort the documents by their id in descending order
        sort: {_id: -1},
        // no new document will be inserted if the document does not exist
        upsert: false
    })
    .then(result => {
        // response sent back to client saying complete
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// Same as the mark complete route but this time to mark as incomplete
app.put('/markUnComplete', (request, response) => {
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

// handles delete requests with the route 'deleteItem'
app.delete('/deleteItem', (request, response) => {
    // goes to that to the 'todos' collection and deletes the one document matching "itemFromJS" from the request body
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// if enviornment variable has PORT property use that, otherwise use default PORT
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})