const express = require('express') // making it possible to use express in this file
const app = express() // setting a constant and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 // Setting a constant to determine the location where our server will be listening.
require('dotenv').config() // Allows use to look for variables inside of the .env file

let db, // declaring a variable globally and not assigning a value
  dbConnectionStr = process.env.DB_STRING, // declaring a variable and assigning our database connection string to it
  dbName = 'todo' // declaring a variable and assigning the name of the databse we will be using

// creating a connection to MongoDB, and passing in our connection string. Also passing in an additional property
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then((client) => {
  // Waiting for the connection and proceeding if successful, and passin in all the client information
  console.log(`Connected to ${dbName} Database`)
  db = client.db(dbName) // assigning a value to previous declared db variable that contains a db client factory method
})

// MIDDLEWARE
app.set('view engine', 'ejs') // sets ejs as the default render
app.use(express.static('public')) // sets the location for static assets
app.use(express.urlencoded({ extended: true })) // Tells express to decode and encode URLs where the header matches the content. Supports arrays and objects.
app.use(express.json()) // Parses JSON content from incoming requests (bodyParser is deprecated now)

// Starts a GET method when the root route is passed in, sets up req and res parameters
app.get('/', async (request, response) => {
  // Sets a variable and awaits ALL items from the todos collection
  const todoItems = await db.collection('todos').find().toArray()
  // Sets a variable and awaits a count of uncompleted items to later display in EJS
  const itemsLeft = await db.collection('todos').countDocuments({ completed: false })
  // rendering the EJS file and passing through the db items and the count remaining inside of an object
  response.render('index.ejs', { items: todoItems, left: itemsLeft })

  // SAME CODE AS BEFORE BUT WITH PROMISES
  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
})

// Starts a POST method when the '/addTodo' route is passed in, via the form
app.post('/addTodo', (request, response) => {
  // Inserts a new item into todos collection. gives it a completed value of false by default
  db.collection('todos')
    .insertOne({ thing: request.body.todoItem, completed: false }) // if insert is successful, do something
    .then((result) => {
      console.log('Todo Added')
      response.redirect('/') // gets rid of the /addTodo route, and redirects back the root route (homepage).
    })
    .catch((error) => console.error(error)) // catching errors
})

// Stats a PUT method when the markCoplete route is passed in
app.put('/markComplete', (request, response) => {
  db.collection('todos')
    .updateOne(
      // look in the db for one item matching the name of the item passed in from the main.js file that was clicked on.
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: true, // set completed status to true
        },
      },
      {
        sort: { _id: -1 }, // moves item to the bottom of the list
        upsert: false, // prevents insertion if item does not already exist
      }
    )
    .then((result) => {
      // Starting a then if the update was successful
      console.log('Marked Complete')
      response.json('Marked Complete') // Sending a response back to the sender
    })
    .catch((error) => console.error(error)) // catching errors
})

// Stats a PUT method when the markUnCoplete route is passed in
app.put('/markUnComplete', (request, response) => {
  db.collection('todos')
    .updateOne(
      // look in the db for one item matching the name of the item passed in from the main.js file that was clicked on.
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: false, // set completed status to true
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      }
    )
    .then((result) => {
      console.log('Marked Complete')
      response.json('Marked Complete')
    })
    .catch((error) => console.error(error))
})

// Starts a DELETE method when the delete route is passed
app.delete('/deleteItem', (request, response) => {
  // look inside the todos collection for the ONE item that has a matching name from our JS file
  db.collection('todos')
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      console.log('Todo Deleted')
      response.json('Todo Deleted')
    })
    .catch((error) => console.error(error))
})

app.listen(process.env.PORT || PORT, () => {
  // Setting up which port we will be listening on - either the port from the .env or the port variable we set
  console.log(`Server running on port ${PORT}`)
})
