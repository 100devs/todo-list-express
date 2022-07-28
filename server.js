// import express from npm and assign it express variable
const express = require('express')
// set app variable as express function
const app = express()
// import mongodb and store it in MongoClient 
const MongoClient = require('mongodb').MongoClient
// set port variable and state it
const PORT = 2121
// import and configure dotenv to ease use of files starting with . (ex: .gitignore)
require('dotenv').config()

// set variables for db, dbConncetionStr, dbName
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// assign connect method to MongoClient class, and pass in dbConnectionStr along with object useUnifiedTopology set to true 
// useUnifiedTopology set to true is now optionally used becuase it's already a default in current node and mongodb versions
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
  
// middleware functions
// call set method so view engine uses ejs to render while referring to the views folder which carries ejs    
app.set('view engine', 'ejs')
// express calls for files in public which are style.css and main.js
app.use(express.static('public'))
// parse content of incoming requests using urlencoded (body-parser)
app.use(express.urlencoded({ extended: true }))
// parse incoming json requests
app.use(express.json())


// add request and response handlers as methods when path '/' is called
app.get('/',async (request, response)=>{
    // assign todoItems with todos from database collection that should be found and resolved with array of objects
    const todoItems = await db.collection('todos').find().toArray()
    // 
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

// add request and response handlers as methods when path '/addTodo' is called
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // when insertOne is successful
    .then(result => {
        // log inserted data to console
        console.log('Todo Added')
        // redirect to home '/' path
        response.redirect('/')
    })
    // if insertOne fails, log error to console
    .catch(error => console.error(error))
})

// add request and response handlers as methods when path '/markComplete' is called
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    // when markComplete is successful
    .then(result => {
        // log inserted data to console
        console.log('Marked Complete')
        // redirect to home '/' path
        response.json('Marked Complete')
    })
    // if update fails, log error to console
    .catch(error => console.error(error))

})

// add request and response handlers as methods when path '/markUnComplete' is called
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

// add request and response handlers as methods when path '/deleteItem' is called
app.delete('/deleteItem', (request, response) => {
    // delete a document from todos collection in databse, it should match 'thing'
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// run server which will either listen to PORT from environment variable or PORT set as default variable
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})