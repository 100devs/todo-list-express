const express = require('express') // import express into the project
const app = express() // variable name to create an instance of express
const MongoClient = require('mongodb').MongoClient // import mongo db into the project
const PORT = 2121 // set the port for the server to listen for requests
require('dotenv').config() // import dotenv toload environment variables from .env file

// read db connection info from environment variables (db, donnection string)
// assign 'todo' to db name
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// connect to the db using Mongo instance (declared above)
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connect to MongoDB
    .then(client => { // take that connection & do something with it
        console.log(`Connected to ${dbName} Database`) // log the connection
        db = client.db(dbName) // assign the database to the db variable
    })
    
app.set('view engine', 'ejs') // set the view engine (templating language) to ejs
app.use(express.static('public')) // telling express to serve static files from the 'public' directory
app.use(express.urlencoded({ extended: true })) // lets express read URLs & params
app.use(express.json()) // lets express parse JSON in the request body


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