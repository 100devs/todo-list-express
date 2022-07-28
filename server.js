// Lines 2-6 define necessary dependencies and important variables.
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

// Lines 9-11 define the database-related variables, like the connection string and the database name.
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// 14-18 establish the server's connection to the database and print a message to the console that said connection has been made.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

// 21-24 assign setting names and the middleware to be used by the server.
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// 27-30 are the GET request/response for the landing page of the ToDo list.  They send the GET request to the database for the complete list of tasks and also for the list of tasks that still need to be completed.  Not sure about the commented code on lines 31-38.  Looks like a different version of the same code?
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
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

// 42-49 enable the creation of new ToDo items, console log that a new task has been added to the list, redirect the user back to the main page, and also handle errors.
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// 52-67 are half of the UPDATE portion of this CRUD app, allowing the user to mark that they have completed a task on the list and updating the database accordingly.
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
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

// 70-85 are the other half of the UPDATE machinery, allowing the user to mark a given task incomplete, though the .then portion says "Marked Complete."
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

// 88-96 handle the deletion of an item from the list, the database, and our stress level.
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// 99-101 tell the server which port to listen on for both the local host and when the server is being hosted remotely.  They also print a message to the console to let us know that the server is up and running.
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})