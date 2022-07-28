// use express its the bomb
const express = require('express')
// use app in plae of express function
const app = express()
// use MongoClient Database
const MongoClient = require('mongodb').MongoClient
// Assign port 2121 for server
const PORT = 2121
// use dotenv to protect private info
require('dotenv').config()

// create db variable, 
// create dbConnection String to private string from .env
// create database name 'todo'
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// Connect to MongoDB using private string
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
// after connected wait for response
    .then(client => {
        // console log successful connetion
        console.log(`Connected to ${dbName} Database`)
        // assign db to client
        db = client.db(dbName)
    })
    
// assign middleware
// render page using ejs
app.set('view engine', 'ejs')
// use public folders to link to files
app.use(express.static('public'))
// use extended functions of express to handle request from browser  ??
app.use(express.urlencoded({ extended: true }))
// use express json parsing
app.use(express.json())

// root page request and response asynchronously
app.get('/',async (request, response)=>{
    // wait for response from mongodb and create new array of all itmes
    const todoItems = await db.collection('todos').find().toArray()
    // wait for response from mongodb and count number of unfinished items
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // send to index.ejs todoItems and how many are left unfinished
    response.render('index.ejs', { items: todoItems, left: itemsLeft })

    // promise base syntax
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// add new item to list, 
app.post('/addTodo', (request, response) => {
    // insert new item named thing to list with default state of completed, false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // wait for response
    .then(result => {
        // log Todo Added
        console.log('Todo Added')
        // redirect browser to root page
        response.redirect('/')
    })
    // if an error exists output to console
    .catch(error => console.error(error))
})

// mark item complete when item clicked
app.put('/markComplete', (request, response) => {
    // select item in DB from body that was clicked
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // set property of item
        $set: {
            // changed value from false to true
            completed: true
          }
    },{ 
        // sort list by id
        sort: {_id: -1},
        // do not create new if it does not exist
        upsert: false
    })
    // after response
    .then(result => {
        // log completed
        console.log('Marked Complete')
        // respond completed to client
        response.json('Marked Complete')
    })
    // if error log it
    .catch(error => console.error(error))

})

// mark item uncomplete when item clicked

app.put('/markUnComplete', (request, response) => {
    // select item in DB from body that was clicked
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // set property of item
        $set: {
            // changed value from true to false
            completed: false
          }
    },{
        // sort list by id
        sort: {_id: -1},
        // do not create new if it does not exist
        upsert: false
    })
    // after response
    .then(result => {
        // log completed server side
        console.log('Marked Complete')
        // log completed to client
        response.json('Marked Complete')
    })
    // catch errors
    .catch(error => console.error(error))

})

// delete db item
app.delete('/deleteItem', (request, response) => {
    // delete item from list that was clicked
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        // log deleted
        console.log('Todo Deleted')
        // respond deleted
        response.json('Todo Deleted')
    })
    // catch errors
    .catch(error => console.error(error))

})
// server listen on environment port or defined port
app.listen(process.env.PORT || PORT, ()=>{
    // log running on port
    console.log(`Server running on port ${PORT}`)
})