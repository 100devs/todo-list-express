// Requiring express
const express = require('express')
// Saving the express call to the app variable
const app = express()
// Require mongodb
const MongoClient = require('mongodb').MongoClient
//Declaring port
const PORT = 2121
//Require dotenv
require('dotenv').config()

//Declaring and empty 'db' variable
// a connection string variable that gets the string from .env or heroku variable
let db,
    dbConnectionStr = process.env.DB_STRING, 
    //declaring the name of the database to the 'dbname' variable
    dbName = 'todo'
//Connecting to the database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    // Setting up EJS   
app.set('view engine', 'ejs')
    // Setting up the public folder
app.use(express.static('public'))
    // Tells express to decide and encode URLs automatically
app.use(express.urlencoded({ extended: true }))
    //Tell express to use JSON
app.use(express.json())

//Setting routes
//Responding to a get request to the '/' route
app.get('/',async (request, response)=>{
    //Getting to-do items from the database
    const todoItems = await db.collection('todos').find().toArray()
    // Getting items witha "completed" value of false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Sending over the variables todoitems and itemsleft to EJS
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
// Responding to a post request to the /addTodo route 
app.post('/addTodo', (request, response) => {
    // Inserting a new item into the list
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // console logging that the todo list was added, the telling client to refresh the page 
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    // console log errors
    .catch(error => console.error(error))
})

// Responding to an update request to mark an item complete
app.put('/markComplete', (request, response) => {
    // Going into database, collection 'todos', and finding a document that matches request body
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // setting that documents 'completed' status to true
        $set: {
            completed: true
          }
    },{
        // sorting by the oldest first
        sort: {_id: -1},
        // if the document doesnt already exist, dont create a new one 
        upsert: false
    })
    // console logging that its been marked complete, and also responding back to the client in JSON, saying its been complete
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //basic error catch
    .catch(error => console.error(error))

})
// responding to an update request to mark an item incomplete 
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

//responding to a request to delete a item from the list
app.delete('/deleteItem', (request, response) => {
    // Going into the database and deleting the item that matches request.body
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//Setting the server to listen to requests
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})