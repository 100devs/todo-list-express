//accesses the express object from the express package
const express = require('express')
//creates an express app object
const app = express()
//accesses the MongoClient object from the mongodb package
const MongoClient = require('mongodb').MongoClient
//defines which port the server will be running on
const PORT = 2121
//accesses the file named 'dotenv' to get the DB STRING
require('dotenv').config()

//db is an empty variable that will eventually hold the database object
//dbConnectionStr is taken from 'dotenv'
//dbName lets mongoDB know which collection to access
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//connects to MongoDB Atlas using dbConnectionStr as credentials
//this is a promise that returns a 'client' object
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        //notifies the console that the connection is successful
        console.log(`Connected to ${dbName} Database`)
        //takes the app's collection (identified by dbName) and stores it in the empty db variable
        db = client.db(dbName)
    })

//lets the app know that it's using ejs
app.set('view engine', 'ejs')
//leon's favorite line in this whole app
//this is middleware that allows express to serve static files in the 'public' folder
app.use(express.static('public'))
//this is middleware that allows express to recognize incoming requests if they are any data type
app.use(express.urlencoded({ extended: true }))
//this is middleware that allows express to parse incoming json requests and put the data in request.body
app.use(express.json())

//when the express server receives a GET request with URL '/', do the following:
app.get('/',async (request, response)=>{
    //get all items from the 'todos' mongoDB atlas collection and return them as an array
    const todoItems = await db.collection('todos').find().toArray()
    //count all items in the 'todos' mongoDB atlas collection and return it as a number
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //render the index.ejs view and pass it a data object with an array of item data, and a number of items left
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

//when the express server receives a POST request with URL '/addTodo', do the following:
app.post('/addTodo', (request, response) => {
    //insert a new document object into the 'todos' collection with properties 'thing' and 'completed'
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        //if successful, log to the console
        console.log('Todo Added')
        //as a response, redirect the client to the '/' URL, which will initiate a GET request that will return updated data from the db
        response.redirect('/')
    })
    //if there is an error, console log it
    .catch(error => console.error(error))
})

//when the express server receives a PUT request with URL '/markComplete', do the following:
app.put('/markComplete', (request, response) => {
    //find an object by its text and update it so that the 'completed' property is true
    //request.body.itemFromJS is the text the main.js has taken from the todo item html element
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //sets the 'completed' property to true
        $set: {
            completed: true
          }
    },{
        //sort the documents in descending order by id
        sort: {_id: -1},
        //does not create new document if no document matches the filter
        upsert: false
    })
    .then(result => {
        //if successful, log to the console
        console.log('Marked Complete')
        //return this string as a response
        response.json('Marked Complete')
    })
    //if there is an error, console log it
    .catch(error => console.error(error))

})

//when the express server receives a PUT request with URL '/markUnComplete', do the following:
app.put('/markUnComplete', (request, response) => {
    //find an object by its text and update it so that the 'completed' property is false
    //request.body.itemFromJS is the text the main.js has taken from the todo item html element
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //sets the 'completed' property to false
        $set: {
            completed: false
          }
    },{
        //sort the documents in descending order by id
        sort: {_id: -1},
        //does not create new document if no document matches the filter
        upsert: false
    })
    .then(result => {
        //if successful, log to the console
        console.log('Marked Complete')
        //return this string as a response
        response.json('Marked Complete')
    })
    //if there is an error, console log it
    .catch(error => console.error(error))

})

//when the express server receives a DELETE request with URL '/deleteItem', do the following:
app.delete('/deleteItem', (request, response) => {
    //find an object by its text and delete it
    //request.body.itemFromJS is the text the main.js has taken from the todo item html element
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        //if successful, log to the console
        console.log('Todo Deleted')
        //return this string as a response
        response.json('Todo Deleted')
    })
    //if there is an error, console log it
    .catch(error => console.error(error))

})

//sets the app to listen at the port number stored in process.env.PORT
//if process.env.PORT is falsy, instead get port number from variable PORT
app.listen(process.env.PORT || PORT, ()=>{
    //if successful, console log this
    console.log(`Server running on port ${PORT}`)
})