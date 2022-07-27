
// DEPENDENCIES:
// imports the Express library
const express = require('express')

// creates an instance of the express library
const app = express()

// Enables the use/imports of the Mongodb module
const MongoClient = require('mongodb').MongoClient

// creates a port for localhost / express where to listen
const PORT = 2121

// separating secret string - 1. loading dotenv package
// 2. loading the confi() file from that package
require('dotenv').config()

// DB (no value yet), 
// setting the dbConnection String to the .evn file
// referencing the 'todo' db (which should already exist)
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// setting up the mongoClient connetion 
// first line is setting up a promise -successful or rejected connection
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
// handling a successful resolved promise & console logging it 
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
//APP SETTINGS
// telling express that EJS is the viewengine
app.set('view engine', 'ejs')
// Serves the contents of the Public folder as is
app.use(express.static('public'))
// middleware that intercepts requests & responses
// tells the client to pass a query string back to server via url: (http://localhost/route?variable=value&otherVariable=otherValue)
app.use(express.urlencoded({ extended: true }))
// tells the app to read in JSON
app.use(express.json())


// get method -> goes to ROOT directory
app.get('/',async (request, response)=>{
    // Find all documents in that collection 
    // requests mongo to return all records from 'totods' collection in array form
    const todoItems = await db.collection('todos').find().toArray()
    // returns a count of the number of records with the completed field = false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // telling express to render 
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

//post method for receiving the new todo
app.post('/addTodo', (request, response) => {
    // adds new record to db with 'completed' field set to false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // handles the returned promise, logs to the server console
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    // logs error to console
    .catch(error => console.error(error))
})

 // put / upbdate request
 // 
app.put('/markComplete', (request, response) => {
    // updates a record using value reveived from iutemfromJS in the body of the request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // sorts DB by completed - descending if completed
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    // sending response, log if successful
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    // send error if rejected
    .catch(error => console.error(error))

})

// opposite of prev put - sets completed to false
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

//Makes the delete request at the defined endpoint
app.delete('/deleteItem', (request, response) => {
    // mongo function to delete a single todo item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // if successful, log and send response
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    // if it fails, log the error
    .catch(error => console.error(error))

})


// tells server to startup and start taking requestgs at the given port
// sits and dwells in this function until it's killed
// should be at the end (it's a blocking function() ? )
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})