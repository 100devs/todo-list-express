// Declare requirement variables
// npm install express, and require
const express = require('express')
// app is easier to write and makes code cleaner
const app = express()
// npm install mongodb, and require. MongoClient allows use of Mongo methods
const MongoClient = require('mongodb').MongoClient
// Declaring a port to view in local environment
const PORT = 2121
// npm install dotenv and require, make .env file and add, DB_STRING and node_modules so they are only available in local environment
require('dotenv').config()

// Declare mongoDB connection variables to be used later
let db, // database
    dbConnectionStr = process.env.DB_STRING, // process.env allows it to use the connection string hidden in .env file
    dbName = 'todo' // name of database built in Mongo
// Connecting to MongoDB collection
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // Allows you to use Mongo's new database management system
    .then(client => { // After the connection goes through then is thown
        console.log(`Connected to ${dbName} Database`) // Shows in terminal when we have connected to MongoDB
        db = client.db(dbName) // Mongo method to store defined collection in a variable
    })

// Middlewares
// Defines what we are using to render the page for client side
app.set('view engine', 'ejs')
// Serves the public folder's files
app.use(express.static('public'))
// Parsing bodies from URL
app.use(express.urlencoded({ extended: true }))
// Tells us what type of information we will be sending, json
app.use(express.json())

// Anyncronous function to read the information to show on the page
app.get('/',async (request, response)=>{ // get info to show  on root/default page 
    const todoItems = await db.collection('todos').find().toArray() // variable to define documents as an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // countshow many documents have been created
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // shows the documents via the ejs rendering
    // A way to do the same thing, without async/await
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// Creation of new document (todo item) for database
app.post('/addTodo', (request, response) => { // page route and request for new info
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //insertOne is a method to add to Mongo. Gets "toDoItem" from ejs input name
    .then(result => { // after item is inserted
        console.log('Todo Added') // log to verify item has been added
        response.redirect('/') // After item has been added, it refreshes the page
    })
    .catch(error => console.error(error)) // incase addition is unsuccessful 
})
// Updating a todo task as completed
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // find the item the user clicked to complete, using the ejs thing body
        $set: { // set completed property to true
            completed: true // documents created as false for default, so change to true
          }
    },{
        sort: {_id: -1}, // sort items 
        upsert: false // if document doesn't exist, create and insert
    })
    .then(result => { // upon successful completion of update
        console.log('Marked Complete') // shows completion in console
        response.json('Marked Complete') //responds to line 46 in main.js
    })
    .catch(error => console.error(error))

})
// same as marked complete... but opposite
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
// Remove item from task list
app.delete('/deleteItem', (request, response) => { // delete request
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // go into database and find item to delete
    .then(result => { // if successful
        console.log('Todo Deleted') // log deletion
        response.json('Todo Deleted') // response to main.js 
    })
    .catch(error => console.error(error)) // log error if unsuccessful

})

app.listen(process.env.PORT || PORT, ()=>{ // find port from environment
    console.log(`Server running on port ${PORT}`) // verify server is running with console log
})