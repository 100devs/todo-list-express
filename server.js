const express = require('express') // import express into the project
const app = express() // variable name to create an instance of express
const MongoClient = require('mongodb').MongoClient // import mongo db into the project
const PORT = 2121 // set the port for the server to listen for requests
require('dotenv').config() // import dotenv toload environment variables from .env file

// read db connection info from environment variables (db, donnection string)
// assign 'todo' to db name
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// connect to the db using Mongo instance (declared above)
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connect to MongoDB
    .then(client => { // take that connection & do something with it
        console.log(`Connected to ${dbName} Database`) // log the connection
        db = client.db(dbName) // assign the database to the db variable
    })
    
app.set('view engine', 'ejs') // set the view engine (templating language) to ejs
app.use(express.static('public')) // telling express to serve static files from the 'public' directory
app.use(express.urlencoded({ extended: true })) // lets express read URLs & params
app.use(express.json()) // lets express parse JSON in the request body

// first route: get all todos and count the number of incomplete todos
app.get('/',async (request, response)=>{ // sets the path we're listening on to "/", makes it async & declares request & response arguments
    const todoItems = await db.collection('todos').find().toArray() // get all todos from "todos" collection & converts them to an array (they're objects on Mongo)
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // gets all of the incomplete todos (the ones with completed: false)
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // render the index.ejs template with the todo items and the number of incomplete items
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// 2nd route: add a new todo
app.post('/addTodo', (request, response) => { // listens for POST requests to the '/addTodo' endpoint
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // insert a new todo into the "todos" collection
    .then(result => { // if the insertion is successful
        console.log('Todo Added') // log a message to the console
        response.redirect('/') // redirect the user to the home page (refresh the page)
    })
    .catch(error => console.error(error)) // if there's an error, log it to the console
})

// 3rd route: mark a todo as complete
app.put('/markComplete', (request, response) => { // listens for PUT requests to the '/markComplete' endpoint
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // update a todo in the "todos" collection, find it by its 'thing' field
        $set: { // set the completed field to true
            completed: true // mark the todo as complete
        }
    },{
        sort: {_id: -1}, // sort by _id in descending order
        upsert: false // don't create a new document if this one doesn't exist
    })
    .then(result => { // if the update is successful
        console.log('Marked Complete') // log a message to the console
        response.json('Marked Complete') // send a JSON response to close out the request
    })
    .catch(error => console.error(error)) // if there's an error, log it to the console
})

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

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})