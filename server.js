
// APP DEPENDENCIES:
// Assigns the imported 'express' module to the costant variable 'express'
const express = require('express')
//Assigns the newly created express application to the constant variable 'app
const app = express()
// Assigns the MongoClient class that's attached to the 'connect' method
// exported by the 'mongodb' mongodb').MongoClient
// Assigns the default port number '2121 (Savage?!)' to the constant variable PORT 
const PORT = 2121
// calls the 'config' method on the imported 'dotenv' module,
// loading the environment variables form the '.env' file into 'process.env'
require('dotenv').config()

// declares 3 mutable variables, 'db' to stre the database class instance,
// 'dbConnectionStr' to start the connection string read from the DB_STRING environment variable,
// and 'dbName' to store the name of the database we want to use
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// Calls the static 'connect' method on the 'MongoClient' class, passing 'dbConnectionStr' 
// and an options obj with the 'useUnifiedTopology' property set to true to use the new 
// Server Discover and Monitoring engine. 
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
// Since no clalback is provided, the connect method returns a Promise that will resolve to
// a 'MongoClient' instance, so it uses the .then method to execute the callback with said 'MongoClient'
    .then(client => {
        // logs the connection str to the console, notifying the user that we are connected to the db
        console.log(`Connected to ${dbName} Database`)
        // assigns the desired db instance (what's returned by the db method on the MongoClient tinsnace)
        // to the db variable
        db = client.db(dbName)
    })
    
//APP CONFIGURATION
// Calls the `set` method of our express app, sets the default engine extension, 
// and allows us to omit said extension when specifying view names.
app.set('view engine', 'ejs')
// Adds the `serve-static` middleware to our express app, serving any files requested 
// from the root found in the `public` directory.
app.use(express.static('public'))
// Adds the `body-parser` `urlencoded` middleware to our express application, 
// which parses the content of any requests with a `Content-Type` of `application/x-www-form-urlencoded` 
// to a JS obj assigned to the `body` property - also setting the `extended` property to `true` 
// within the options object to allow for nested objects via the `qs` module.
app.use(express.urlencoded({ extended: true }))
// Adds the `body-parser` `json` middleware to our express application, 
// parsing the content of any requests with a `Content-Type` of `application/json` 
// to a JS obj assigned to the request `body` property.
app.use(express.json())

// GET CONFIGURATION
// Adds a custom request handler to the `GET` method of the `/` path
app.get('/',async (request, response)=>{
    // Access the `todos` collection from the connected database, calling `find` 
    // with no filter object to retrieve all the documents, and finally calls 
    // `toArray` to turn this query into a Promise that will resolve with an array of document objects.
    const todoItems = await db.collection('todos').find().toArray()
    // Access the `todos` collection from the connected database, calling `countDocuments` 
    // with a filter to only include documents that have a `completed` property set to `false`.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Tells express to render the `index.ejs` view with the options of the `todoItems` 
    // and `itemsLeft` variables, which EJS will use as variables in the view.
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

// POST CONFIGURATION
// Adds a custom request handler to the `POST` method of the `/addTodo` path
app.post('/addTodo', (request, response) => {
    // Access the `todos` collection from the connected database, calling `insertOne` 
    // with an object containing the properties `thing` and `completed` set to the values 
    // of the `request.body.todoItem` - parsed by the `urlencoded` middleware - and `false` respectively.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // After the insertion is successful, redirect the user to the `/` path.
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    // Log erro to console if the insertion fails
    .catch(error => console.error(error))
})

 // PUT CONFIGURATION
 //markComplete
 // Adds a custom request handler to the `POST` method of the `/markComplete` path
app.put('/markComplete', (request, response) => {
    // Access the `todos` collection from the connected database, calling `updateOne` 
    // with a filter object containing the property `thing` set to the value of the `request.body.itemFromJS` 
    // property - parsed by the `json` middleware
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // UpdateFilter containing the `$set` Update Operator, telling MongoDB to setting the 
        // `completed` property to `true`.
        $set: {
            completed: true
          }
    },{
        // Attempts to sort the document _id's descending to get the latest document first - 
        // this works because the `_id` is a `ObjectId` and these contain the second they were created encoded within them.
        sort: {_id: -1},
        // Disables the upsert - if the document does not exist, do not create it
        upsert: false
    })
    // After the update is successful, redirect the user to the `/` path.
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    // Logs error if the update fails
    .catch(error => console.error(error))

})

//markUnComplete
// Add a custom request handler to the `PUT` method of the `/markUnComplete` path
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // UpdateFilter containing the `$set` Update Operator, telling MongoDB to setting the `completed` property to `false`.
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

// DELETE CONFIGURATION
// Adds a custom request handler to the `DELETE` method of the `/deleteTodo` path
app.delete('/deleteItem', (request, response) => {
    // Access the `todos` collection from the connected database, calling `deleteOne` 
    // with a filter object containing the property `thing` set to the value of the `request.body.itemFromJS` property 
    // parsed by the `json` middleware - and deletes the first document that matches the filter.
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // if successful, log and send response
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    // if it fails, log the error
    .catch(error => console.error(error))

})


// Start the server listening on either the PORT provided via environment variable 
// or the default port stored in the PORT variable.
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})