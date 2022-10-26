const express = require('express') // Making it possible to use express in our server.js
const app = express() // Setting a constant and assigning express function to the variable 'app' - short-hand
const MongoClient = require('mongodb').MongoClient // Makes it possible to use methods associated with MongoClient and talk to our database
const PORT = 2121 // Setting a constant of 'PORT' to define the location where our server will be listening
require('dotenv').config() // Allows us to look for variables inside the .env file


let db, // Declare a variable called db globally
    dbConnectionStr = process.env.DB_STRING, // Declare a variable of 'dbConnectionStr' assigned to be our DB_String in our .env file
    dbName = 'todo' // Declaring a variable and assigning the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // Creating a connection to MongoDB and passing in the connection string. Also passing in an additional property of useUnifiedTopology
    .then(client => { // MongoClient.connect establishes a promise, so we chain a '.then' method and have the following events occur in sequence. This allows us to know if the connection was successful. Also passes in all the client information
        console.log(`Connected to ${dbName} Database`) // Log to the console a template literal 'connected to todo Database'
        db = client.db(dbName) // Assigning a value to a previously declared db variable that contains a db client factory method
    }) // Closing the .then

// Middleware - helps facilitate the communication
app.set('view engine', 'ejs') // Sets EJS as the deafult render
app.use(express.static('public')) // Sets the location for static assets
app.use(express.urlencoded({ extended: true })) // Instructs express to decode and encode URLs where the headers match the content - extended portion supports arrays and objects, etc
app.use(express.json()) // Parses JSON content from incoming requests


app.get('/',async (request, response)=>{ // Starts a GET method when the root route is passed in ('/'), sets up request and response parameters
    const todoItems = await db.collection('todos').find().toArray() // Sets a variable 'todoItems' that awaits MongoDB to return ALL the documents from the collection 'todos' and turns it into an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // Sets a variable 'itemsLeft' that awaits a count of uncompleted items that we later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // Passing an object that contains our todoItems and itemsLeft, which we later render our EJS file
    
    
    //CLASSIC PROMISE VERSION OF GET METHOD
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // Starts a POST method when the route of '/addTodo' is passed
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // Going to our database and find a collection called 'todos'. Insert one new document with the parsed body information from our form/input and give it a completed value of false by default
    .then(result => { // If insert is successful, trigger .then
        console.log('Todo Added') // Log to the console 'Todo added'
        response.redirect('/') // Redirects from /addToDo route back to the homepage (refresh root route ('/'))
    }) // Closing the .then
    .catch(error => console.error(error)) // Catching error and logging to console
}) // Ending the POST

app.put('/markComplete', (request, response) => { // Starts a PUT method when the route of '/markComplete' is passed
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Going into database and collection called 'todos'. Update one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: true // Updating aforementioned document to have a completed value of 'true'
          }
    },{
        sort: {_id: -1}, // Moves item to the bottom of the list
        upsert: false // If value we are looking for does not exist, we DO NOT insert that value
    })
    .then(result => { // Starts a then if update was successful
        console.log('Marked Complete') // Logging successful completion
        response.json('Marked Complete') // Sending a response back to the sender 
    }) // Closing the .then
    .catch(error => console.error(error)) // Catching error and logging to console
}) // Ending the PUT

app.put('/markUnComplete', (request, response) => { // Starts a PUT method when the route of '/markUnComplete' is passed
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Going into database and collection called 'todos'. Update one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false // Updating aforementioned document to have a completed value of 'true'
          }
    },{
        sort: {_id: -1}, // Moves item to the bottom of the list
        upsert: false // If value we are looking for does not exist, we DO NOT insert that value
    })
    .then(result => { // Starts a .then if update was successful
        console.log('Marked Complete') // Logging successful completion
        response.json('Marked Complete') // Sending a response back to the sender
    }) // Closing the .then
    .catch(error => console.error(error)) // Catching error and logging to console
}) // Ending the PUT

app.delete('/deleteItem', (request, response) => { // Starts a DELETE method when the route of '/deleteItem' is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // Going into database and collection called 'todos'. Delete one item matching the name of the item passed in from the main.js filed that was clicked on
    .then(result => { // Starts a .then if delete is successful
        console.log('Todo Deleted') // Logs to the console 'Todo Deleted'
        response.json('Todo Deleted') // Sending a response back to the sender
    }) // Closing the .then
    .catch(error => console.error(error)) // Catching error and logging to console
}) // Ending the DELETE

app.listen(process.env.PORT || PORT, ()=>{ // Setting up which port will be used to listen on - uses port from .env file or hard-coded PORT declared earlier
    console.log(`Server running on port ${PORT}`) // Logs to the console `Server running on port ${PORT}`
}) // Closes listen method