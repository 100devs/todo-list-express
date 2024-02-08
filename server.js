// Allows you to use the express module to build a web server
const express = require('express')
// Invokes the express module and assign it to the app so we don't have to use express() each time
const app = express()
// Allows you to connect to the mongodb with mongodb module
const MongoClient = require('mongodb').MongoClient
// Defines on which port you can access the web server
const PORT = 2121
// Enables the web server to read enviroment variables from the .env file
require('dotenv').config()

// Declare some variables, pulls the database string and assign it to dbConnectionStr variable, changes the name of database to todo
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// Connects the user to the mongodb and console logs that they are connected to the database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

// Tells the app to use ejs as the view engine
app.set('view engine', 'ejs')
// Tells the app to serve up static files from the public directory
app.use(express.static('public'))
// Used to parse URL-encoded data from request and make it accessible in the req.body objext
app.use(express.urlencoded({ extended: true }))
// Allows the app to use json format data easily
app.use(express.json())

// Use the '/' route as a default route 
app.get('/',async (request, response)=>{
    // Go to the 'todos' collection in the database and find all the item in there and parse them in an array and assign that array to todoItems variable
    const todoItems = await db.collection('todos').find().toArray()
    // Go to the 'todos' collection in the database and take all the documents that have the completed property set to false and assin them to itemsLeft variable
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Render the index.ejs, passing todItems and itemsLeft variables to be used in the template
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // Go to 'todos' collection in database and find all the element there and parse them into an array
    db.collection('todos').find().toArray()
    .then(data => {
        // Go to the 'todos' collection in the database and take all the documents that have the completed property set to false
        db.collection('todos').countDocuments({completed: false})
        .then(itemsLeft => {
            // Render the index.ejs, passing todItems and itemsLeft variables to be used in the template
            response.render('index.ejs', { items: data, left: itemsLeft })
        })
    })
    // Catch any errors and console logs it
    .catch(error => console.error(error))
})

// Use '/addTodo' route when someone wants to add a new item
app.post('/addTodo', (request, response) => {
    // Go to 'todos' collection and insert a document and take the things property value from request body and completed property is hard coded
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        // Console log to the user that task was added to the collection
        console.log('Todo Added')
        // Redirect to the main route to reload the page
        response.redirect('/')
    })
    // Let the user know that task was not add and console log the error
    .catch(error => console.error(error))
})

// Use the route '/markComplete' to update the task as completed
app.put('/markComplete', (request, response) => {
    // Go to 'todos' collection and update the document completed property to true from false, sort documents in descending order
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    // Let the user know that the task was marked completed by console log it and responding 'Marked complete' as json to user
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    // Let the user know that task was not marked complete and console log the error
    .catch(error => console.error(error))

})

// Use the route '/markUnComplete' to update the task as uncompleted
app.put('/markUnComplete', (request, response) => {
    // Go to 'todos' collection and update the document uncompleted property to false, sort documents in descending order
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    // Let the user that the action they took succeeded respond to them by send a json format text
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    // Let user know that action did not succeed and console log the error
    .catch(error => console.error(error))

})

// Use the route 'deleteItem' to delete a document from the database
app.delete('/deleteItem', (request, response) => {
    // Go to 'todos' collection in the database and delete the item that matches the one that was sent with request body 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        // Let user know that action they took succeeded, response with json format 'Todo deleted' text
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    // Let user know that the action they took did not succeed and console log the error
    .catch(error => console.error(error))

})

// Tells express the use the port number provided by the Heroku or use the default route provided by user
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})