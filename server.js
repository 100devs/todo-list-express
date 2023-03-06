//import express
const express = require('express')
//create new express application, assigned to app variable
const app = express()
//import mongodb to connect to database
const MongoClient = require('mongodb').MongoClient
//set default port variable 
const PORT = 2121
//require dotenv package that loads environment variables from .env file into process.env
require('dotenv').config()

//declares db variable
let db,
    //brings in the connenction string from .env file required to connect to your database
    dbConnectionStr = process.env.DB_STRING,
    //assigns database collection name to variable
    dbName = 'todo'

//connecting to MongoDB using mongodb method connect and passing in the connection string from .env file. useUnifiedTopology is set to true to ensure connection is made using the newer MongoDB driver.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
//once connected, it will console log a connected message and assign the db variable
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
//sets view engine to ejs for templating HTML
app.set('view engine', 'ejs')
//sets the server to automatically serve files requested from public folder
app.use(express.static('public'))
//tells express to decode and encode URLs
app.use(express.urlencoded({ extended: true }))
//parses JSON content from incoming requests
app.use(express.json())

//get request (read) for the root '/' route
app.get('/',async (request, response)=>{
    //access collection named 'todos' from database, puts data into an array. await is used to complete population before rendering
    const todoItems = await db.collection('todos').find().toArray()
    //counts items not completed and stored number in itemsLeft variable
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //now that promises are resolved, data from variables above is rendered through ejs
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

//starts a post request (create) to the '/addTodo' route
app.post('/addTodo', (request, response) => {
    //takes data from form with /addTodo route (in ejs file) and inserts new todo item in the todo collection with default value of comleted:false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        //once new item is created (post), console will show 'Todo Added' and 
        console.log('Todo Added')
        //page reload get request
        response.redirect('/')
    })
    //catches any errors and prints them to the console
    .catch(error => console.error(error))
})

//starts put method (update) at '/markComplete' route
app.put('/markComplete', (request, response) => {
    //goes to 'todo' collection and updates targeted item
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //mongo $set operator changes the targeted item status to completed: true
        $set: {
            completed: true
          }
    },{//moves item to the bottom of the list
        sort: {_id: -1},
        //upsert is default set to false, prevents new item from being added if above code doesn't find a match to the value
        upsert: false
    })
    .then(result => {
        //after update is completed, sends message to console and back to sender
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //catches any errors and prints to console
    .catch(error => console.error(error))

})

//starts put request at '/markUnComplete' route
app.put('/markUnComplete', (request, response) => {
    //targets item being passed in from main.js file
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //updates status on item to be completed: false
        $set: {
            completed: false
          }
    },{//moves item to bottom of list
        sort: {_id: -1},
        //default value, prevents insertion if item doesn't exist
        upsert: false
    })
    .then(result => {
        //logs to console and sends complete message back to sender
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //catches any errors and prints them to the console
    .catch(error => console.error(error))

})

//starts a delete method at '/deleteItem' route
app.delete('/deleteItem', (request, response) => {
    //searches database for item matching name of item being passed in from main.js and deletes first one it finds
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        //logs to console and sends deleted message back to sender
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    //catches any errors and prints them to the console
    .catch(error => console.error(error))

})

//sets server to listen on port in .env file or default port
app.listen(process.env.PORT || PORT, ()=>{
    //logs port to console
    console.log(`Server running on port ${PORT}`)
})