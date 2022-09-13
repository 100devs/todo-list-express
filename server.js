const express = require('express') // import all functions / methods from 'express' module
const app = express() //
const MongoClient = require('mongodb').MongoClient // import all methods from `MongoClient` within the 'mongodb' module
const PORT = 2121 // set server port on '2121'

require('dotenv').config() // load all environment variables from '.env' file

// variables used to communicate with MongoDB
let db,
    dbConnectionStr = process.env.DB_STRING, // path to database
    dbName = 'todo' // name of the database to be accessed

/* 
    connect server with MongoDB 'todo' database
*/
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs') // set express to use 'ejs' as the 'view engine'
app.use(express.static('public')) // set express to use a `static` files. This `static` files were built by utilizing all assets within the 'public' folder
app.use(express.urlencoded({ extended: true })) // set express to parse incoming requests with urlencoded payloads
app.use(express.json()) // set express to parse incoming requests into JSON format

/* 
    The response send to client when a GET request on index ('/') route was made.

    Firstly, find 'todos' collection within 'todo' database and then convert the results into an array

    Next, count the number of documents in which 'completed' is 'false'

    Finally, render 'index.ejs' with the data as the response to the client
*/
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
})

/* 
    The response send to client when a POST request on '/addTodo' route was made.

    Firstly, insert the data from `request` into 'todos' collection within 'todo' database

    Next, log into the console that the data was added into the collection and then response back to redirect the client to index ('/') route

    If an exception is thrown, show the error into the console
*/
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

/* 
    The response send to client when a PUT request on '/markComplete' route was made.

    Firstly, update data from 'todos' collection within 'todo' database where data is equal to `request`

    Next, log into the console and response with the data was 'Marked Complete'

    If an exception is thrown, show the error into the console
*/
app.put('/markComplete', (request, response) => {
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

/* 
    The response send to client when a PUT request on '/markUnComplete' route was made.

    Firstly, update data from 'todos' collection within 'todo' database where data is equal to `request`

    Next, log into the console and response with the data was 'Marked Complete'

    If an exception is thrown, show the error into the console
*/
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

/* 
    The response send to client when a DELETE request on '/deleteItem' route was made.

    Firstly, delete data from 'todos' collection within 'todo' database where data is equal to `request`

    Next, log into the console and response with 'Todo Deleted'

    If an exception is thrown, show the error into the console
*/
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

/* 
    Bind and `listen` for connection on `PORT` '2121'
*/
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})