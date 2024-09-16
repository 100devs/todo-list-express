const express = require('express') // making it possible to use express
const app = express() // setting a constant and assigning it an unstamce of express
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associated with mongoclient and talk to the DB
const PORT = 2121 // assign a constant to set the port where the server will be listening
require('dotenv').config() // looks for variables inside of the .env file


let db, // declare a global variable called db but not assign a value
    dbConnectionStr = process.env.DB_STRING,  // declaring a variable and assign our DB connection string to it
    dbName = 'todo'  // declaring a variable and assigning the name of the DB we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // creating a connection to MongoDB and passing in our connection string
// and passing in an additional property
    .then(client => { // waiting for the connection and proceeding if successful and passing in all the client information
        console.log(`Connected to ${dbName} Database`) // console log the result if the connection is successful
        db = client.db(dbName) // assigning a value to previously declared db variable that contains a db client factory method
    }) // closing .then block

// middleware (allows us to communicate to the db during the request)
app.set('view engine', 'ejs') // sets EJS as the default render
app.use(express.static('public')) // sets the location for static assets
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLS where the header matches the content. Supports arrays and objects
app.use(express.json()) // parses JSON content from incoming requests


app.get('/',async (request, response)=>{ // starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() // sets a variable and awaits all items from the todos collection from the DB
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // rendering the EJS file and passing through the db items and the count remaining
    // inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    .catch(error => console.error(error)) // console log any error messages that may occur
})

app.post('/addTodo', (request, response) => { // starts a post method for the form with the 'addTodo' route
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts a new item into the todos collection, gives it 
    // a completed value of false by default
    .then(result => { // if insert is successful, do something
        console.log('Todo Added') // console log action
        response.redirect('/') // refresh/redirect to the '/' route or default homepage
    }) // closing the .then
    .catch(error => console.error(error)) // catch any errors
}) // ending the post

app.put('/markComplete', (request, response) => { // starts a PUT/update method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look into the DB for one item matching the name of the item
        // passed in from the main.js file that was clicked on
        $set: { 
            completed: true // set completed status to true
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => { // starts a .then if update is successful
        console.log('Marked Complete') // logging successful completion
        response.json('Marked Complete') // sending a response back to the sender
    }) // closing .then
    .catch(error => console.error(error)) // catch any errors
}) // ending put

app.put('/markUnComplete', (request, response) => { // starts a PUT/update method when the markUncomplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look into the DB for one item matching the name of the item
        // passed in from the main.js file that was clicked on
        $set: { 
            completed: false // set completed status to false
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => { // starts a .then if update is successful
        console.log('Marked Complete') // logging successful completion
        response.json('Marked Complete') // sending a response back to the sender
    })
    .catch(error => console.error(error)) // catch any errors
}) // ending put

app.delete('/deleteItem', (request, response) => { // starts a DELETE method when the deleteItem route is passed in
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // look into the DB for one item matching the name of the item
    // passed in from the main.js file that was clicked on
    .then(result => { // starts a .then if delete was successful
        console.log('Todo Deleted') // logging successful completion
        response.json('Todo Deleted') // sending a response back to the sender
    }) // closing .then
    .catch(error => console.error(error)) // catch any errors
}) // ending delete

app.listen(process.env.PORT || PORT, ()=>{ // setting up which port the app will be listening on - either the port from the .env
    // file or the port constant
    console.log(`Server running on port ${PORT}`) // log the running port if successful
}) // end the listen method