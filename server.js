// requires express and setting it
// knows where to look to use express
const express = require('express')
// Saving the express call to the 'app' variable
const app = express()
// requiring MongoDB
const MongoClient = require('mongodb').MongoClient
// Declaring and hard-coding the port for our server
const PORT = 2121

// Requiring .env
require('dotenv').config()

// declaring db but leaving it undeclaring
let db,
    // the string we're going to use to connect to the MongoDB cluster
    dbConnectionStr = process.env.DB_STRING,
    // defining the name of the database
    dbName = 'todo'


// connecting to the database
// passing in the connectiong string to tell the connect method which server to connect to
// useUnifiedTopology determines the version of MongoDB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        // establishes the client with its given name
        db = client.db(dbName)
    })

// telling the app which view engine to use, so that we can use ejs
app.set('view engine', 'ejs')
// setting up the use of the public folder and tells ejs where to find the compatible files
app.use(express.static('public'))
// negates the need for body-parser
// and tells express to encode and decode URLs automatically
app.use(express.urlencoded({ extended: true }))
// tells express that everything we're doing in JSON
app.use(express.json())

// the operations to do when going to the different pages
// this is for the home page
app.get('/', async (request, response) => {
    // converts the todoItems into an array
    const todoItems = await db.collection('todos').find().toArray();
    // counts how many items still need to be done and counts them
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false });
    // renders the index.ejs page and passes the parameters into that page
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