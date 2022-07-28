const express = require('express') // allows express to be used in the file
const app = express() //Saving the express call to the 'app' var
const MongoClient = require('mongodb').MongoClient// allows the use of MongoClient methods and communication with mongodb database
const PORT = 2121 // declare a port var
require('dotenv').config() // require dotenv

// declare vars
let db, // an empty string
    dbConnectionStr = process.env.DB_STRING, // connection str var that get the str from .env or heroku's vars  
    dbName = 'todo' // name of the database

// Connection to the database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`) // displays confirmation in terminal
        db = client.db(dbName)
    })
 
// Set up ejs
app.set('view engine', 'ejs') // set view engine to ejs
app.use(express.static('public')) // set up public folder for css and main js files
app.use(express.urlencoded({ extended: true }))  // tells express to decode and encode urls automatically
app.use(express.json()) // Makes everything json


// Respond to get request to the root route
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray() // wait for items in database to download as an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // wait for number of items that have a completed value of false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // send vars todoItems and itemsLeft to ejs

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// Respond to post request to the /addTodo route
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // insert new todo item into list with the completed value of false
    .then(result => {
        console.log('Todo Added') // display confirmation in terminal
        response.redirect('/') // refresh to the root page
    })
    .catch(error => console.error(error)) // console log errors
})

// Respond to put request to the /markComplete route
app.put('/markComplete', (request, response) => {
    // go to database, collection todos, find a doc that matches request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1}, // sort by oldest first
        upsert: false // if the doc doesn't exsist create a new one
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error)) // basic error catch

})


// Respond to update request to to mark item uncomplete
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        // sort by oldest first
        sort: {_id: -1},
        // if the doc doesn't already exist create a new one
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete') // display 
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})


// Respond to delete request to the /deleteItem route
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // go into database and delete the item that matches request.body.itemFromJS
    .then(result => {
        console.log('Todo Deleted') // display confirmation of deletion
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error)) // basic error catch

})


// set the server to listen to requests
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`) // display confirmation of running port
})