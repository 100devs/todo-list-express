const express = require('express') // making it possible to use express in this file
const app = express() // setting a constant and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient // makes it possible to use the methods associated with MongoClient and talk to our database
const PORT = 2121 // setting a constant to define the location where our server will be listening
require('dotenv').config() // allows us to look for variables inside of the .env file


let db, // declare a variable called db with no value
    dbConnectionStr = process.env.DB_STRING, // declare a variable and assign our database connection string to it
    dbName = 'todo' // declare a variable and assigning the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // creating a connection to MongoDB, passing in our connection string, and passing in an additional property
    .then(client => { // waiting for the connection and proceeding if successful, then passing in all the client information
        console.log(`Connected to ${dbName} Database`) // log to the console a template literal "Connected to todo Database"
        db = client.db(dbName) // assigning a value to previously declared db variable that contains a db client factory method
    }) // closes our .then
    
// middleware
app.set('view engine', 'ejs') // sets EJS as the default render method
app.use(express.static('public')) // sets the location for static assets
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json()) // parses JSON content from incoming requests


app.get('/',async (request, response)=>{ // sets up a GET method when the root route is passed in, and sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() // sets a variable and awaits ALL items from the todos collection, then converts to an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // rendering the EJS file, then passing through the db items and the count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    .catch(error => console.error(error))
}) // close GET method

app.post('/addTodo', (request, response) => { // starts a POST method when the addTodo route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts a new item into todos collection, and gives it a completed value of false by default
    .then(result => { // if insert is successful, do something
        console.log('Todo Added') // consoel log action
        response.redirect('/') // redirects back to the homepage
    }) // closing the .then
    .catch(error => console.error(error)) // catches errors
}) // ending the POST

app.put('/markComplete', (request, response) => { // starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: { 
            completed: true // set completed status to true
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion if the item does not already exist
    })
    .then(result => { // starts a then if update was successful
        console.log('Marked Complete') // logging successful completion
        response.json('Marked Complete') // sending a response back to the sender
    }) // closing .then
    .catch(error => console.error(error)) // catching errors

}) // ending PUT

app.put('/markUnComplete', (request, response) => { // starts a PUT method when the markUncomplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false // set completed status to false
          }
    },{
        sort: {_id: -1},// moves item to the bottom of the list
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => { // starts a then if update was successful
        console.log('Marked Complete') // logging successful completion
        response.json('Marked Complete') // sending a response back to the sender
    }) // closing .then
    .catch(error => console.error(error)) // catching errors

}) // closing PUT

app.delete('/deleteItem', (request, response) => { // starts a DELETE method when the deleteItem route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // look inside the db collection for the ONE item with a matching name from our main.JS file
    .then(result => { // starts a then if delete was successful
        console.log('Todo Deleted') // console log successful completion
        response.json('Todo Deleted') // send a response back to the sender
    }) // close .then
    .catch(error => console.error(error)) // catching erros

}) // closing DELETE method

app.listen(process.env.PORT || PORT, ()=>{ // setting up which port we will be listening on - either the port from the .env file or the PORT variable we set 
    console.log(`Server running on port ${PORT}`) // console log the running port
}) // end the LISTEN method