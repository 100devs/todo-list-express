const express = require('express') // making it possible to use express in this file
const app = express() // setting a constant and assigning it to the instance of express 
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 // setting a constant to define the location where our server will be listening
require('dotenv').config() // allows us to look for variables inside of the .env file


let db, // declare a global variable called db but not assign a value
    dbConnectionStr = process.env.DB_STRING, // declaring a variable and assigning our database connection string to it
    dbName = 'todo' // declaring a variable and assigning the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // creating a connection to MongoDB, and passing in our
// connection string. also passing in an additional property
    .then(client => { // waiting for the connection and proceeding if successful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`) // logging to the console if we have connected to the todo database
        db = client.db(dbName) // assigning a value to previously db variable that contains a db client factory method
    }) // closing our .then

// middleware
app.set('view engine', 'ejs') // sets as the default render method
app.use(express.static('public')) // sets the location for static assets 
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLS where the header matches the content. Supports
// arrays and objects
app.use(express.json()) // Parses JSON content from incoming requests


app.get('/',async (request, response)=>{ // starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() // declaring a variable and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets a variable and awaits a count of uncompleted 
    // items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // rendering the EJS file and passing through the db items and the
    // count remaining inside of an object

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // create method from CRUD when the /addTodo route is passed in from the form in index.ejs
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // adds a new item into todos collection based off the form 
    // name being todoItem and then gets outputted through index.ejs by using the thing key and assigning completed to false, which would trigger 
    // the else statement in the index.ejs to not be crossed off when added to the to do list
    .then(result => { // if insert is successful do something
        console.log('Todo Added') // add to console that the to do has been added
        response.redirect('/') // gets rid of the /addTodo reoute and redirects back to the homepage, refreshing to the root route which will 
        // send a get request to get all the to do items
    }) // closing the .then()
    .catch(error => console.error(error)) // catch if there is any errors
}) // closes post method

app.put('/markComplete', (request, response) => { // update method from CRUD when the /markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the db for one item matching the name of the item passed in from the main.js
        // file that was clicked on, much better practice to use id value instead of object name
        $set: {
            completed: true // set completed status to true
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list if completed 
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => { //starting a then if update was successful
        console.log('Marked Complete') // print to console that it was successful
        response.json('Marked Complete') // respond with json to main.js that is put into variable called data inside of the markComplete function
        // to affirm that we got the response and are done
    })
    .catch(error => console.error(error)) // catch if there is an error to print an error to the console

}) //ending put

app.put('/markUnComplete', (request, response) => {  // update method from CRUD when the /markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{// look in the db for one item matching the name of the item passed in from the main.js
        // file that was clicked on, much better practice to use id value instead of object name
        $set: {
            completed: false // set completed status to false
          }
    },{
        sort: {_id: -1}, // moves item to the top of the list if uncompleted 
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => { //starting a then if update was successful
        console.log('Marked Complete') // print to console that it was successful
        response.json('Marked Complete') // respond with json to main.js that is put into variable called data inside of the markComplete function
        // to affirm that we got the response and are done
    }) // closing .then
    .catch(error => console.error(error)) // catch if there is an error to print an error to the console
})//ending put

app.delete('/deleteItem', (request, response) => { // starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // look inside the todos collection for the ONE item that has 
    // a matching name from our JS file
    .then(result => { //starting a then if the delete was successful
        console.log('Todo Deleted') // print to console that it was successful
        response.json('Todo Deleted') // respond with json to main.js that is put into variable called data inside of the markComplete function
        // to affirm that we got the response and are done
    })// closing .then
    .catch(error => console.error(error)) // catch if there is an error to print an error to the console
}) //ending delete

app.listen(process.env.PORT || PORT, ()=>{ // setting up which port we will be listening on - either from .env file (if it exists)
    // or port from the variable we set
    console.log(`Server running on port ${PORT}`) // console log the running port
}) // closes listen 