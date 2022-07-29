//import express package
const express = require('express')
//create variable for express
const app = express()
//connect to database
const MongoClient = require('mongodb').MongoClient
//assign to a port
const PORT = 2121
//makes us able to use env file
require('dotenv').config()

//create database for mongo connection
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'


//connect to mongo db with .env string
//returns promise, logs confirmation
//sets dbname to db variable    
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

//allow the use of views folder .ejs    
app.set('view engine', 'ejs')
//allow any static file in public folder to be used
app.use(express.static('public'))
//allow url to be sent over internet
app.use(express.urlencoded({ extended: true }))
//allow use of json
app.use(express.json())


app.get('/',async (request, response)=>{
    //find todos, put in array
    const todoItems = await db.collection('todos').find().toArray()
    //count all documents with completed:false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //Get request to localhost, will return index.ejs
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

app.post('/addTodo', (request, response) => {
    //create item with thing key and completed key
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        //console log todo added
        console.log('Todo Added')
        //if it works, redirect home
        response.redirect('/')
    })
    //send error if it doesn't work
    .catch(error => console.error(error))
})

//update request to localhost:2121/markComplete
app.put('/markComplete', (request, response) => {
    //update document that has thing: of entered text
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //will set the completed key to true
        $set: {
            completed: true
          }
    },{
        //will sort documents from newest to oldest
        sort: {_id: -1},
        upsert: false
    })
    //if everything works, console log marked complete
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //if it doesn't work, send error
    .catch(error => console.error(error))

})

//update request to localhost:2121/markUncomplete
//will undo markcomplete
//sets completed key back to false
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

//send delete reqeust to localhost:2121/deleteItem
app.delete('/deleteItem', (request, response) => {
    //look through documents for thing key to have value of text entered by user
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        //console log if it finds it
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    //send error if it doesn't find it
    .catch(error => console.error(error))

})

//set port for app to use
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})