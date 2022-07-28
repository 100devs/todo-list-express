//setting up express app
const express = require('express')
const app = express()
//setting up mongoDB
const MongoClient = require('mongodb').MongoClient
//listening on port
const PORT = 2121
//setting dotenv config
require('dotenv').config()

//initialize database variables
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
//setting mongo database connection
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        //lets you know youre connected
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
//setting dependencies     
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//get request setting / as root
app.get('/',async (request, response)=>{
    //DB query to put todos into array and items left counted
    //these are async functions 
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
//api call to create a new todo item
app.post('/addTodo', (request, response) => {
    //insert new todo item into list
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        //confirmation message to console
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})
//api update function call
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //set the key value completed to true
        $set: {
            completed: true
          }
    },{
        //sort items descending
        sort: {_id: -1},
        //prevent from updating an item that doesnt exist
        upsert: false
    })
    .then(result => {
        //message confirming item completed
        console.log('Marked Complete')
        //response to server.js request
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})
//update api item as uncomplete
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
       //set the key value as false
        $set: {
            completed: false
          }
    },{
        //sort items descending
        sort: {_id: -1},
        //prevent from updating item that doesnt exist
        upsert: false
    })
    .then(result => {
        //message confirming uncomplete
        console.log('Marked UnComplete')
        //response to server.js request
        response.json('Marked UnComplete')
    })
    .catch(error => console.error(error))

})
//delete request 
app.delete('/deleteItem', (request, response) => {
    //delete item from todos 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        //message confirming delete
        console.log('Todo Deleted')
        //tesponse to server.js request
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})
//set listening port to port variable
app.listen(process.env.PORT || PORT, ()=>{
    //message confirming connection
    console.log(`Server running on port ${PORT}`)
})