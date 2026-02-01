// load and include express module using the "require" function, making it possible to use express in this file
const express = require('express')
// setting a constant and assigning it to the instance of express
const app = express()
// load and include the mongo client module, making it possible to use methods associated with MongoClient and get data from the DB
const MongoClient = require('mongodb').MongoClient

// declare an environment constant, in this instance port 2121, to determine the location where the server will be listening
const PORT = 2121

// load the .env package to access variables inside the .env file, which stores sensitive data
require('dotenv').config()

let db, // declare a variable db globally (to use in multiple places) but do not assign a value
    dbConnectionStr = process.env.DB_STRING, // declare and assign the database connection string, hidden in the .env file to a variable
    dbName = 'todo' // declaring a variable and setting the name for the database

// connect the server to the mongodb database, passing in the above variable holding the connection string
// also passing in additional property, to opt in to using the new server discovery and monitoring engine
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })

    .then(client => { // waiting for the connection and proceeding if successful and passing in all the client info
        console.log(`Connected to ${dbName} Database`) // log the string that confirms the database name and the connection status
        db = client.db(dbName) // assigning a value to previously declared variable that contains a db client factory method
    }) // closing the .then
    
// middleware to set the render method to "ejs"
app.set('view engine', 'ejs')

// use the built in middleware function "use" to serve static files in express app
app.use(express.static('public'))

// use the middleware function to parse URL-encoded data where the header matches the content. Supports arrays and objects
app.use(express.urlencoded({ extended: true }))

// use middleware function for the app to read JSON data sent from client (like POST or PUT requests) and to make it available in the req.body
app.use(express.json())


app.get('/', async (request, response)=>{ // starts a READ method when the root route is passed in, sets request and response parameters 
    const todoItems = await db.collection('todos').find().toArray() // sets a constant and awaits all items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets a constant and awaits a count of unfinished tasks to display in ejs
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // rendering the ejs file and passing through the db items and the count remaining inside of the object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // starts a POST method to create something when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts a new item into a todo collection and sets the completed value to be false by default
    .then(result => { // if insert is successful, do:
        console.log('Todo Added') // console.log action
        response.redirect('/') // redirect from addTodo to the root route
    }) // closes the then
    .catch(error => console.error(error)) // catcching errors and logging them
}) // ends the POST 

app.put('/markComplete', (request, response) => { // starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the database for one item matching the name passed in from the main.js file that was clicked on 
        $set: { // updating the value completed to true
            completed: true
          }
    },{
        sort: {_id: -1}, // moves the item to the bottom of the list
        upsert: false // prevents insertion if item does not already exist 
    })
    .then(result => { // starts a then if update was successful 
        console.log('Marked Complete') // logs a message of "marked complete"
        response.json('Marked Complete') // sending a response back to the sender
    }) // closing .then
    .catch(error => console.error(error)) // catching errors

}) // ends PUT

app.put('/markUnComplete', (request, response) => { // // starts a PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, { // look in the database for one item matching the name passed in from the main.js file that was clicked on 
        $set: { // updating the value completed to false
            completed: false
          }
    },{
        sort: { _id: -1 }, // moves the item to the bottom of the list
        upsert: false // prevents insertion if item does not already exist 
    })
        .then(result => { // starts a then if update was successful 
            console.log('Marked Complete') // logs a message of "marked complete", should be "not complete"
            response.json('Marked Complete') // sending a response back to the sender (again should be not complete)
    }) // closing the .then
    .catch(error => console.error(error)) // catching any errors
}) // closing the PUT

app.delete('/deleteItem', (request, response) => { // starts the DELETE method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // look inside the todos collection for one item that has a matching name from the JS file
    .then(result => { // if the delete was successful:
        console.log('Todo Deleted') // log the message
        response.json('Todo Deleted') // send a response to the sender 
    }) // closing the .then
    .catch(error => console.error(error)) // catching any errors

}) // closing the DELETE

app.listen(process.env.PORT || PORT, () => { // setting up which port the server will listen to - either the port from the .env file or from the constant above
    console.log(`Server running on port ${PORT}`) // console log the running port
}) // closing the listen method