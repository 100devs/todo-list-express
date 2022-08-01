const express = require('express') // makes it possible to use express in this file
const app = express() // saves the instance of express to a constant called app
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associated with MongoClient to talk to the database (MongoDB) in a way it understands
const PORT = 2121 // sets a constant to where the server will be listening
require('dotenv').config() // lets us access the contents of the .env file


let db, // declares a variable called db
    dbConnectionStr = process.env.DB_STRING, // declares a variable that is assigned to the connection string, inside of the .env file, to connect to the MongoDB database
    dbName = 'todo' // declares a variable that sets the name of the database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // creates a connection to MongoDB and passes in the connection string; also passes in an additional property
    .then(client => { // waits for the connection (MongoClient.connect returns a promise), and proceeds if successful; also passes in the client information
        console.log(`Connected to ${dbName} Database`) // console logs a template literal that says we're connect to todo database
        db = client.db(dbName) // assigns the db variable (that we previously declared) to a value that contains a db client factory method
    }) // closes the .then
 
// Middleware
app.set('view engine', 'ejs') // sets ejs as the default rendering method
app.use(express.static('public')) // sets the location for static assets
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode urls where the header matches the content; this supports larger content like arrays and objects with extended: true
app.use(express.json()) // parses JSON content from incoming requests; replaces body parser


app.get('/',async (request, response)=>{ // starts a GET method when the root route is passed in, sets up async function with req and res parameters
    const todoItems = await db.collection('todos').find().toArray() // sets a constant and awaits ALL items from the 'todos' collection and puts them into an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets a constant and awaits the NUMBER OF items from the 'todos' collection that are flagged as not completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // renders the ejs file and passes through the db items and the count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    .catch(error => console.error(error)) // catches if there are any errors and logs them
}) // closes GET method

app.post('/addTodo', (request, response) => { // starts a POST method when the add route is passed in 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts a new item into todos collection and gives it a completed value of false by default
    .then(result => { // if insert is successful, then do something
        console.log('Todo Added') // console log what what happened
        response.redirect('/') // gets rid of the /addTodo route and redirects back to the homepage
    }) // closes then statement
    .catch(error => console.error(error)) // catches if any errors
}) // closes POST method

app.put('/markComplete', (request, response) => { // starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // looks in the database for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: { 
            completed: true // sets the item's completed status to true
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => { // starts a then if update was successful
        console.log('Marked Complete') // logging successful completion
        response.json('Marked Complete') // sends a response back to the sender
    }) // closes .then
    .catch(error => console.error(error)) // catches if any errors

}) // ends PUT method

app.put('/markUnComplete', (request, response) => { // starts a PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // looks in the database for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false // sets the item's completed status to false
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => {  // starts a then if update was successful
        console.log('Marked Complete') // logging successful completion
        response.json('Marked Complete') // sends a response back to the sender
    }) // closes .then
    .catch(error => console.error(error)) // catches if any errors

}) // ends PUT method

app.delete('/deleteItem', (request, response) => { // starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // looks inside the todos collection for the ONE item that has a matching name from our JS file
    .then(result => { // starts a .then if the delete was successful
        console.log('Todo Deleted') // console logs the result
        response.json('Todo Deleted') // sends a response back to the sender
    }) // closes the .then
    .catch(error => console.error(error)) // catches if any errors

}) // ends delete method

app.listen(process.env.PORT || PORT, ()=>{ // sets up which port we will be listening on; either the port from the .env file if it exists, or from the value assigned to the PORT variable
    console.log(`Server running on port ${PORT}`) // console logs the running port
}) // closes the listen method