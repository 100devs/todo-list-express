const express = require('express') // allows express to be used in the file
const app = express() //Saving the express call to the 'app' var
const MongoClient = require('mongodb').MongoClient// allows the use of MongoClient methods and communication with mongodb database
const PORT = 2121 // assign a port var
require('dotenv').config() // require dotenv to look for vars inside the .env file


let db, // declare an empty var
    dbConnectionStr = process.env.DB_STRING, // declare connection str var that gets the str from .env or heroku's vars  
    dbName = 'todo' // declare a var name of the database to be used

// Connection to the database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Create connecion to mongodb and passing in the connection string and additional property
    .then(client => { // waiting for the connection and proceeding if successful, then passing all the client information
        console.log(`Connected to ${dbName} Database`) // log confirmation of connection in terminal
        db = client.db(dbName) //assigning a value that contains a db client factory method to a previously declared var 
    }) // closing the .then
 
//middleware - opens up the communication channels for requests 
app.set('view engine', 'ejs') // set view engine to ejs as the default
app.use(express.static('public')) // set up public folder for css and main js and other static files
app.use(express.urlencoded({ extended: true }))  // tells express to decode and encode urls where the header matches the content. Supports arrays and objects
app.use(express.json()) // Parses JSON content from incoming requests


// Respond to get request to the root route
app.get('/',async (request, response)=>{ //starts a GET method when the root route is passes in, sets up req and res params
    const todoItems = await db.collection('todos').find().toArray() // sets a var and waits for ALL the items in database to download as an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets a var and waits for the number of items that have a completed value of false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // render the EJS file and pass vars todoItems and itemsLeft 

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) // ending the GET

// Respond to post request to the /addTodo route
app.post('/addTodo', (request, response) => { // starts a POST method when the add route is passed
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // insert new todo item into the collection with the completed value of false
    .then(result => { // if insert is successful, continue
        console.log('Todo Added') // log confirmation in terminal
        response.redirect('/') // refresh to the root page
    }) // closing the .then
    .catch(error => console.error(error)) // console log errors
}) // ending the POST 

// Respond to put request to the /markComplete route
app.put('/markComplete', (request, response) => {  // starting a PUT method when the markComplete route is passed 
   
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // go to database, collection todos, find a doc that matches request
        $set: { //
            completed: true // set completed status to true
          }
    },{
        sort: {_id: -1}, // sort by oldest first
        upsert: false // if the doc doesn't exist create a new one
    })
    .then(result => { // starts a then if update was successful
        console.log('Marked Complete') // logging successful completion
        response.json('Marked Complete') // sending a response back the to the sender
    }) // closing the .then
    .catch(error => console.error(error)) // Catch errors

}) // ending PUT


// Respond to update request to to mark item incomplete
app.put('/markUnComplete', (request, response) => { // starts a PUT method when the markUnComplete route is passed
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // find ine item in the db that matches the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false // set completed status to false
          }
    },{
       
        sort: {_id: -1}, // sort by oldest first
       
        upsert: false // if the doc doesn't already exist create a new one
    })
    .then(result => { // if update was successful, start a .then
        console.log('Marked Complete') // log successful completion
        response.json('Marked Complete') // send a response back to the sender
    }) // close .then
    .catch(error => console.error(error)) // Catch errors

}) // ending PUT


// Respond to delete request to the /deleteItem route
app.delete('/deleteItem', (request, response) => { // starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // go into database and delete the item that matches request.body.itemFromJS
    .then(result => { // start a .then if the delete was successful
        console.log('Todo Deleted') // log confirmation of deletion
        response.json('Todo Deleted') // send a response back to the sender
    }) // close .then
    .catch(error => console.error(error)) // Catch errors

}) // ending delete


// set the server to listen to requests
app.listen(process.env.PORT || PORT, ()=>{ // set upt he port to listen to, either from the .env file of the port var
    console.log(`Server running on port ${PORT}`) // log confirmation of running port
}) // end the listen method