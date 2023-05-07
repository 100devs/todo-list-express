// At the start of our server file, we declare what packages we are going to be using
// First is express, a minimalist, fast web API for Node js
const express = require('express')
// We bind the express call to a new variable for ease of use
const app = express()
// Mongo will alow us to interact with our mongodb database
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
// dotenv will allow us to use an envfile to store our database connection string separate so we don't have to upload it to a public repository
require('dotenv').config()

// Ease of use variables, including one to store our database connection string
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// These MongoClient lines allows to connect to our database with our connection string, by using methods from the db object
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

// This line allows us to use embedded js for our html templates with express
app.set('view engine', 'ejs')
// This line gives us access to all local files contained in the /public folder
app.use(express.static('public'))
// These 2 following lines are utilities for url manipulation and json conversion
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// This method will handle get/read requests to the home page.
app.get('/',async (request, response)=>{
    // First, it will fetch from the server the todo items by going to the 'todos' collection, grabbing every element present, and converting them to an array.
    const todoItems = await db.collection('todos').find().toArray()
    // Then it will count the number of items in the collection which complete property is set to false.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Finally, it will respond the get request by rendering our index.ejs file with the todo items and the number of items left.
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

// This post method will handle new todo items.
app.post('/addTodo', (request, response) => {
    // Once the request is made, an insertOne call is done to the 'todos' collection, including the content of the form submitted via the request body.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // When the operation is resolved, the user is redirected to the home page, thus reloading the app with the new info.
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// The following put methods handle updating the 'completed' status of each todo item in the database.
app.put('/markComplete', (request, response) => {
    // When the request is made, an update order is transmitted to the database, searching for the item with a 'thing' property which value matches the itemFromJS's value appended to the request body.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Once found, its completed property is set to true.
        $set: {
            completed: true
          }
          // The sort option would sort the selected items descending order based on the id number, but since we are only updating one item, it servers no purpose here. Upsert, if set to true, would allow us to create an item with the specified properties if we didn't find an existing one.
    },{
        sort: {_id: -1},
        upsert: false
    })
    // As the operation is completed, we return a completion message in json format.
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// Same process as the markComplete request, but different completed value.
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

// This method allows us to handle a delete request to the deleteItem route.
app.delete('/deleteItem', (request, response) => {
    // We go to our todos collection, and use the deleteOne method, selecting the item by matching the 'thing' property's content to that from the request body.
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // As the request is processed, we respond with a confirmation message.
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// The 'listen' express method prepares our server to listen to all requests made to the specified port number. As arguments, we pass first the PORT variable stored in the host's .env file. If that isn't found, we use the PORT variable declared in this file.
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})