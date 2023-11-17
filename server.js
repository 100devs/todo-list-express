// Import 'express' module and assign it to 'express'
const express = require('express')
// Assign 'app' the new express framework API object
const app = express()
// Import 'mongodb' and assign the exported 'MongoClient' to 'MongoClient' locally
const MongoClient = require('mongodb').MongoClient
// Assign 'PORT' variable and give it a value of 2121
// express will listen on this port unless provided another in .env file (this happens towards the bottom of the script)
const PORT = 2121
// Import 'dotenv' module and run config(),
require('dotenv').config()
// Create variable for database, DB connection string, and name of DB
let db,
  // Pulling  DB_STRING from .env file with dotenv npm package
  dbConnectionStr = process.env.DB_STRING,
  dbName = 'todo'
// Call static 'connect' to atlas mongoDB with unified topology enabled and run statements within .then() when promise is fulfilled
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  client => {
    console.log(`Connected to ${dbName} Database`)
    //assign your db running on mongoDB to 'db'
    db = client.db(dbName)
  }
)
// use the .set() express method to load the ejs template engine within express
app.set('view engine', 'ejs')
// use the express.static built-in middleware function in Express to serve static files from the public folder.
// the express .use() method mounts or binds express.static to our instance of the express app object
app.use(express.static('public'))
// bodyparser is deprecated. That functionality is now baked into express
// Use express.urlencoded() middleware method to recognize and parse incoming request objects e.
app.use(express.urlencoded({ extended: true }))
// binding express.json() middleware method to recognize incoming request json objects in request bodies
app.use(express.json())
// listening for get requests being sent to
app.get('/', async (request, response) => {
  // Find all data from 'todo' collection on database and return as an array
  const todoItems = await db.collection('todos').find().toArray()
  // Count the number of documents that have completed set to false
  const itemsLeft = await db
    .collection('todos')
    .countDocuments({ completed: false })
  // Render our data into html with ejs and our index.ejs template
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
//Listening for a post on the '/addTodo'
app.post('/addTodo', (request, response) => {
  //Go to database and insert one new document(object) into the  'todos' collection
  db.collection('todos')
    //Insert the values from our input field with the name attribute of 'todoItem'
    .insertOne({ thing: request.body.todoItem, completed: false })
    //console log  after proper insertion of the document into the database
    .then(result => {
      console.log('Todo Added')
      // Indicate for the client to refresh their browser to retrieve the updated database collection in the current page
      response.redirect('/')
    })
    //If there is an error, log it
    .catch(error => console.error(error))
})
// Listen for a PUT request on '/markComplete route
app.put('/markComplete', (request, response) => {
  // Access the 'todos' collection Update document where 'thing' has the same value as the itemFromJS that the client clicked on
  // Set completed to true
  db.collection('todos')
    .updateOne(
      { thing: request.body.itemFromJS },
      { $set: { completed: true } },
      {
        //sort IDs in descending order to get the latest documents first
        //_id is the objectID
        sort: { _id: -1 },
        //Setting upsert to false so a new document will not be created if it does not already exist
        upsert: false,
      }
    )
    // Console log and send response to client that the update was completed
    .then(result => {
      console.log('Marked Complete')
      response.json('Marked Complete')
    })
    // If there is an error, console log it
    .catch(error => console.error(error))
})
// Listen for PUT request on '/markUnComplete' route
app.put('/markUnComplete', (request, response) => {
  // Access 'todos' collection and update document where 'thing' is set to request.body.itemFromJS (More plainly, the item the end-user clicked)
  // Set completed to false
  db.collection('todos')
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: false,
        },
      },
      {
        // Sort based on objectID in descending order
        sort: { _id: -1 },
        //Setting upsert to false so a new document will not be created if it does not already exist
        upsert: false,
      }
    )
    // log that the document update is complete and same the same response back to the client
    .then(result => {
      console.log('Marked Complete')
      response.json('Marked Complete')
    })
    // if there is an error, log it to console
    .catch(error => console.error(error))
})
// Listen for a DELETÉ request from '/deleteItem'
app.delete('/deleteItem', (request, response) => {
  //Delete one document from 'todos' collection where thing is set to request.body.itemFromJS(The item that the end-user clicked on the trash can next to)
  db.collection('todos')
    .deleteOne({ thing: request.body.itemFromJS })
    //log to console and send response to client indicating the deletion was successful
    .then(result => {
      console.log('Todo Deleted')
      response.json('Todo Deleted')
    })
    //If there is an error, log it to console
    .catch(error => console.error(error))
})
//start listening on either hard-coded PORT value, or the value stored in the .env value
app.listen(process.env.PORT || PORT, () => {
  //log to console when the server is running
  console.log(`Server running on port ${PORT}`)
})
