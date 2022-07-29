const express = require('express') // making it possible to use express in this file
const app = express() // saving the particular instance of express as a variable called 'app'
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associated with MongoClient and talk to our database
const PORT = 2121 // setting a constant to set our port number to 2121 - location where our server will be listening for connections
require('dotenv').config() // allows us to look for variables inside of the .env file


let db, // declaring a variable 'db' without assigning any value
    dbConnectionStr = process.env.DB_STRING,  // declaring a variable and assigning our database connection string to it
    dbName = 'todo' // declaring a variable and assigning the name of the database we want to access

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // creating a connection to MongoDB and passing in our connection string. also passing in an additional property that does something
    .then(client => { // waiting for the connection and proceeding when/if successful, also passing in all the client info
        console.log(`Connected to ${dbName} Database`) // logging a message to the console that we have connected to the todo database
        db = client.db(dbName) // assigning a value to previously declared variable that contains lots of information about our database
    }) // closing our .then
   
// middleware - helps facilitate communication with our requests
app.set('view engine', 'ejs') // sets ejs as default render method - expect EJS
app.use(express.static('public')) // sets the location for static assets, for example our main css and main js files, images etc
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLs where the header matches the content. supports arrays and objects.
app.use(express.json()) // uses a built in json parser to parse json content from incoming requests


app.get('/',async (request, response)=>{ // express method (remember app = express()) to handle read method of CRUD. starts a GET method when the root route is passed, sets up req and res params
    const todoItems = await db.collection('todos').find().toArray() // sets a variable and awaits ALL items from the 'todos' collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets a variable and awaits the number/count of incomplete items that we will later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // rendering our EJS and passing in an object with the database items and the remaining count 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // starts a POST method when the addTodo route is passed in (CREATE in CRUD)
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item into todos collection, setting up a new object and assigning the 'thing' property to the text input from the form in our index.ejs file. settings the completed property to false
    .then(result => { // if insert is successful, do something
        console.log('Todo Added') // console log the action
        response.redirect('/') // send the browser back to the home/main page (instead of staying on /addTodo) and display the webpage
    }) // close .then
    .catch(error => console.error(error)) // catch errors and console log them
}) // ending the POST

app.put('/markComplete', (request, response) => { // starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the database for 1 item matching the name of the item passed in from main.js that was clicked on
        $set: { 
            completed: true // set completed status to true
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => { // starting a then if update was successful
        console.log('Marked Complete') // logging successful completion
        response.json('Marked Complete') // sending a response to complete the cycle/let our js know the attempt was successful
    }) // close .then
    .catch(error => console.error(error)) // catch errors

}) // end PUT

app.put('/markUnComplete', (request, response) => { // starts a PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the database for 1 item matching the name of the item passed in from main.js
        $set: {
            completed: false // set completed status to false
          }
    },{
        sort: {_id: -1}, // moves item to bottom of list
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => { // starting a then if update was successful
        console.log('Marked Complete') // logging successful completion (also probably a typo)
        response.json('Marked Complete') // sending a response to complete the cycle/let our js know the attempt was successful (also a typo)
    }) // end .then
    .catch(error => console.error(error)) // catch errors

}) // end PUT

app.delete('/deleteItem', (request, response) => { // starts a DELETE method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // look inside the todos collection for the ONE item that has a matching name from our JS file
    .then(result => { // starts a then if the delete was successful
        console.log('Todo Deleted') // console log results
        response.json('Todo Deleted') // send info back to sender
    }) // closing .then
    .catch(error => console.error(error)) // catch errors

}) // end DELETE

app.listen(process.env.PORT || PORT, ()=>{ // setting up which port we will be listening on - either from .env (if one exists there) or from the PORT variable
    console.log(`Server running on port ${PORT}`) // console log the running port, wouldn't actually work as written
}) // done