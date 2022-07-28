// import express module
const express = require('express')
// bind it to the app variable
const app = express()
// import mongodb
const MongoClient = require('mongodb').MongoClient
// set port 
const PORT = 2121
// add .env file, allows us to use .env file to store details such as mongo connection string
require('dotenv').config()

// set variables db
// db connection string which takes DB_STRING from .env file
// dbName hold string name todo
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// connect to mongodatabase 
// once connected console log connected to said database
// set database name to the dbName var creates a db with that name or connects to a existing one

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

// set the view engine to use ejs
app.set('view engine', 'ejs')
// set the public folder that will store html,css and images
app.use(express.static('public'))
// middleware to parse form data
app.use(express.urlencoded({ extended: true }))
// parsing json
app.use(express.json())

// this is a request for a homepage, once entered it fetches todos from DB and fetches the number of unfinished tasks
// RENDERS THEM TO EJS?
// commented out is the code without syntax sugar of async await
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})
// post request to add a new note, it's triggered with a submit button on the page
// find the db collction called todos and insert a new entry with complteed status false
// console log that the note was added and redirect to the homepage
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})


// updates the entry and marks it complete 
app.put('/markComplete', (request, response) => {
    // it goes to todos collection and updates the entry which has a thing equal to what came from itemFromJS from the client side and sets it as complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        // sorts by latest
        sort: {_id: -1},
        // doesn't create a new one if it cant' find one 
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})
// marks it as uncomplete
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

// delete's the entry 
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// creates the server
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})