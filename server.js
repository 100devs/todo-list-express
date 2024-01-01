// requiring express module for server.js
const express = require('express')
// creating app variable for instance of express --> simple use of express
const app = express()
// allowing communication with DB; allows use of methods provided/associated with MongoClient
const MongoClient = require('mongodb').MongoClient
// init a constant PORT variable, defining where server will listen
const PORT = 2121
// gives ability to look for vars inside of the .env file
require('dotenv').config()

// init global database variable w/o value  
let db,
// declaring dbConnectionStr var & assigning database connection string 
    dbConnectionStr = process.env.DB_STRING,
// declaring dbName var & assigning it the name of the DB in use
    dbName = 'todo'

// creating connection to MongoDB & passing in an additional property
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // waiting for value from above promise --> if success, passing in client info
    .then(client => {
        // if no error & successfully connected to db, logging to the console "Connected to todo Database"
        console.log(`Connected to ${dbName} Database`)
        // assigning value to db var, containing db client factory method
        db = client.db(dbName)
// closing .then()
    })
    
// MIDDLEWARE CODE
// expect ejs as default render
app.set('view engine', 'ejs')
// setting location for static assets --> html, css, imgs, etc
app.use(express.static('public'))
// tells express to decode and encode URLs wheere the header matches the content --> supports arrays & objects
app.use(express.urlencoded({ extended: true }))
// parsing JSON contents
app.use(express.json())


// API CODE --> How users will interact with DB/Server

// Creating Read (GET) Request
// When root route is passed in, sets up req & res as params
app.get('/',async (request, response)=>{
    // init constant todoItems var & awaits/assigns it a value of an array containing all items from the todos collection
    const todoItems = await db.collection('todos').find().toArray()
    // init constant itemsLeft var & awaits/assigns it value of a count of tasks not yet completed. will be displayed in EJS
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // as a response, render EJS passing in value of an obj containing todoItems & itemsLeft
    response.render('index.ejs', { items: todoItems, left: itemsLeft })

    // alternate syntax not using async function
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// Creating Create (POST) Request
// implementing functionality for users to create todos --> establishes req & res as params
app.post('/addTodo', (request, response) => {
    // goes to database collection & inserts new todo task with completed value of false by default
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // if success, logging to the console todo added
    .then(result => {
        // logging Todo Added if success
        console.log('Todo Added')
        // refreshing user page/redirecting user to root route --> (GET) Request
        response.redirect('/')
    // closing .then
    })
    // if err, console.log(err)
    .catch(error => console.error(error))
})

// Creating Update (PUT) Request
// implements functionality for user mark todo items complete & estab req & res as params
app.put('/markComplete', (request, response) => {
    // goes to database collection 'todos', uses info from user req to find one item that matches from the main.js file that was clicked on
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // setting completed value --> true
        $set: {
            completed: true
          }
    },{
        // moves item to the bottom of the list
        sort: {_id: -1},
        // prevents insertion if item does not already exist
        upsert: false
    })
    // if update success, then
    .then(result => {
        // log to the console Marked Complete
        console.log('Marked Complete')
        // sending res back to the sender
        response.json('Marked Complete')
    // closing .then
    })
    // if err, log err to console
    .catch(error => console.error(error))
// closing PUT request
})

// Creating Update (PUT) Request when markUnComplete route is passed in
// implements functionality of marking an item incomplete
app.put('/markUnComplete', (request, response) => {
    // goes to database, finds one item matching the name of the item passed in from the main.js file that was clicked on
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // sets completed value --> false
        $set: {
            completed: false
          }
    },{
        // moves item to the bottom of list
        sort: {_id: -1},
        // prevents insertion if item does not already exist
        upsert: false
    })
    // if success, then
    .then(result => {
        // log to console, Marked Complete
        console.log('Marked Complete')
        // response to sender of Marked Complete
        response.json('Marked Complete')
    })
    // if err, log to console err
    .catch(error => console.error(error))
// closing PUT request
})

// Creating a DELETE Request/ delete method when the delete route is passed in
// implements functionality for deleting items
app.delete('/deleteItem', (request, response) => {
    // looks inside the todos collection for the ONE item that has a matching name from our JS
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // if success, then
    .then(result => {
        // log to console Todo Deleted
        console.log('Todo Deleted')
        // sending res back to the sender
        response.json('Todo Deleted')
    // closing .then
    })
    // if err, log to console err
    .catch(error => console.error(error))
// closing delete request
})

// establishig what port the server will be listening on --> port from .env file or the port var initialized above
app.listen(process.env.PORT || PORT, ()=>{
    // logging to the console that server is running
    console.log(`Server running on port ${PORT}`)
// ending listen method
})