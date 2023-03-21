const express = require('express') // import express framework to our project
const app = express() // set a variable to hold our express framework
const MongoClient = require('mongodb').MongoClient // set a variable to import MongoDB
const PORT = 2121 // set a PORT for our localhost tests
require('dotenv').config() // import .env for hide our database string and credentials

let db, // declare a variable named db
  dbConnectionStr = process.env.DB_STRING, // declare and assign a variable to our database connection string
  dbName = 'todo' // declare and assign a variable to the database that we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  // Call the static `connect` method on the `MongoClient` class, passing the `dbConnectionStr` and an options object with the `useUnifiedTopology` property set to `true` to use the new Server Discover and Monitoring engine.
  .then(client => {
    // As no callback is provided, the `connect` method returns a Promise that will resolve to a `MongoClient` instance, so use the .then method to execute our callback with the said `MongoClient`.
    console.log(`Connected to ${dbName} Database`) // Console log the connection string, notifying the user that we are connected to the database.
    db = client.db(dbName) // Assign the desired `Db` instance - returned by the `db` method on the `MongoClient` instance - to the `db` variable.
  })

// Call the `set` method of our express application, setting the default engine extension, allowing us to omit said extension when specifying view names.
app.set('view engine', 'ejs')
// Add the `serve-static` middleware to our express application, serving any files requested from the root found in the `public` directory.
app.use(express.static('public'))
// Add the `body-parser` `urlencoded` middleware to our express application, parsing the content of any requests with a `Content-Type` of `application/x-www-form-urlencoded` to a JavaScript object assigned to the request `body` property - additionally setting the `extended` property to `true` within the options object to allow for nested objects via the `qs` module.
app.use(express.urlencoded({ extended: true }))
// Add the `body-parser` `json` middleware to our express application, parsing the content of any requests with a `Content-Type` of `application/json` to a JavaScript object assigned to the request `body` property.
app.use(express.json())

// Add a custom request handler to the `GET` method of the `/` path
app.get('/', async (request, response) => {
  // Access the `todos` collection from the connected database, calling `find` with no filter object to retrieve all the documents, and finally call `toArray` to turn this query into a Promise that will resolve with an array of documents(objects).
  const todoItems = await db.collection('todos').find().toArray()

  // Access the `todos` collection from the connected database, calling `countDocuments` with a filter to only include documents that have a `completed` property set to `false`.
  const itemsLeft = await db
    .collection('todos')
    .countDocuments({ completed: false })

  // Tell express to render the `index.ejs` view with the options of the `todoItems` and `itemsLeft` variables, which EJS will use as variables in the view.
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

// Add a custom request handler to the `POST` method of the `/addTodo` path
app.post('/addTodo', (request, response) => {
  // Access the `todos` collection from the connected database, calling `insertOne` with an object containing the properties `thing` and `completed` set to the values of the `request.body.todoItem` - parsed by the `urlencoded` middleware - and `false` respectively.
  db.collection('todos')
    .insertOne({ thing: request.body.todoItem, completed: false })

    // After the insertion is successful, redirect the user to the `/` path.
    .then(result => {
      console.log('Todo Added')
      response.redirect('/')
    })
    // If the insertion fails, log the error to the console.
    .catch(error => console.error(error))
})

// Add a custom request handler to the `POST` method of the `/markComplete` path
app.put('/markComplete', (request, response) => {
  // Access the `todos` collection from the connected database, calling `updateOne` with a filter object containing the property `thing` set to the value of the `request.body.itemFromJS` property - parsed by the `json` middleware
  db.collection('todos')
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        // UpdateFilter containing the `$set` Update Operator, telling MongoDB to setting the `completed` property to `true`.
        $set: {
          completed: true
        }
      },
      {
        // Attempt to sort the document _id's descending to get the latest document first - this works because the `_id` is a `ObjectId` and these contain the second they were created encoded within them.
        sort: { _id: -1 },

        // Disable the upsert - if the document does not exist, do not create it!
        upsert: false
      }
    )
    // logs it and respond as json if successful
    .then(result => {
      console.log('Marked Complete')
      response.json('Marked Complete')
    })
    // If the update fails, log the error to the console.
    .catch(error => console.error(error))
})

app.put('/markUnComplete', (request, response) => { // create a PUT request to the markUncomplete route

  // Access the `todos` database collection, with the updateOne method access the thing in our database that matches the request.body.itemFromJS
  db.collection('todos')
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        // Using $set update operator we are telling MongoDB to set completed to false
        $set: {
          completed: false
        }
      },
      {
        // Sort the results in ascending order, it works because all the Ids receive their seconds when created
        sort: { _id: -1 },

        // disable the upsert, which tells that if the document doesnt exist, don't create it!
        upsert: false
      }
    )

    // if successfull log completion and response as json
    .then(result => {
      console.log('Marked Complete')
      response.json('Marked Complete')
    })

    // if any error occur, log it to the console
    .catch(error => console.error(error))
})

// Add a custom request handler to the `DELETE` method of the `/deleteTodo` path
app.delete('/deleteItem', (request, response) => {
  // Access the `todos` collection from the connected database, calling `deleteOne` with a filter object containing the property `thing` set to the value of the `request.body.itemFromJS` property - parsed by the `json` middleware - to delete the first document that matches the filter.
  db.collection('todos')
    .deleteOne({ thing: request.body.itemFromJS })
    .then(result => {
      console.log('Todo Deleted')
      response.json('Todo Deleted')
    })
    .catch(error => console.error(error))
})

app.listen(process.env.PORT || PORT, () => { // tell our app to listen from the .env PORT or from the one that we set as a const and a callback print to let us know if succeeded
  console.log(`Server running on port ${PORT}`)
})
