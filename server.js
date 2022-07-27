// require/import express
const express = require('express') 
// renaming the function for brevity
const app = express()
// require/import MongoClient so we can connect to database
const MongoClient = require('mongodb').MongoClient
// set up a localhost port
const PORT = 2121
// require/import dotenv for use in connections
require('dotenv').config()
// MISSING CORS

// declaring 3 global scope variables: db, dbConnectionStr is pulled from env file, and naming the database as 'todo'.
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// connecting to Mongo using our connection string and telling it how to connect
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        // assign client.db('todo') which is the database returned from the MongoClient connection to db
        db = client.db(dbName)
    })

// setting the view through ejs
app.set('view engine', 'ejs')
// executing middleware to return static files coming from 'public' folder or will return HTTP 404
app.use(express.static('public'))
// parses incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: true }))
// convert request body to a JSON Object
app.use(express.json())

// When user requests the root '/' url, it will be served the index.ejs file
app.get('/',async (request, response)=>{
  // first, find all items in the collelction 'todos' and make an array of them
    const todoItems = await db.collection('todos').find().toArray()
    // find all items in the collection 'todos' that have not been completed and return total number
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
  // render index.ejs while passing in two arguments: an array of items in the 'todos' collection; and the number of itemsLeft
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

// Will add a new item to 'todos' collection with the inserted text, and will mark it as not completed.
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
      // After the promise is fulfilled, we will log and redirect to root url
      .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
      // Will catch any error of inserting item - if the promise is rejected, we will log an error
    .catch(error => console.error(error))
})


// if update requested at '/markComplete'
app.put('/markComplete', (request, response) => {
  // updateOne document in 'todos' that has 'thing' as request.body.itemFromJs, which is sent from main.js by a click as Complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        // sort in descending order based on id ??
        sort: {_id: -1},
        // do not insert new item if item does not already exist in collection
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
      // Will catch any error of marking item Complete - if the promise is rejected, we will log an error
    .catch(error => console.error(error))

})

// if update requested at '/markUnComplete'
app.put('/markUnComplete', (request, response) => {
    // updateOne document in 'todos' that has 'thing' as request.body.itemFromJs, which is sent from main.js by a click as UnComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        // sort in descending order based on id ??
        sort: {_id: -1},
        // do not insert new item if item does not already exist in collection
        upsert: false
    })
    .then(result => {
        console.log('Marked Uncomplete')
        response.json('Marked Uncomplete')
    })
      // Will catch any error of marking item UnComplete - if the promise is rejected, we will log an error
    .catch(error => console.error(error))

})

// if delete requested at '/deleteItem'
app.delete('/deleteItem', (request, response) => {
    // Delete the document in 'todos' that has 'thing' as request.body.itemFromJs, which is sent from main.js by a click 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
      // Will catch any error of Deleting item - if the promise is rejected, we will log an error
    .catch(error => console.error(error))

})

// server is listening at the port selected by Heroku or the assigned port in our PORT variable
app.listen(process.env.PORT || PORT, ()=>{
    // when the server is running, the message will print showing that it's connected
    console.log(`Server running on port ${PORT}`)
})
