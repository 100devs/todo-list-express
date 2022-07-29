//This variable assignment imports the express module
const express = require('express')
//this variable assignment puts a new express appliation inside the express variable
const app = express()
//The MongoDB module exports MongoClient, and that’s what we’ll use to connect to a MongoDB database.
// We can use an instance of MongoClient to connect to a cluster, access the database in that cluster, 
//and close the connection to that cluster.
const MongoClient = require('mongodb').MongoClient
// sets PORT value to 2121
const PORT = 2121

// requires 'dotenv' module and returns parsed key value pair to process.env
require('dotenv').config()

// 
let db,
    // store user environment
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// connect to database utilizing UnifiedTopology
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // after connection..
    .then(client => {
        // show dbName in console
        console.log(`Connected to ${dbName} Database`)
        // reassign db to client's database 'todo'
        db = client.db(dbName)
    })

// set the view engine to ejs
app.set('view engine', 'ejs')

// shows app path to find static content
app.use(express.static('public'))
// b. express.urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays. This method is called as a middleware in your application using the code: app.use(express.urlencoded());

// tells app to recognize the incoming Request Object as strings or arrays
app.use(express.urlencoded({ extended: true }))
// tells app to recognize the incoming Request Object as a JSON Object. 
app.use(express.json())

// handles get request to main page
app.get('/',async (request, response)=>{
    // request 'todo' database collection
    const todoItems = await db.collection('todos').find().toArray()
    // request count of 'todos' without including completed ones
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // show page to user with uncompleted todos current
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

// send a post request to the path '/addTodo' and pass in a callback function
app.post('/addTodo', (request, response) => {
    // adds an uncompleted todo to the database
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // then..
    .then(result => {
        // show 'Todo Added' in console
        console.log('Todo Added')
        // redirect the user back to the main page
        response.redirect('/')
    })
    // if the process doesn't complete show error in console
    .catch(error => console.error(error))
})

// send a put request to the path '/markComplete' and pass in a callback function
app.put('/markComplete', (request, response) => {
    // grab a todo list item for updating
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // mark it completed
        $set: {
            completed: true
          }
    },{
        // set sort order to descending
        sort: {_id: -1},
        // do not update or create a new db row
        upsert: false
    })
    // afterwards run this function
    .then(result => {
        // show 'Marked Complete' in console
        console.log('Marked Complete')
        // parse response in json
        response.json('Marked Complete')
    })
    // if the processes don't complete show error message in console
    .catch(error => console.error(error))

})

// send a put request to the path '/markUnComplete' and pass an arrow function
app.put('/markUnComplete', (request, response) => {
    // grab a todo list item for updating
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // set the completed property to false
        $set: {
            completed: false
          }
    },{
        // set sort to descending order
        sort: {_id: -1},
        // do not update row or create a new one
        upsert: false
    })
    // after run this callback function
    .then(result => {
        // show 'Marked Complete' in console
        console.log('Marked Complete')
        // parse response in json
        response.json('Marked Complete')
    })
    // if the processes don't complete show error message in console
    .catch(error => console.error(error))

})

// send a delete request to the path '/deleteItem' and pass an arrow function
app.delete('/deleteItem', (request, response) => {
    // grab a todo list item for deletion
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // after run this function
    .then(result => {
        // show 'Todo Deleted' in console
        console.log('Todo Deleted')
        // parse response in json
        response.json('Todo Deleted')
    })
    // if the processess don't complete show error message in console
    .catch(error => console.error(error))

})

// gets our express server up and running on 2121
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})