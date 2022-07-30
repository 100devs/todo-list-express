// requires express library
const express = require('express')
//calls express application to set up server
const app = express()
//requires mongoclient library
const MongoClient = require('mongodb').MongoClient
//specifies default server at localhost:2121
const PORT = 2121
//requires and configures from .env file
require('dotenv').config()

//creates db variable w/o assigning
let db,
    //creates variable dbConnectionStr and assigns it to DB_STRING from .env file
    dbConnectionStr = process.env.DB_STRING,
    //assigns dbName = 'todo'
    dbName = 'todo'

//forms connection between mongodb and dbConnectionStr url, and allows mongodb to manage the connection via useUnifiedTopology
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    //once if the connection is successful
    .then(client => {
        //prints to the console the response of the dbName 'todo
        console.log(`Connected to ${dbName} Database`)
        //names the database to 'todo'
        db = client.db(dbName)
    })

//sets variable of setting and the name of the view engine of ejs
app.set('view engine', 'ejs')
//
app.use(express.static('public'))
//
app.use(express.urlencoded({ extended: true }))
//
app.use(express.json())

//designates action at route path of '/' with asynchronous function that 'gets' information from the server
app.get('/',async (request, response)=>{
    //after the function is called, todoItems checks for everything under 'todos' section of thedatabase
    const todoItems = await db.collection('todos').find().toArray()
    //checks items in 'todo's to see if their status is not complete
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //renders to the DOM all items and items that are incomplete
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

//designates action to take at route path '/addTodo' to post elements
app.post('/addTodo', (request, response) => {
    //adds one item that is incomplete to the todolist collection in the database
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //after successful addition
    .then(result => {
        //message is printed to the console
        console.log('Todo Added')
        //user is redirected to the '/' address
        response.redirect('/')
    })
    //if attempt to add is unsuccessful, error message is printed to the console
    .catch(error => console.error(error))
})

//designates action to update information and direct to '/markComplete' route
app.put('/markComplete', (request, response) => {
    //communicates with database and updates particular item from uncomplete => complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    //then prints to console that task is complete
    .then(result => {
        console.log('Marked Complete')
        //updates in database that task is marked complete
        response.json('Marked Complete')
    })
    //else display error
    .catch(error => console.error(error))

})

//designates action to update information to unmark if something is marked as complete
app.put('/markUnComplete', (request, response) => {
    //communicates with database in the database of 'todos'
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //sets completed to false
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    //then prints to console that task is complete
    .then(result => {
        console.log('Marked Complete')
        //updates in database that task is marked complete
        response.json('Marked Complete')
    })
     //else display error
    .catch(error => console.error(error))

})
//designates action to delete infromation
app.delete('/deleteItem', (request, response) => {
    //communicates with database to remove object form database
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        //prints to console/terminal deletion
        console.log('Todo Deleted')
        //deletion in database
        response.json('Todo Deleted')
    })
    //error message if deletion is unsuccessful
    .catch(error => console.error(error))

})

//runs the app on local host port or environment database
app.listen(process.env.PORT || PORT, ()=>{
    //prints to console/terminal where the app is running
    console.log(`Server running on port ${PORT}`)
})
