// imports the express library
const express = require('express')
// creates the application with express
const app = express()
// imports MongoClient class from mongodb package
const MongoClient = require('mongodb').MongoClient
// sets the port to 2121, so we can listen to it on our local machine
const PORT = 2121
// import the .env file
require('dotenv').config()

// declare variables for the database, the connection string from .env, and the name of the database
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// connect the mongo client to the database
    // then when that is successful, console log an affirmation that the db has connected and update the db variable 
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
// set the template engine as ejs so it can render properly
// allows assets from the public folder to be accessible
// processes url-encoded data from forms
// processes json data from requests
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())



// the server listens for a GET request on the root endpoint i.e this is a route to handle get requests for the root of the app. it responds with the handler function (async (request, response) => {...}) when a get request is made to the homepage
    // declare todoItems variable, assigned to the promise object from an array of the documents in the 'todos' collection
    // declare itemsLeft variable, assigned to the promise object from the count of documents with {completed: false} in the 'todos' collection
    // render the response as a view (the index.ejs file), passing in this data. todoItems value will be used where items variable is present & itemsLeft value will be used where left variable is present.
app.get('/', async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
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

// server listens for a POST request on the /addTodo endpoint. 
    // insert one document into the todos collection. This document will contain the key value pairs of thing: request.body.todoItem and completed: false
    // then console log an affirmation that the todo was added, and redirect to the homepage
    // catch an error and console log it 
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// listen for a PUT request on the /markComplete endpoint. 
    // update the todos collection in the database with the following data -
        // thing: request.body.itemFromJS
        // completed: true
        // sort in descending order by id
        // do not upsert (create one if it doesn't already exist)
    // Then console log an affirmation that the todo item has been marked complete and send a json response as well
    // Catch an error and console log it
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

// listen for a PUT request at the /markUnComplete endpoint
    // update the one document in the todos collection that meets this requirement - the thing key has a value of request.body.itemFromJS
        // set the completed key to a value of false
        // sort in descending order by id
        // do not upsert
    // then console log an affirmation that this todo list item has been marked incomplete (i believe there is a typo bc the code says to marked complete actually)
    // send a json response with marked complete as well (another typo?)
    // catch an error and console log it
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

// listen for a DELETE request at the /deleteItem endpoint
    // delete one document from the todos database inwhich the thing key has the value of request.body.itemFromJS
    // then console log an affirmation that the todo was deleted
    // and send a json response as well
    // catch an error and console.log it
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// listen on the port from the .env file or on the variable PORT
    // console log an affirmation that the server is running on the specified port
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})