const express = require('express')                  // require (or import) express
const app = express()                               // invoke express
const MongoClient = require('mongodb').MongoClient  // require mongodb's mongoClient allowing interaction with mongodb
const PORT = 2121                                   // port variable (location where we will be listening) set to a constant
require('dotenv').config()                          // require dotenv, allowing access to the .env file

let db,                                             // declare global variable called db allowing it to be accessible globally
    dbConnectionStr = process.env.DB_STRING,        // declare global variable for the connection string in .env file
    dbName = 'todo'                                 // declare global variable and assigning name of database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })  // connect to the database, passing in connection string with an additional property
  .then((client) => {                                               // if connection is successful,
    console.log(`Connected to ${dbName} Database`)                  // CL string with db name
    db = client.db(dbName)                                          // assign value to global db variable which is the db client factory method
})

// Middleware
app.set('view engine', 'ejs')                        // set default render method to ejs
app.use(express.static('public'))                    // static assets folder (contents are automagically accessible)
app.use(express.urlencoded({ extended: true }))      // automatically encode and decode URLs
app.use(express.json())                              // parses JSON from incoming requests

// Asynchronous function

app.get('/', async (request, response)=>{                             // responding to the get request to the root route
  const todoItems = await db.collection('todos').find().toArray()     // searching collection to find all documents from the todos collection
  const itemsLeft = await db                                          // creating a variable itemsLeft with a value set to the count of how many todos has its 'completed' property set to false
    .collection('todos')
    .countDocuments({ completed: false })
  response.render('index.ejs', { items: todoItems, left: itemsLeft }) // sending over the variables todoitems and itemsleft to EJS
  // db.collection('todos').find().toArray()                          // extra code to show how to set up same code using Promises and the 'then' keyword
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
})

// responding to the post request to route '/addTodo' (specified in the form element, in index.ejs)
app.post('/addTodo', (request, response) => {
    // inserting a new todo item to the list
    // The request.body.todoItem is found from the input element with name attribute in index.ejs
    // completed is false (otherwise, there will be a strikethrough)
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // if successful, proceed
    .then(result => {
        console.log('Todo Added')           // CL success message
        response.redirect('/')              // redirect client to root page (if this is missing, there will be an unresolved promise error)
    })
    .catch(error => console.error(error))   // if not successful, catch the error
})

// responding to put requests to route '/markComplete'
app.put('/markComplete', (request, response) => {
    // go to db. Inside the todos collection find an object with thing property with value that matches of that as found in req.body.itemFromJS
    // update that object if found
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true // set the found object's completed property to true
          }
    },{
        sort: {_id: -1},    // give me highest ids first (i.e. newest ones first)
        upsert: false       // if not found, do not insert
    })
    .then(result => {
        console.log('Marked Complete')      // CL success message 
        response.json('Marked Complete')    // respond back to the client in JSON with success message
    })
    .catch(error => console.error(error))   // if not successful, catch the error

})

// responding to update request to the route '/markUnComplete'
app.put('/markUnComplete', (request, response) => {
    // go to db and inside 'todos' collection, update the specified object as follows:
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false// set the found object's completed property to false
          }
    },{
        sort: {_id: -1},    // give me highest ids first (i.e. newest ones first)
        upsert: false       // if not found, do not insert
    })
    .then(result => {
        console.log('Marked Complete')      // CL success message 
        response.json('Marked Complete')    // respond back to the client in JSON with success message
    })
    .catch(error => console.error(error))   // if not successful, catch the error

})

// responding to delete request to the route '/deleteItem'
app.delete('/deleteItem', (request, response) => {
  db.collection('todos')                    // go to db and inside 'todos' collection, delete specified object
    .then((result) => {
      console.log('Marked Complete')        // CL success message
      response.json('Marked Complete')      // respond back to the client in JSON with success message
    })
    .catch((error) => console.error(error)) // if not successful, catch the error
})

// run your server
// dotenv file has the PORT (if not there, just go with PORT as defined in server.js)
// simple CL to let us know that server is running
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})