//Get express into server
const express = require('express')
//Create variable for easily calling express methods
const app = express()
//Create MongoDB Client
const MongoClient = require('mongodb').MongoClient
//Declare default port
const PORT = 2121
//Allow use of enviornment configurations
require('dotenv').config()

console.log(process.env.DB_STRING);

//Creating Database Variables
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//Connecting to MongoDB Database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
//Declaring ejs as the view engine
app.set('view engine', 'ejs')
//Allowing access to files in the public folder
app.use(express.static('public'))
//Parses incoming requests with encoded URLs
app.use(express.urlencoded({ extended: true }))
//Parses incoming JSON strings to JS objects
app.use(express.json())


//Get call to main page to load the total tasks and the tasks left to do 
app.get('/',async (request, response)=>{
    //creates variable with all the todos
    const todoItems = await db.collection('todos').find().toArray()
    //creates variable with all the todos that are not completed
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

//Post call to create a new task
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//Update call to update a task to completed
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

//Update call to mark a task as incomplete
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

//Delete call to remove a task 
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//Listen call to know where to host the server
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})