const express = require('express') // making express available to use in the file, requiring it
const app = express() // importing express as a function 
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associated with mongodb and talk with the database
const PORT = 2121 // setting the port number for server for a local host 
require('dotenv').config() // allows us to access environment variables inside the env file


let db, // declare a variable called db but don't assign a value
    dbConnectionStr = process.env.DB_STRING, // declare a variable and assigning our database connection string to it, process env lets it access it in the .env file
    dbName = 'todo' // declaring a variable to set the name of the database we want to access

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // creating a connection to mongodb, passing in our connection string, also passing in an additional property
    .then(client => { // start a then method, waiting for the connection and proceeding if successful, and passing in the client information
        console.log(`Connected to ${dbName} Database`) // logging to the console a confirmation that you're connected to the database through a template literal
        db = client.db(dbName) //assigning a value to previously declared variable to contain a db client factory method - information from the database in an object
    }) // closing then method
 //Middleware - helps facillitate communication channels
app.set('view engine', 'ejs') // setting our ejs to our default for rendering, this is our render method
app.use(express.static('public')) // sets the location for static asset files, serves them up as external files
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLs where the header matches the content. Supports arrays and objects.
app.use(express.json()) // helps us parse JSON, replaces body parser. parses JSON from incoming requests.


app.get('/',async (request, response)=>{ // starts a GET / READ method when the root is passed in, sets up request and response parameters
    const todoItems = await db.collection('todos').find().toArray() // variable that awaits all items in the todos collection in the database and stores them as an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // variable that awaits the count of items that aren't completed in the database
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // rendering the ejs file and passing through the database items and the count of uncompleted items remaining, inside of an object 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // start a POST / Create method when the addTodo route is passed in, sets up request and response parameters
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts a new item into the todos collection, gives it a completed value of false by default
    .then(result => { // if insert is successful do something
        console.log('Todo Added') // log Todo Added to the console
        response.redirect('/') // gets rid of the addTodo route and redirects to the homepage
    }) // closes then method
    .catch(error => console.error(error)) // catching errors 
}) // ending the post method

app.put('/markComplete', (request, response) => { // start a PUT / Update method when the markComplete route is passed in, sets up request and response parameters
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the database for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: true // update completed value to true
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion if item doesn't already exist
    })
    .then(result => { // starts a then method if update was successful
        console.log('Marked Complete') // log marked complete to the console
        response.json('Marked Complete') // sending a response back to the sender
    }) // closing then method
    .catch(error => console.error(error)) // catching errors

}) // closing put method

app.put('/markUnComplete', (request, response) => { // starting a PUT / Update method when the markUnComplete route is passed in, sets up request and response parameters
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the database for one item matching the name of the item that was clicked on in main.js
        $set: {
            completed: false // update completed value to false
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion if item doesn't already exist
    })
    .then(result => { // starts a then method if update was successful
        console.log('Marked Complete') // log marked complete to the console
        response.json('Marked Complete') // sending a response back to the sender
    }) // closing then methods
    .catch(error => console.error(error)) // catching errors

}) // closing put method

app.delete('/deleteItem', (request, response) => { // starting a DELETE method when the deleteItem route is passed, sets up request and response parameters
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // look in the todos collection for the item with a matching name to the item clicked on in the main.js file 
    .then(result => { // start a then method if delete was successful
        console.log('Todo Deleted') // log todo deleted to the console
        response.json('Todo Deleted') // sending a response back to the sender
    }) // closing then method
    .catch(error => console.error(error)) // catching errors

}) // closing delete method

app.listen(process.env.PORT || PORT, ()=>{ // setting up which port we'll be listening on, either gets one from env file, or take it from the port variable
    console.log(`Server running on port ${PORT}`) // console log the running port
}) // close listen method