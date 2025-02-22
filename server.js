const express = require('express') // requiring express for it to be used in the file
const app = express() // setting a variable and assinging it the express call
const MongoClient = require('mongodb').MongoClient // setting it up to use the database and connect to it and talk to it using methods associated with MangoClient
const PORT = 2121 // setting a variable and where to host or location where to listen
require('dotenv').config() // allows us to look for variables inside of the .env file


let db, // declaring a variable called db
    dbConnectionStr = process.env.DB_STRING, // declaring a variable and assigning our database connection string to it
    dbName = 'todo' // declaring a variable and assigning the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // creating a connecting to our mongodb, and passing in our connection string. passing also an additional property
    .then(client => { //promise handler and passing all the client information
        console.log(`Connected to ${dbName} Database`) // logging to the console a template literal informing that you connected successfully to your database
        db = client.db(dbName) // assigning a value to previously declared 'db' variable that contains a db client factory method
    }) // closing our then handler

// Middleware
app.set('view engine', 'ejs') // sets as the default render method
app.use(express.static('public')) // sets the location for all static file on public folder
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLs where the header matches the content, the extended part supports arrays and objects
app.use(express.json()) // parses json content from incoming requests


app.get('/',async (request, response)=>{ // read request when root route is passed in, sets up req and res parameters 
    const todoItems = await db.collection('todos').find().toArray() // setting a variable and awaits the collections in the database in the variable as an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // setting a variable and awaits the total count of uncompleted items to later display on ejs
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // redndering our ejs file and passing through the db items and the count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // starts a create method when the /addTodo route is passed in from the action attribute of the form
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // selecting our todos collection for us to be able to insert one or add one document/object from the request.body.todoItem and gives it a completed value of false by default
    .then(result => { // if insert is successful, do something
        console.log('Todo Added') // log to the console the action
        response.redirect('/') // gets rid of the /addTodo route, and redirect/refresh to the root or homepage
    }) // closing the .then
    .catch(error => console.error(error)) // catching for possible errors
}) // ending the POST method

app.put('/markComplete', (request, response) => { // starts an UPDATE method when /markComplete route is passed in with a response and request parameters
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // looks in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: { 
            completed: true //set completed status to true
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false  // prevents insertion if the item does not already exist
    })
    .then(result => { // starts a then if update was successful
        console.log('Marked Complete') // logging to the console if successful completion
        response.json('Marked Complete') // sending a response back to the sender
    }) // closing .then
    .catch(error => console.error(error)) //catching errors

}) // ending put

app.put('/markUnComplete', (request, response) => {  //starts a PUT method when the markUncomplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // looks in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false //set completed status to false
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion if the item does not already exist
    })
    .then(result => { // starts a then if update was successful
        console.log('Marked Complete') // logging to the console if successful completion
        response.json('Marked Complete') // sending a response back to the sender
    }) // closing .then
    .catch(error => console.error(error)) //catching errors

}) // ending PUT

app.delete('/deleteItem', (request, response) => { // starts a DELETE method when delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // looks inside the todos collection for the ONE item that has a matching name from our JS file
    .then(result => { // if the delete was successful
        console.log('Todo Deleted') // logging successful completion
        response.json('Todo Deleted') // send a response back to the sender
    }) // closing .then
    .catch(error => console.error(error)) // catching errors

}) // closing delete method

app.listen(process.env.PORT || PORT, ()=>{ // setting up w/c PORT we will be listening on - either the port from the .env file or the port variable we set
    console.log(`Server running on port ${PORT}`) // console.log the running port
}) // close the listen method