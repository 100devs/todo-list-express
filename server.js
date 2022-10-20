console.log('Running Node server')

// require express in the application
// store express methods in 'app' variable
const express = require('express')
const app = express()

// require mongodb (the database where user data will be stored) in the application
// store mongodb methods in 'MongoClient' variable
const MongoClient = require('mongodb').MongoClient

// set port number for running the app
const PORT = process.env.PORT

// require and configure dotenv to allow the use of environment variables in the application
require('dotenv').config()

// set up variable for database
// set the connection string provided by MongDB
// set up variable for database name
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// connect to the database using the connection string
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        // print message to console once connected to database
        // give name to database and assign db to a variable
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

// set ejs files as the application's view engine
app.set('view engine', 'ejs')

// allow application to load files located in a folder named public without having to set up a get method for each file route
app.use(express.static('public'))

// allow back-end code to receive and read data submitted (via forms in HTML) by from the client-side code
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// set up a get method that on the root route 
app.get('/',async (request, response)=>{

    // const todoItems = await db.collection('todos').find().toArray()
    // const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // response.render('index.ejs', { items: todoItems, left: itemsLeft })

    // when a user accesses this route, run an aynchronous function to access 'todos' collection in the database
    // search for all documents in the collection and store them in an array
    db.collection('todos').find().toArray()
    .then(data => {

        // count the number of all documents in 'todos' collection that have a property key-value pair of 'completed: false'
        db.collection('todos').countDocuments({completed: false})
        .then(itemsLeft => {

            // assign all documents found in the 'todos' collection to the 'items' variable
            // count the number of all documents that have a property key-value pair of 'completed: false' and assign that number to the 'left' variable
            // render an ejs file with the data found in the database and respond to the user with the ejs file
            response.render('index.ejs', { items: data, left: itemsLeft })
        })
    })

    // catch error, if any, during the executon of the async function
    .catch(error => console.error(error))
})

// set up a post method on the '/addTodo' route
app.post('/addTodo', (request, response) => {

    // when a user accesses this route, run an aynchronous function to access the 'todos' collection in the database
    //  create one document in the collection for the todo item that came from the request's 'body' object
    // assign the todo item to the document's 'thing' property
    // assign a value of false to the document's 'completed' property
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {

        // print message to console
        // redirect page to the root route; this will trigger a new get request at the root route
        console.log('Todo Added')
        response.redirect('/')
    })

    // catch error, if any, during the executon of the async function
    .catch(error => console.error(error))
})

// set up a put method on the '/markComplete' route
app.put('/markComplete', (request, response) => {

    // when a user accesses this route, run async function to access the 'todos' collection in the database
    // update the document that has the same todo item that came from the request's 'body' object
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{

        // update the document's 'completed' property to true
        $set: {
            completed: true
          }
    },{

        // sort all documents in descending order; update the first document that matches the item in the request's 'body' object 
        sort: {_id: -1}, 
        upsert: false
    })
    .then(result => {

        // print message to console
        // send message in json format to the client-side javascript
        console.log('Marked Complete')
        response.json('Marked Complete')
    })

    // catch error, if any, during the executon of the async function
    .catch(error => console.error(error))

})

// set up a put method on the '/markUnComplete' route
app.put('/markUnComplete', (request, response) => {

    // when a user accesses this route, run async function to access the 'todos' collection in the database
    // update the document that has the todo item that matches the one that was sent along with the request's 'body' object
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{

        // update the document's 'completed' property to true
        $set: {
            completed: false
          }
    },{
        // sort all documents in descending order
        // update the first document that matches the item in the request's 'body' object 
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {

        // print message to console
        // send message in json format to the client-side javascript
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// set up a delete method at the '/deleteItem' route
app.delete('/deleteItem', (request, response) => {

    // when a user accesses this route, run async function to access the 'todos' collection in the database
    // delete one document in the collection that has the todo item that matches the one that was sent along with the request's 'body' object
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {

        // print message to console
        // respond to request sent by client-side javascript with a message in json format
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })

    // catch error, if any, during the executon of the async function
    .catch(error => console.error(error))

})

// use an environment variable to change the port if the enviroment where the app is running provides a different port
// print message on the terminal once the server is running  on the chosen port that
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})