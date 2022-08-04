//import express modules (a JS file/library that you can import into other code)
const express = require('express')
//saves express as a function in the variable app
const app = express()
// pulling all the mongo package modules
const MongoClient = require('mongodb').MongoClient
// setting the local host to 2121
const PORT = 2121
//import dotenv file code, which contains the database string with username/password for the database
require('dotenv').config()

// declare 3 variables (db, dbConnectionStr, dbName)
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = 'todo'

// useUnifiedTopology: Set to true to opt in to using the MongoDB driver's new connection management engine --the MongoDB driver will try to find a server to send any given operation to, and keep retrying for serverSelectionTimeoutMS milliseconds
// Connects to MongoDB and keeps it updated with the unified topology setting
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  .then(client => {
    // console logs which DB the user is connected to
    console.log(`Connected to ${dbName} Database`)
    //sets db to the mongodb 'todo' database 
    db = client.db(dbName)
  })
//setting out tempating language to EJS
app.set('view engine', 'ejs')
//allows the public folders files to be accessed without having to write extra code
app.use(express.static('public'))
// REturns middleware that only parses JSON and only looks at requests where the content-type header matches the type option - recognizes incoming request objects as strings or arrays

//Middleware? It is those methods/functions/operations that are called BETWEEN processing the Request and sending the Response in your application method.
app.use(express.urlencoded({ extended: true }))
//The app.use () function adds a new middleware to the app. Essentially, whenever a request hits your backend, Express will execute the functions you passed to app.use () in order. We need express.json for post and put requests so the server can understand it as JSON. 
app.use(express.json())

//whenever we get a request for the home page, the async event handler will be triggered. Since we don't know how long it will take for us to receive the info, we tag it async.
app.get('/', async (request, response) => {
  //we pull all of our 'todo' out of our db collection and put it into an array and set todoItems value to the aforementioned array
  const todoItems = await db.collection('todos').find().toArray()
  // counts unfinished todo items in database and sets itemsLeft to that number
  const itemsLeft = await db.collection('todos').countDocuments({ completed: false })
  //will send the response of 'index.ejs'
  response.render('index.ejs', { items: todoItems, left: itemsLeft })

  // Commented out code is the same as above but using promises

  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
  })

  //the backend will get a request to create a new item, the handler will be triggered. 
  app.post('/addTodo', (request, response) => {
    // upon submit, accesses database collection todos, insertone (add one) thing - item - append to body the to do item created, set completed key to false for this item
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false })
      //if the promise is successfully resolved, the server will reditect us to the home/root page. Console log 'todo added'
      .then(result => {
        console.log('Todo Added')
        response.redirect('/')
      })
      // if error, console log error
      .catch(error => console.error(error))
  })

  //the server receives a request for /markComplete
  app.put('/markComplete', (request, response) => {
    //identify the item as item from JS
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
      //command to set completed to true value; this is a MongoBD command. 
      $set: {
        completed: true
      }
    }, {
      //changes id to -1, which sorts item
      sort: { _id: -1 },

      //searches body for item, if not found if upsert were true it would create a new item, since false it does not
      upsert: false
    })
      //when the promise is fulfilled, then return console.log and response.json
      .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
      })
      .catch(error => console.error(error))

  })
  //same as above but $set value: false. 
  app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
      $set: {
        completed: false
      }
    }, {
      //the -1 tells the array will be structured
      sort: { _id: -1 },
      //
      upsert: false
    })
      .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
      })
      .catch(error => console.error(error))

  })
  
// server receives a request for delete, accesses db collection (todos), tells the server to delete one thing, once promise is resolved, console logs and responds 'todo deleted'
  app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS })
      .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
      })
      .catch(error => console.error(error))

  })
// it tells the server to listen to the a specific port 
  app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
