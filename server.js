const express = require('express') // making it possible to use express in this file
const app = express() // setting a constant and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 // setting a constant to determine the port of the location where our server will be listening
require('dotenv').config() // allows us to look for access variables inside of the .env file


let db, // declaring a variable
    dbConnectionStr = process.env.DB_STRING, // declaring a variable and assinging our database connection string to it
    dbName = 'todo' // declaring a variable and assinging the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // creating a connection to mongoDb and passing in our connection string. Also passing in and additional property.
    .then(client => { // waiting for the connection and proceeding if successful  and passing in all client information
        console.log(`Connected to ${dbName} Database`) // logging the template literal to the console "connected to todo database"
        db = client.db(dbName) // assigning a value to previously declared db variable that contains a db client factory method
    }) // closing our .then

// middleware
app.set('view engine', 'ejs') //sets ejs as the default render
app.use(express.static('public')) //sets the location for static assets
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLS where the header matches the content. supports arrays and objects
app.use(express.json()) // parses JSON content from incoming requests


app.get('/',async (request, response)=>{ //starts a GET method when the root route is passed in, sets up req and rs parameter 
    const todoItems = await db.collection('todos').find().toArray() // sets a variable and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets a variable and awaits a count of uncompleted items to later display in ejs
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //renderign the ejs file and passing through the db items and the count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    .catch(error => console.error(error))
}) // end of get method

app.post('/addTodo', (request, response) => { // starts a POST method when the addTodo route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item into the todos collection, gives it a completed value of false by default
    .then(result => { // if insert is successfull, do something
        console.log('Todo Added') // console log action
        response.redirect('/') // gets rid of the /addTodo route and redirects to the homepage
    }) // closing the then clause
    .catch(error => console.error(error)) // catching and displaying errors
}) // ending the post method

app.put('/markComplete', (request, response) => { // starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the db for one item mtching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: true // setting completed status to true
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => { // starting a then if update was successful
        console.log('Marked Complete') // logging successfull completion
        response.json('Marked Complete') // sending a response back to the sender
    }) // closing then clause
    .catch(error => console.error(error)) // catching errors
}) // ending PUT method

app.put('/markUnComplete', (request, response) => { // starts a PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the db for one item mtching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false // setting completed status to false
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => { // starting a then if update was successful
        console.log('Marked Complete') // logging successfull completion
        response.json('Marked UnComplete') // sending a response back to the sender
    })
    .catch(error => console.error(error)) // catching errors

}) // end of PUT methos

app.delete('/deleteItem', (request, response) => { // starts a DELETE method when the delete route is passed 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // looks inside the todos collection for the one item that has a matching name from our JS file
    .then(result => { // if the delete was succesfull
        console.log('Todo Deleted') // logging successful completion
        response.json('Todo Deleted') // sending a response back to the sender
    }) // closing then clause
    .catch(error => console.error(error)) // catching errors

}) // closing delete methos

app.listen(process.env.PORT || PORT, ()=>{ // setting up which port we will be listening on - either the port from the .env file or the port variable we set
    console.log(`Server running on port ${PORT}`) // console.log the running port
}) // end the listen method