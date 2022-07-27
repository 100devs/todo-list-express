// adding express framework
const express = require('express')
// setting express to app
const app = express()
// required mongo client and renamed to MongoClient
const MongoClient = require('mongodb').MongoClient
// delcaring a default port
const PORT = 2121
// adding the environment file
require('dotenv').config()

// declaring database, database connection, and database name
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// establishing connection to mongoDB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
// promise handling that connection
    .then(client => {
        // lets us know which database you are connecting to
        console.log(`Connected to ${dbName} Database`)
        // assigning the database to the variable of db
        db = client.db(dbName)
    })
    
// setting our view engine to ejs
app.set('view engine', 'ejs')
// Middleware (everything between the request and response is middleware)
// makes the public folder always available to the client
app.use(express.static('public'))
// parses url for data inside of request object
app.use(express.urlencoded({ extended: true }))
// allows you to format response in json
app.use(express.json())

// setting request handlers

//get handler for '/'
app.get('/',async (request, response)=>{
    // goes to the db and finds all the documents and puts them into an array
    const todoItems = await db.collection('todos').find().toArray()
    // goes to the db and counts the documents that are not completed
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // sending data to ejs to render the html that goes back to the client
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

// request, handler for creating a todo
app.post('/addTodo', (request, response) => {
    // inserts a document into MongoDb with the data in the request from the form in the html
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        // responds by telling the client to redirect to the home page
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// 
app.put('/markComplete', (request, response) => {
    // go to the db and update an item's completed status to true
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
        // send response to client for the refresh
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    // go to the db and update an item's completed status to false
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Incomplete')
        // send response to client for the refresh
        response.json('Marked Incomplete')
    })
    .catch(error => console.error(error))

})

// request handler for delete
app.delete('/deleteItem', (request, response) => {
    // go to the db and delete the item from the request body
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        // send response to client for the refresh
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// makes node listen for request on the specified port
app.listen(process.env.PORT || PORT, ()=>{
    // logs what port is listening on
    console.log(`Server running on port ${PORT}`)
})