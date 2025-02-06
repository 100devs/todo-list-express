//import express using express module
const express = require('express')
//create app
const app = express()
//import MongoClient from MongoDB
const MongoClient = require('mongodb').MongoClient
//define the port 
const PORT = 2121
//load environment variables
require('dotenv').config()

//database variable
let db,
    //store connection string from environment variables
    dbConnectionStr = process.env.DB_STRING,
    //name database
    dbName = 'todo'

//connect to MongoDB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        //log successful connection to console
        console.log(`Connected to ${dbName} Database`)
        //store database name
        db = client.db(dbName)
    })

//middleware
//set view engine to ejs
app.set('view engine', 'ejs')
//serve static files in public directory
app.use(express.static('public'))
//parse incoming URL-encoded form data 
app.use(express.urlencoded({ extended: true }))
//middleware to parse JSON
app.use(express.json())

//GET request on root route
app.get('/', async (request, response) => {
    //fetch all documents from db collection, convert to array and store in todoItems
    const todoItems = await db.collection('todos').find().toArray()
    //count incomplete items and stores in itemsLeft 
    const itemsLeft = await db.collection('todos').countDocuments
        ({ completed: false })
    //render 'index.ejs' and pass data to template
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

//POST request on '/addTodo' route
app.post('/addTodo', (request, response) => {
    //insert new todo item in db collecntion
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false })
        //if successful log to console 
        .then(result => {
            console.log('Todo Added')
            //refresh page, redirects to home route
            response.redirect('/')
        })
        //log error if found
        .catch(error => console.error(error))
})

//PUT request on '/markComplete' route
app.put('/markComplete', (request, response) => {
    //update one todo item in db 
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
        //set completed to true
        $set: {
            completed: true
        }
    }, {
        //sort in descending order
        sort: { _id: -1 },
        //if no matching doc found, do  nothing
        upsert: false
    })
        .then(result => {
            //log to console if successful
            console.log('Marked Complete')
            //send JSON response back to client
            response.json('Marked Complete')
        })
        //log error if not successful
        .catch(error => console.error(error))

})

//PUT request on '/markUncomplete'
app.put('/markUnComplete', (request, response) => {
    //update one todo item in db 
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
        //set completed to false
        $set: {
            completed: false
        }
    }, {
        //sort in descending order
        sort: { _id: -1 },
        //if no matching doc found, do  nothing
        upsert: false
    })
        .then(result => {
            //log to console if successful
            console.log('Marked Complete')
            //send JSON response back to client
            response.json('Marked Complete')
        })
        //log error if not successful 
        .catch(error => console.error(error))

})

//DELETE request on '/deleteItem/ route
app.delete('/deleteItem', (request, response) => {
    //delete one todo item from db collection
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS })
        // if successful log to console
        .then(result => {
            console.log('Todo Deleted')
            //send JSON response back to client
            response.json('Todo Deleted')
        })
        //log error if not successful 
        .catch(error => console.error(error))
})

//start server, app listens on port 
app.listen(process.env.PORT || PORT, () => {
    //print to console if successful
    console.log(`Server running on port ${PORT}`)
})