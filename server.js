const express = require('express') // making it possible to use express in this file
const app = express() // app is a constant with the call to express
const MongoClient = require('mongodb').MongoClient // creates a variable that lets us connect to MongoDB - makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 // creates a constant to set the location where our server will be listening
require('dotenv').config() // allows us to look for variables inside of the .env file


let db, // creates a variable with no value
    dbConnectionStr = process.env.DB_STRING, // creates a variable that captures the DB_STRING inside the .env file
    dbName = 'todo' // creates a variable and assigns the name of the database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connects to MongoDB, passing in the connection string from the .env file + passing in an additional property that I do not understand what does...
    .then(client => { // waiting for the connection and proceeding if succesful
        console.log(`Connected to ${dbName} Database`)  // logs which database name the server is connected to
        db = client.db(dbName) // assigns a value to the previously declared variable that stores the database information for later use, since it's created globally
    }) // closes the .then
    
app.set('view engine', 'ejs') // sets the render method to ejs
app.use(express.static('public')) // sets the location for static assets, which is available in the dev tools
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLs where the header matches the content. supports arrays and objects
app.use(express.json()) // tells express to parse json from incoming requests


app.get('/',async (request, response)=>{ // starts a GET(read) request when the root route is passed in, sets up req and res params
    const todoItems = await db.collection('todos').find().toArray() // sets a variable and awaits all items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // renders the index.ejs file, and passes an object containing the todoItems, and itemsLeft, which are used in the rendering of the ejs file
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) // ends the GET

app.post('/addTodo', (request, response) => {  // starts a POST (create) request when the route addTodo is passed, sets up req and res params
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})  // connects to the database, specifically the todos collection inside the database, and will insert the object, which is the text input inside the body, and sets the value completed to false
    .then(result => {  // if insertOne is successful, then do the following
        console.log('Todo Added') // logs 'Todo Added' to the console
        response.redirect('/') // redirects the user to the root route
    })  // closes the .then
    .catch(error => console.error(error)) //  if error, console log the error
})  // ends the POST request

app.put('/markComplete', (request, response) => { // starts a PUT (update) request when the route markComplete is passed, sets up req and res params
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the database for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: { // trying to set something in the document
            completed: true // sets the completed value to true
          } // closes the set
    },{ // 
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion if item does not already exist
    }) // 
    .then(result => { // if update was succesful, do the following
        console.log('Marked Complete') // logs 'Marked complete' in the console
        response.json('Marked Complete') // sends the response back to the sender
    }) // closes the .then
    .catch(error => console.error(error)) // if update did not work, log the error in the console

}) // ends the PUT

app.put('/markUnComplete', (request, response) => { // starts a PUT method request when the route markUnComplete is passed, sets up req and res params
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the database for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: { // 
            completed: false // sets the completed value to false
          } // 
    },{ // 
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion if item does not already exist
    }) // 
    .then(result => { // if update was succesful, do the following
        console.log('Marked Complete') // logs 'Marked complete' in the console
        response.json('Marked Complete') // sends the response back to the sender
    }) // closes the .then
    .catch(error => console.error(error)) // if update did not work, log the error in the console

}) // ends the PUT

app.delete('/deleteItem', (request, response) => { // starts a DELETE (delete) method request when the route deleteItem is passed, sets up req and res params
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // looks in the database for one item matching the name of the item passed in, and deletes the document
    .then(result => { // if deletion was successful, do the following
        console.log('Todo Deleted') // logs 'Todo Deleted' in the console
        response.json('Todo Deleted') // send the response back to the sender
    }) // closes the .then
    .catch(error => console.error(error)) // if error, log the error in the console

}) // ends the DELETE

app.listen(process.env.PORT || PORT, ()=>{ // setting up which port we will be listening on - either the port comes from the .env file, or the PORT variable if the port does not exist in the .env file
    console.log(`Server running on port ${PORT}`) // logs the running port to the console
}) // ends the listen