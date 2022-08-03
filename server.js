const express = require('express') // making it possible to use express in this file
const app = express() // setting a constant and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 // setting a constant to define the location where our server will be listening
require('dotenv').config() // allows us to look for variables inside of the .env file


let db, // declaring a (global) variable called db but not assigning a value
    dbConnectionStr = process.env.DB_STRING, // declaring a variable and assigning our database connection string (from .env) to it 
    dbName = 'todo' // declaring a variable and assigning the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // creating a connection to MongoDB, and passing in our connection string. Also passing in an additional property
    .then(client => { // waiting for the connection and proceeding if successful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`) // log to the console a template literal "Connected to todo Database"
        db = client.db(dbName) // assigning a value to previously declared db variable that contains a db client factory method
    }) // closing our .then

// middleware    
app.set('view engine', 'ejs') // sets ejs as the default render
app.use(express.static('public')) // sets the location for static assets
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json()) // parses JSON content from incoming requests


app.get('/',async (request, response)=>{ // starts a GET/READ method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() // sets a constant and awaits all items form the todos collection
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