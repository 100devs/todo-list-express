const express = require('express') // Making it possible to use express in this file
const app = express() // Assigning app to express so that we can use its methods and don't have to be typing 'express' all the time
const MongoClient = require('mongodb').MongoClient // Makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 // Setting a constant to our PORT, which allows us to run our app on our local machine
require('dotenv').config() // Allows us to look for variables inside of the .env file


let db, // Declares a variables called db but not assign a value (global)
    dbConnectionStr = process.env.DB_STRING, // Declaring a variable and assignin our database connection string to it
    dbName = 'todo' // Declaring a variable and assigning the name of the database we will be using  

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // Creating a connection to MongoDB and passing in our connection string while also passing in an additional property
    .then(client => { // Waiting for the connection and proceeding if successful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`) // Log a template literal to the console "connected to todo Database"
        db = client.db(dbName) // Assigning a value to a previously declared variable that contains a DB client factory method
    }) // Closing .then
// Middleware - helps facilitate our communication 
app.set('view engine', 'ejs') // Sets ejs as the default render method 
app.use(express.static('public')) // Sets the location for static assets 
app.use(express.urlencoded({ extended: true })) // Tells express to decode and encode URLs where the header matches the context. The extended part helps to support arrays and objects
app.use(express.json()) // Enables us to Parse JSON content from incoming requests. Built into express

// Express Methods CRUD: 
app.get('/',async (request, response)=>{ // GET or READ when the root route is passed in, sets up request and respond parameters
    const todoItems = await db.collection('todos').find().toArray() // Sets a variable and awaits ALL items from the todo collection and turning them into an array 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // Sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // Responding with Rendered EJS file and passing through the DB items and the count remaining inside of an object 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // POST or CREATE when the /addTodo route is passed in 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // Inserts a new item into todos collection
    .then(result => { // If insert is successful, do something 
        console.log('Todo Added') // Log action that occured
        response.redirect('/') // Refreshes page with updated info 
    }) // Closes .then 
    .catch(error => console.error(error)) // Catches any errors, if any and logs them
}) // Ends method POST or CREATE

app.put('/markComplete', (request, response) => { // PUT or UPDATE when the /markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Looks in the db for one item matching the =name of the item passe in from the main.js file that was clicked on
        $set: { 
            completed: true // Sets completed status to true
          }
    },{
        sort: {_id: -1}, // Sorts in descending order (latest first)
        upsert: false // Prevents inserttion if item does not already exist 
    })
    .then(result => { // Starts a .then if update was successful
        console.log('Marked Complete') // Logging successful completion 
        response.json('Marked Complete') // Sends response back to the sender 
    }) // Closes .then 
    .catch(error => console.error(error)) // Catches any errors, if any 

}) // Ending PUT method or UPDATE method 

app.put('/markUnComplete', (request, response) => { // PUT or UPDATE when the /markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Looks in the db for one item matching the =name of the item passe in from the main.js file that was clicked on
        $set: {
            completed: false // Sets completed status to false
          }
    },{
        sort: {_id: -1}, // Sorts in descending order (latest first)
        upsert: false // // Prevents inserttion if item does not already exist 
    })
    .then(result => { // Starts a .then if update was successful
        console.log('Marked Complete') // Logging successful completion
        response.json('Marked Complete') // Sends response back to the sender
    }) // Closes .then
    .catch(error => console.error(error)) // Catches any errors, if any 

}) // Ending PUT method or UPDATE method 

app.delete('/deleteItem', (request, response) => { // DELETE when the /deleteItem route is passed 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // Looks inside the todos collection for ONE item that has a matching name from our JS file
    .then(result => { //  Starts a .then if the delete was successful
        console.log('Todo Deleted') // Logging successful completion
        response.json('Todo Deleted') // Sends response back to the sender
    }) // Closes .then
    .catch(error => console.error(error)) // Catches any errors, if any

}) // Ending DELETE method 

app.listen(process.env.PORT || PORT, ()=>{  // Setting up which PORT we will be listening on - either the port from the .env file or from the variable value
    console.log(`Server running on port ${PORT}`) // Logs the running port
}) // Ending LISTEN method 
