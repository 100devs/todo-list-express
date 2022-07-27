//getting express from npm package
const express = require('express')
//renaming express function for ease of use
const app = express()
// getting/requiring the 'mongodb' and renaming it for ease of use. 
const MongoClient = require('mongodb').MongoClient
// initalizes and sets PORT variable
const PORT = 2121
// calls dotenv package (for files that start with dot, like .gitignore)
require('dotenv').config()

//initializes and sets variables for db, dbConnectionStr, and dbName. it's good practice to not set the actual MongoDB string here but on Heroku instead.  
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = 'todo'
  
// initializes MongoDB Connection, useUnifiedTopology will default to true now. it has a callback function that grabs the connection and sets the database name. NOTE { useUnifiedTopology: true } is now the default in node and MongoDB, so it's unnecessary.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  .then(client => {
    console.log(`Connected to ${dbName} Database`)
    db = client.db(dbName)
  })


// sets middleware functions
// enables the view engine to use ejs when rendering.it allows it to look in the "views" folder as well. 'views' is just defaulted in for ejs.
app.set('view engine', 'ejs')
// this tells express to automagically pull the style.css and main.js files from the "public" folder. serves static files with static assets directories.
app.use(express.static('public'))
// It parses incoming requests with urlencoded payloads and is based on body-parser. replaced body-parser: extended.
app.use(express.urlencoded({ extended: true }))
//It parses incoming JSON requests and puts the parsed data in "req.body"
app.use(express.json())


app.get('/', async (request, response) => {
  //grabs all the todo items and puts them in an array
  const todoItems = await db.collection('todos').find().toArray()
  //grabs all the items left (if completed: false), counts them, then gives a number
  const itemsLeft = await db.collection('todos').countDocuments({ completed: false })
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
  //insert to the todo collection as an item that is not in complete state
  //log that the item was added and redirect to the root index
  db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false })
    .then(result => {
      console.log('Todo Added')
      response.redirect('/')
    })
    .catch(error => console.error(error))
  //If the post request fails, it throws and logs the error.
})
//Makes a request to /markComplete endpoint, to update the object that matches the request.body.itemFromJS, and sets that objects "completed" property to true, as well as sorts it to the end of the array.
app.put('/markComplete', (request, response) => {
  db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
    //Sets "completed" property to true.
    $set: {
      completed: true
    }
  }, {
        //Brings this object to the end of the array. sorts from first created to most recently created. upsert:false tells mongoDB to not insert a new document.
    sort: { _id: -1 },
    upsert: false
  })
    .then(result => {
      console.log('Marked Complete')
      response.json('Marked Complete')
    })
    .catch(error => console.error(error))
//If the put request fails, it throws and logs the error.
})
//Makes a request to /markUnComplete endpoint, to update an item that has been previously marked as complete back to incomplete.
app.put('/markUnComplete', (request, response) => {
  //Looks in the database collection 'todos' to update one object that matches the request.body.itemFromJS given in the request
  db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
    //sets the value of the requested object to false
    $set: {
      completed: false
    }
  }, {
    //Brings this object to the end of the array. sorts from first created to most recently created. upsert:false tells mongoDB to not insert a new document.
    sort: { _id: -1 },
    upsert: false
  })
    .then(result => {
      console.log('Marked Complete')
      response.json('Marked Complete')
    })
    .catch(error => console.error(error))
  //If the put request fails, it throws and logs the error.

})
//Requests the server to delete a specific item
app.delete('/deleteItem', (request, response) => {
  //Goes into the database collection "todos" and finds the key "thing" with the value that matches the request.body.itemFromJS
  db.collection('todos').deleteOne({ thing: request.body.itemFromJS })
    //If the delete request is fullfilled, logs it to the console and responds to the requester with a json.
    .then(result => {
      console.log('Todo Deleted')
      response.json('Todo Deleted')
    })
    //If the delete request fails, it throws and logs the error.
    .catch(error => console.error(error))

})
//starts the app to listen on either the PORT used by the hosting service, or the PORT hardcoded in. Heroku can make its own port number.
app.listen(process.env.PORT || PORT, () => {
  //Writes in the console when the server starts, and lists the port. 
  console.log(`Server running on port ${PORT}`)
})


// can you see this?YESSSS

