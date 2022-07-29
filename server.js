// require express module, assign to 'express' variable
const express = require('express')
// create express app 'express()' and assign to 'app'
const app = express()
// require MongoDB module, assign to 'MongoClient' variable
const MongoClient = require('mongodb').MongoClient
// set default port to 2121
const PORT = 2121
// dotenv module loads environment variables from '.env' file
require('dotenv').config()

// create empty 'db' variable to eventually store MondoDB database
// 'dbConnectionStr' variable stores the MongoDB connection string from the '.env' file
// 'dbName' variable stores the name of the MongoDB database being used
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// connect to MongoDB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        // if no errors, log success message
        console.log(`Connected to ${dbName} Database`)
        // assigned MongoDB instance to 'db' variable
        db = client.db(dbName)
    })

// set the templating/view engine to ejs
app.set('view engine', 'ejs')
// middleware function in express to serve static files (images, CSS files, JS files)
// serve files found in the 'public' directory (e.g. public/css/style.css)
app.use(express.static('public'))
// middleware function in express to add body-parser to app
// processes data sent through an HTTP request body
app.use(express.urlencoded({ extended: true }))
// middleware fucntion in express to parse incoming JSON requests and puts the data in 'req.body'
app.use(express.json())

// define routing of express app for GET requests
// respond with the rendering of tasks items when a GET request is made to the homepage of the app
app.get('/',async (request, response)=>{
    // collect to do tasks in an array and store in 'todoItems' variable
    // access 'todos' collection from 'db' database, use '.find' w/o a query to return all tasks in collection, use '.toArray' method to return tasks as array
    const todoItems = await db.collection('todos').find().toArray()
    // get count of uncompleted tasks
    // access 'todos' collection from 'db' database, use '.countDocuments' method to count tasks with 'completed' property set to 'false'
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // using data from 'todoItems' and 'itemsLeft' render ejs template/view
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

// define routing of express app for POST requests
// request handler for '/addTodo' path, add new to do task item; request sent from form
app.post('/addTodo', (request, response) => {
    // access 'todos' collection from 'db' database, use '.insertOne' method to add a document (task) to database
    // task item/body provided by form submission ('request.body.todoItem') and completed property set to 'false'
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // when request is fulfilled, redirect to root ('/')
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    // if request is rejected, log the error
    .catch(error => console.error(error))
})

// define routing of express app for PUT requests
// request handler for '/markComplete' path, update task as completed
app.put('/markComplete', (request, response) => {
    // access 'todos' collection from 'db' database, use '.updateOne' method to update a document (task) in database
    // update document/task and set completed property to 'true'
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        // sort database document (task) ids (?)
        sort: {_id: -1},
        // state that no new document should be inserted (?)
        upsert: false
    })
    .then(result => {
        // when request is fulfilled, log 'Marked Complete' message
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    // if request is rejected, log the error
    .catch(error => console.error(error))

})

// define routing of express app for PUT requests
// request handler for '/markUnComplete' path, update task as not completed
app.put('/markUnComplete', (request, response) => {
    // access 'todos' collection from 'db' database, use '.updateOne' method to update a document (task) in database
    // update document/task and set completed property to 'false'
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        // sort database document (task) ids (?)
        sort: {_id: 1},
        // state that no new document should be inserted (?)
        upsert: false
    })
    .then(result => {
        // when request is fulfilled, log 'Marked Uncomplete' message
        console.log('Marked Uncomplete')
        response.json('Marked Uncomplete')
    })
    // if request is rejected, log the error
    .catch(error => console.error(error))

})

// define routing of express app for DELETE requests
// request handler for '/deleteItem' path, delete to do task
app.delete('/deleteItem', (request, response) => {
    // access 'todos' collection from 'db' database, use '.deleteOne' method to delete a document (task) in database
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        // when request is fulfilled, log 'Todo Deleted' message
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    // if request is rejected, log the error
    .catch(error => console.error(error))

})

// start server; listen on const 'PORT' (default) or PORT provided by environment variable
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})