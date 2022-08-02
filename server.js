const express = require('express') // require/import express
const app = express() // renaming the function for brevity
const MongoClient = require('mongodb').MongoClient // require/import MongoClient so we can connect to database
const PORT = 2121 // set up a localhost port
require('dotenv').config() // require/import dotenv for use in connections
// MISSING CORS

// declaring 3 global scope variables: db, dbConnectionStr, and dbName
let db,
    dbConnectionStr = process.env.DB_STRING, //dbConnectionStr is pulled from env file
    dbName = 'todo' //naming the database as 'todo'

// Connecting to Mongo using our connection string and telling it how to connect
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) //assign client.db('todo') which is the database returned from the MongoClient connection to db
    })
    
app.set('view engine', 'ejs') //setting the view through ejs
app.use(express.static('public')) // executing middleware to return static files from 'public' folder or will return HTTP 404
app.use(express.urlencoded({ extended: true })) //parses incoming requests with urlencoded payloads
app.use(express.json()) // convert request body to a JSON Object


// When user requests the root '/' url, it will be served the index.ejs file 
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray() // first, find all items in the collection 'todos' and make an array of them
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // find all items in the collection 'todos' that have not been completed and return total number
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // render index.ejs while passing in two arguments: an array of items in the 'todos' collection; and the number itemsLeft
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})


// if a request is made to the '/addTodo' url,
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //will go to the 'todos' collection in the database, insert one 
                                                                                       // with the inserted text and mark it as not completed
    .then(result => { // After the promise is fulfilled
        console.log('Todo Added') //log in the console that a Todo was added
        response.redirect('/') // tell the server to rediret back to the home page
    })
    .catch(error => console.error(error))
})


// if update requested at '/markComplete'
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // updateOne document in 'todos' that has 'thing' as request.body.itemFromJs, 
                                                                        // which is sent from main.js by a click as Complete
        $set: { //go to the completed key in the database
            completed: true // change the value to true
          }
    },{
        sort: {_id: -1}, // sort in descending order based on id ??
        upsert: false // do not insert new item if item does not already exist in collection
    })
    .then(result => { // after the promise is fullfilled 
        console.log('Marked Complete') // log in the console that the item was marked as complete
        response.json('Marked Complete') // respond to the client side JS/EJS that the item was marked complete
    })
    .catch(error => console.error(error)) // Will catch any error of marking item Complete - if the promise is rejected, we will log an error.

})


// if update requested at '/markUnComplete'
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // updateOne document in 'todos' that has 'thing' as request.body.itemFromJs, 
                                                                        // which is sent from main.js by a click as UnComplete
        $set: { //change the value to false
            completed: false
          }
    },{
        sort: {_id: -1}, // sort in descending order based on id ??
        upsert: false // do not insert new item if item does not already exist in collection
    })
    .then(result => {
        console.log('Marked Uncomplete') // log in the console that the item was marked as Uncomplete
        response.json('Marked UnComplete') // respond to the client side JS/EJS that the item was marked Uncomplete
    })
    .catch(error => console.error(error)) // Will catch any error of marking item UnComplete - if the promise is rejected, we will log an error

})


// if delete requested at '/deleteItem'
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // Delete the document in 'todos' that has 'thing' as request.body.itemFromJs,
                                                                       // which is sent from main.js by a click
    .then(result => { // after the promise is fulfilled 
        console.log('Todo Deleted') // log in the console that the item was Deleted
        response.json('Todo Deleted') // respond to the client side JS/EJS that the item was deleted
    })
    .catch(error => console.error(error)) // Will catch any error of Deleting item - if the promise is rejected, we will log an error

})


// server is listening at the port selected by Heroku or the assigned port in our PORT variable
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`) // when the server is running, the message will print showing that it's connected
})
