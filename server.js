// imports express middleware package
const express = require('express')
// set app variable to use express
const app = express()
// imports mongodb client package
const MongoClient = require('mongodb').MongoClient
// sets port variable where server will listen SAVAGE
const PORT = 2121
// imports and configures the dotenv package  and configures it. default is set to same directory and .env
// can be accessed via process.env.VARNAME 
require('dotenv').config()

// declares database connection variables
let db,
// declares and sets the connection string from the .env file
    dbConnectionStr = process.env.DB_STRING,
// sets dbName for designating collection
    dbName = 'todo'

// uses mongoclient to connect to the database string and sets connection parameters  
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
// catches the promise once it returns with the connection data
    .then(client => {
        // console logs once the database is connected and which one it is
        console.log(`Connected to ${dbName} Database`)
        // sets the db variable to the clients connected database and collection
        db = client.db(dbName)
    })
// sets the view engine to use ejs
app.set('view engine', 'ejs')
// allows access to files in the public folder without defining a route
app.use(express.static('public'))
// allows the server to parse data from url request and extended allows nested objects through use of the qs library
app.use(express.urlencoded({ extended: true }))
// tells server to parse incoming json payloads
app.use(express.json())

// the home route of the application. recieves any url requests to basic path, declares async function for use with await
app.get('/', async (request, response)=>{
    // waits for the database to access the todos collection and find all documents, then converts this result to an array
    const todoItems = await db.collection('todos').find().toArray()
    // waits for the database to access the todos count all documents that have the completed property set to false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // uses ejs view engine to render the index page and passes in the items and items left data for the ejs js to access. sends the rendered page as the response
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
// handles post requests to the addtodo path
app.post('/addTodo', (request, response) => {
    //accesses the database todo collection and inserts one new document 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // catches the promise once resolved
    .then(result => {
        // console logs to confirm added
        console.log('Todo Added')
        // sends a response for the client to redirect back to the default home page route
        response.redirect('/')
    })
    // catches any errors that may have occured during the promise resolution above
    .catch(error => console.error(error))
})
// handles put requests to the markcomplete path
app.put('/markComplete', (request, response) => {
    // accesses database todo collection and updates once finds a document that matches the item in the request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // sets a property in the document
        $set: {
            // the property to set and its value
            completed: true
          }
    },{
        // sorts by id number if more than one document is returned
        sort: {_id: -1},
        // tells the database not to create a new document if one is not found
        upsert: false
    })
    // catches promise after it resolves
    .then(result => {
        // console logs to advise that operation is complete on server side
        console.log('Marked Complete')
        // sends response json containin completioin confirmation
        response.json('Marked Complete')
    })
    // catches any errors that may have occured during the promise resolution above
    .catch(error => console.error(error))

})

// handles put requests to the markuncomplete route, essentially the opposite of the above route
app.put('/markUnComplete', (request, response) => {
    // accesses database todo collection and updates once finds a document that matches the item in the request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // sets a property in the document
        $set: {
            // the property to set and its value
            completed: false
          }
    },{
        // sorts by id number if more than one document is returned
        sort: {_id: -1},
        // tells the database not to create a new document if one is not found
        upsert: false
    })
    // catches promise after it resolves
    .then(result => {
        // console logs to advise that operation is complete on server side
        console.log('Marked Complete')
        // sends response json containin completioin confirmation
        response.json('Marked Complete')
    })
    // catches any errors that may have occured during the promise resolution above
    .catch(error => console.error(error))

})

// handles delete requests to the deletitem path
app.delete('/deleteItem', (request, response) => {
    // accesses the database and looks for an item matching the request item and once found deletes it from the collection
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // handles the above promise once it resolves
    .then(result => {
        // console logs that the item was deleted
        console.log('Todo Deleted')
        // sends the response with json saying the item was deleted
        response.json('Todo Deleted')
    })
    // catches any errors with the above promise resolution
    .catch(error => console.error(error))
})
// tells the server to listen to the environment port or the set port.
app.listen(process.env.PORT || PORT, ()=>{
    // console logs once the server is up and running
    console.log(`Server running on port ${PORT}`)
})