// Import express from node modules
const express = require('express')
// Initialze an express object for the server
const app = express()
// Import MongoClient object for connecting to and making requests to mongodb
const MongoClient = require('mongodb').MongoClient
// Specify port to run application on
const PORT = 2121
// import values from .env file
require('dotenv').config()


let db, // Initialize db variable to store db information after it is retrieved
  dbConnectionStr = process.env.DB_STRING, // Use .env to get db connection string and assign to var
  dbName = process.env.DB_NAME // name of db to connect to

// Connect to mongodb using the connection string (unified topology is a setting suggested by mongodb)
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  .then(client => { // After connecting to db
    // Log connection to database to console
    console.log(`Connected to ${dbName} Database`)
    // Save the database reference to the db var initialized earlier
    db = client.db(dbName)
  })

// Add middleware/settings/things to run before requests
app.set('view engine', 'ejs') // Use ejs view engine
app.use(express.static('public')) // Make items in public folder available without specifying routes to them
app.use(express.urlencoded({ extended: true })) // Needed to parse body in requests
app.use(express.json()) // Needed to parse json in body of requests

// Set root route
app.get('/', async (request, response) => {
  // Fetch all items from 'todos' collection in db and store as array
  const todoItems = await db.collection('todos').find().toArray()
  // Get a count of all items that are not marked complete in db
  const itemsLeft = await db.collection('todos').countDocuments({ completed: false })
  // Send response of ejs with items and remaining itemsLeft values passed in
  response.render('index.ejs', { items: todoItems, left: itemsLeft })

  // Unused: Then chain version of await function above
  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
})

// Path to create a new todo item (form submits to this)
app.post('/addTodo', (request, response) => {
  // Create a new item to the collection (request.body.todoItem hold the text)
  db.collection('todos').insertOne({ thing: request.body.todoItem.trim(), completed: false })
    // After submitting confirm success
    .then(result => {
      // Log success to console
      console.log('Todo Added')
      // Redirect to root route
      response.redirect('/')
    })
    //Error handling, log error to console
    .catch(error => console.error(error))
})

// Path to update an item as complete
app.put('/markComplete', (request, response) => {
  // Update an item by searching for an item with the same text as the request body
  db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
    // Set a value of this collection item
    $set: {
      // Set completed to true (should have previously been false)
      completed: true
    }
  }, {
    // Sort by id low to high
    sort: { _id: -1 },
    // Do not insert a record if it does not exist
    upsert: false
  })
    // After successful update
    .then(result => {
      // Log success to console
      console.log('Marked Complete')
      // Send json response that item is marked complete back to user
      response.json('Marked Complete')
    })
    // Error handling, log error to console
    .catch(error => console.error(error))

})

// Path to update an item as not complete
app.put('/markUnComplete', (request, response) => {
  // Update an item by seraching for an item with the same text as the request body
  db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
    // Set a value of this collection item
    $set: {
      // Set complted to false (should have previously been true)
      completed: false
    }
  }, {
    // Sort by id low to high
    sort: { _id: -1 },
    // Do not insert a record if it does not exist
    upsert: false
  })
    // After successful update
    .then(result => {
      // Log Success to console
      console.log('Marked UnComplete')
      // Send json response that item is marked complete back to user
      response.json('Marked UnComplete')
    })
    // Error handling, log error to console
    .catch(error => console.error(error))

})

// Path to delete an item
app.delete('/deleteItem', (request, response) => {
  // Delete an item by searching for an item with the same text as the request body
  db.collection('todos').deleteOne({ thing: request.body.itemFromJS })
    // After successful delete
    .then(result => {
      // Log success to console
      console.log('Todo Deleted')
      // Send json response that item is marked complete back to user
      response.json('Todo Deleted')
    })
    // Error handling, log error to console
    .catch(error => console.error(error))

})

// Start app and listen for requests on provided port
// If one is listed in .env use that, otherwise port defined at top of page will be used (2121)
app.listen(process.env.PORT || PORT, () => {
  // Log what port the application is running on on app start
  console.log(`Server running on port ${PORT}`)
})