// Using express and setting app so we can use express
const express = require('express')
const app = express()
// Use MongoDB
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
// Environment variables 
require('dotenv').config()

// Connect to MongoDB
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = process.env.DB_NAME

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

// Using ejs as our templating language
app.set('view engine', 'ejs')
// Using Public folder to hold all our static files CSS/JS
app.use(express.static('public'))
// Allows to look at the request that are coming through and pull the data out of those requests (what a body parser would do). e.g.: get text out of a request
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// GET request on root page '/'
app.get('/', async (request, response) => {
  // Go to DB and get all documents from collection 'todos' as an array of objects
    const todoItems = await db.collection('todos').find().toArray()
  // Go to DB and count all documents that are not completed
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
  // Plug elements in the ejs template and render it out: respond with HTML 
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

// POST request on route '/addTodo', which comes from the action on the form that made the POST request: <form action="/addTodo" method="POST">
app.post('/addTodo', (request, response) => {
  // Grab value request.body.todoItem and add(.insertOne) to DB
  // The input has the name 'todoItem': <input type="text" placeholder="Thing To Do" name="todoItem">
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
  // Respond OK and refresh(.redirect)
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
  // Update the first document in DB with value for 'thing' property from 'request.body.itemFromJS'
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
      // Set 'completed' property to 'true'
        $set: {
            completed: true
          }
    },{
      // Sort top to bottom
        sort: {_id: -1},
        // update and insert: If you try to update something that wasn't it would create it for you
        upsert: false
    })
    .then(result => {
      // console.log to server side
        console.log('Marked Complete')
      // respond to the client side
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

// route deleteItem, go to DB and delete document with thing from request.body.itemFromJS
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}, http://localhost:${PORT}`)
})