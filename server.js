//declaring express package to the express variable
const express = require('express')
//reassigning to the app variable
const app = express()
//declaring mongo database to the Mongoclient variable
const MongoClient = require('mongodb').MongoClient
//declaring a variable for port for readability
const PORT = 2121
//require the .env module
require('dotenv').config()

// Decalring variables for MongoDB Database and env file
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//Connecting server to MongoDB via env file
//and connsole logging if connected succesfully
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

// Middleware
//setting up view engine and ejs for page rendering.
app.set('view engine', 'ejs')
//setting up access to the public folder for CSS and client side JS
app.use(express.static('public'))
//setting up The express.urlencoded() function which is a built-in middleware function in Express. 
//It parses incoming requests with urlencoded payloads and is based on body-parser.
app.use(express.urlencoded({ extended: true }))
//JSON
app.use(express.json())

// GET Method
// setting up get request in the root folder,
// with async function. declaring a todoItems variable and passing it to the array.
// declaring a variable for the uncompleted tasks
app.get('/',async (request, response)=>{
     // render html for the 2 variables and response to the client.
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

// POST Method
// creating a new request to add new documents to the DB and assigning false status(incomplete task)
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //console log and refresh.
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    //handling errors
    .catch(error => console.error(error))
})

// PUT Method
// updating the document's completed value to true
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{ //adds updated documents to the top of the list
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// PUT Method
// updates the document's completed value to false
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
        console.log('Marked Uncomplete')
        response.json('Marked Uncomplete')
    })
    .catch(error => console.error(error))

})

// DELETE Method
// removes the documents from the DB,console logs and responds with json
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// Starts Server
// setting up a listen method for Heroku (process.env) or the local port from the PORT variable
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})