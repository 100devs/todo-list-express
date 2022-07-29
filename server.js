// Import express module
const express = require('express')
// Set express as app variable
const app = express()
// Import mongoDB module
const MongoClient = require('mongodb').MongoClient
// Set PORT for development
const PORT = 2121
// Import dotenv module to allow environment variables
require('dotenv').config()

// Declare empty variable db
let db,
    // Declare and assign MonogoDB url string to connect to remote DB
    dbConnectionStr = process.env.DB_STRING,
    // Set remote databse name as todo
    dbName = 'todo'

// Connecting to remote DB and pass option parameter to use a different server discovery and monitoring engine
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // Promise chain and pass returned client into arrow function
    .then(client => {
        // Log DB name to terminal if connection is successful
        console.log(`Connected to ${dbName} Database`)
        // Set empty variable to a new/existing database on remote server
        db = client.db(dbName)
    })

// Setting EJS as the JS templating to use which will generate html files that are sent to the client
app.set('view engine', 'ejs')
// Middleware for serving files requested from the public folder
app.use(express.static('public'))
// Middleware which allows you to use the url query parameters and pass objects to the server from the client side
app.use(express.urlencoded({ extended: true }))
// Middleware to parse incoming payloads to the server as JSON
app.use(express.json())


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

app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

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