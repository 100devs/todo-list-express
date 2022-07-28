const express = require('express') // calling express from the depencies and storing it in a variable called express
const app = express() // setting a variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient // setting up a MongoClient to talk to our mongodb. and placing it in a variable for shorthand
const PORT = 2121 // set a constant to define the location where our server will be listening.
require('dotenv').config() // allows us to look for variables inside the .env file


let db, // declare a variable called db but not assign a value
    dbConnectionStr = process.env.DB_STRING, // declaring a variable and assigning our database connection string to it
    dbName = 'todo' // declaring a variable and assigning the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // Creating a connection to MongoDB, and passing in a our connectionstring. Also passing in an additional property
    .then(client => { // waiting for the connection and proceeding if it's successful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`) // log to the console a template literal "connected to the Database"
        db = client.db(dbName) // assigning a value to previously declared db variable that contains 
    }) // closing or .then

// middleware, helps open the communications between routes.

app.set('view engine', 'ejs') // sets ejs as the default render method
app.use(express.static('public')) // sets the location for static assets
app.use(express.urlencoded({ extended: true })) //Tells express to decode and encode URLs where the header matches the context. Supports arrays and objects.
app.use(express.json()) //parses JSON content from incoming requests


app.get('/',async (request, response)=>{ // starts a GET Method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() // sets a variable and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // rendering EJS file and passing through the db items and the count remaining inside of an object


    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    .catch(error => console.error(error))

})

app.post('/addTodo', (request, response) => { //starts a POST method when the add toure is passed in

    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts a new item into todos collection,
    .then(result => { //if insert is successful, do something
        console.log('Todo Added') // console log action
        response.redirect('/') // gits rid of the /addTodo route, and redirects back to the homepage
    }) // closing the then
    .catch(error => console.error(error)) // catching errors
}) // ending the POST


 
app.put('/markComplete', (request, response) => { // starts a PUT method when the markComplete route is passed in

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the db for one item matching the name of the item passed in from the main.js file that was clicked on

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        $set: {
            completed: true // set completed status to true
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => { //starts a then method if the update was successful
        console.log('Marked Complete') //logging successful completion
        response.json('Marked Complete') // sending a response to the sender
    })// closing the .then
    .catch(error => console.error(error)) // catching errors

}) // ending our PUT

app.put('/markUnComplete', (request, response) => { // starts a PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false // set completed status to false
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => { //starts a then method if the update was successful
        console.log('Marked Complete') // logging successful completion
        response.json('Marked Complete') // sending a response to the sender
    }) // ends .then method
    .catch(error => console.error(error))  // catching errors
}) //ends the PUT

app.delete('/deleteItem', (request, response) => { // starts a DELETE method when the deleteItem route is passed in
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
    .then(result => { 
        console.log('Todo Deleted') //starts a then method if the update was successful
        response.json('Todo Deleted') // sending a response to the sender
    }) // ends .then method
    .catch(error => console.error(error)) // catching errors

})

app.listen(process.env.PORT || PORT, ()=>{ //setting up whcich port we will be listening on - either the port from the .env file or the port variable we set
    console.log(`Server running on port ${PORT}`) // console.log the running port.
}) // end the listen method