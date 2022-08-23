//importing express into server.js
const express = require('express')

//instantiating a new instance of an express app, allows you to use easy to use variable name app
const app = express()

//importing mongodb in order to connect to a mongo database
//import mongodb and instantiate a new MongoClient instance which allows you to manipulate, create, connect to a mongodb
const MongoClient = require('mongodb').MongoClient

//variable for local host port number
const PORT = 2121

//allows us to use the .env file to hide password
require('dotenv').config()

//db - database
//dbConnectionStr - allows us to connect to mongodb

let db,
    dbConnectionStr = process.env.DB_STRING, //process of looking in the env file for the .DB_String variable
    dbName = 'todo' //name of the database

//connects this app to mongoclient
//useUnifiedTopology allows us to format connection string into a promise so that we can use handlers
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        //allows you to access data within the mongodb collection
        db = client.db(dbName)
    })
    
//sets uour view enginer to ejs - allows us to use ejs
app.set('view engine', 'ejs') 
//sets up a public folder that will serve files to client
app.use(express.static('public'))
//parses incoming requests with urlencoded payloads and is based on bodyparser (bodyparser is deprecated)
app.use(express.urlencoded({ extended: true }))
//parses incoming JSON requests and puts the parsed data into req/request
app.use(express.json())

//defines for a GET request at default endpoint
app.get('/', async (request, response)=>{
    //accesses the mongodb collection called 'todos', and .finds ALL of the documents and stores the data in an array
    const todoItems = await db.collection('todos').find().toArray()
    //counts documents in database collection that have false as a value for key 'completed'
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //pass todoItems and itemsList to index.ejs file in order to be rendered
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

//defines a POST request at /addTodo endpoint - used to create a new document
app.post('/addTodo', (request, response) => {
    //adds new document to todos colleciton, todoItem property is pulled from our request body
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})

    .then(result => {
        console.log('Todo Added')
        //redirects to base endpoint after the document is added
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//defines a PUT request at /markComplete endpoint - used to update a document
app.put('/markComplete', (request, response) => {
    //updates a document from the todo collection
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            //sets the completed key to true (in ejs, which will add the class 'completed')
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

//defines a PUT request at /markUnComplete endpoint - used to update a document
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

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})