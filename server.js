// add express to program
const express = require('express')
// create express app
const app = express()
// add mongo to app
const MongoClient = require('mongodb').MongoClient
// add port to program
const PORT = 2121
// add dotenv to program
require('dotenv').config()

// create database and add connection string
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
// connect app to database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
// set app to use the ejs view engine    
app.set('view engine', 'ejs')
// add ability to render static
app.use(express.static('public'))
// set app to parse html
app.use(express.urlencoded({ extended: true }))
// set app to render json
app.use(express.json())

// set up get request
app.get('/',async (request, response)=>{
//     find todo items in the database and create an array
    const todoItems = await db.collection('todos').find().toArray()
//     count number of unfinished items
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
//     render the todo items and the items items as html
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

// set up post request
app.post('/addTodo', (request, response) => {
//     add a new todo todo item to the database
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
//     log Todo added to the console if sucessful or log the error
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})


// set up a put request to mark a completed request
app.put('/markComplete', (request, response) => {
//     update a specific todo item to completed
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
//     if sucessful, log marked completed to the console else log the error
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))
})

// set up a put request to mark a uncompleted request
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

// set a delete request
app.delete('/deleteItem', (request, response) => {
//     delete a specific todo iten from the database
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
//     log todo deleted to the console if sucessfull else log the error
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// set the app to listen on a specific port
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
