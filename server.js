//import express
const express = require('express')
//declare app vairable for express functions
const app = express()
//import mongoClient and declare as requiration
const MongoClient = require('mongodb').MongoClient
//define port for app to use when database unavailable
const PORT = 2121
//require server connection info (.env) when database availaable
require('dotenv').config()

//declare database
let db,
//declare connection string as variable to connect to db
    dbConnectionStr = process.env.DB_STRING,
    //save database name as variable to avoid confusion
    dbName = 'todo'
//have mongoCli connect with db connection string and have it use nodes updated driver
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
//after connecting 
    .then(client => {
        //print status of connection to console
        console.log(`Connected to ${dbName} Database`)
        //save clientdb/ dbName as db
        db = client.db(dbName)
        //if fails, pass error into log, print error
    }).catch(err => console.log(err))  

//add middleware
//declare template as view engine with ejs 
app.set('view engine', 'ejs')
//add middleware for static files to be rendered (css styles)
app.use(express.static('public'))
//allow server responses to be translated into json readable, use QS library for nested objects
app.use(express.urlencoded({ extended: true }))
//tell express we are using json for our request data express.json(), parse incoming JSON requests 
app.use(express.json())

//call get method to display index, set the route to '/' and listen for / path request
app.get('/',async (request, response)=>{
    //after getting promise (from async), declare variable for finding the todos in database and convert them to an array
    const todoItems = await db.collection('todos').find().toArray()
    //after getting promise, count tasks that aren't completed and set their completed option to false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //render index file with info grabbed, pull todo item info and items left info into body
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
        //same functionality but without async await
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//POST method for adding tasks, with listener route set to /addTodo
app.post('/addTodo', (request, response) => {
    //grab todos collection in database, insert task in JSON format with completed set to false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //after adding to the database
    .then(result => {
    //print successful result to console
        console.log('Todo Added')
    //redirect to index.ejs with updated info
        response.redirect('/')
    })
    //if call fails, pass error into console and print
    .catch(error => console.error(error))
})

//Update method for finished tasks, route listener set to /markComplete
app.put('/markComplete', (request, response) => {
    //grab selected item in database collection and target item's body
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //set function for item
        $set: {
            //set completed value to true in item
            completed: true
          }

    },{
        //if it doesn't find the item in the database
        sort: {_id: -1},
        //don't add new item if it can't be found
        upsert: false
    })
    //if successfull
    .then(result => {
        //pass marked complete into console and print
        console.log('Marked Complete')
        //tell server that it successfully marked as complete
        response.json('Marked Complete')
    })
    //if fails, grab error, pass to console and print
    .catch(error => console.error(error))

})


//Update for unComplete, route listener set to /markUnComplete
app.put('/markUnComplete', (request, response) => {
    //grab item in cluster collection and target items body
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //set body of item as:
        $set: {
            //set completed value as false
            completed: false
          }
    },{
        //if item can't be found by id
        sort: {_id: -1},
        //don't add a new one
        upsert: false
    })
    //if successful
    .then(result => {
        //pass Marked complete into console and print
        console.log('Marked Complete')
        //tell server (pass response to server) that the task has successfully been marked as complete
        response.json('Marked Complete')
    })
    //if promise fails, pass error into console and print
    .catch(error => console.error(error))

})


//method to DELETE task from list, with route set to /deleteItem
app.delete('/deleteItem', (request, response) => {
    //grab item in cluster collection and delete it (and only that one item)
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //if promise succeeds
    .then(result => {
        //print Todo Deleted to console
        console.log('Todo Deleted')
        //send response to database that item has been successfully deleted
        response.json('Todo Deleted')
    })
    //if promise fails, pass error to console and print to terminal
    .catch(error => console.error(error))

})


//listen for successful connection to database, or to localhost PORT if no database is found
app.listen(process.env.PORT || PORT, ()=>{
    //log successful connection to console and pass port variable into it's message
    console.log(`Server running on port ${PORT}`)
})