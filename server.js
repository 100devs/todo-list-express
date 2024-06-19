const express = require('express') //Making it possible to use express in this file
const app = express() //Setting a constant and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient //Makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 //Setting a constant to define the location where our server will be listening
require('dotenv').config() //Allows us to look for variables inside of the .env file


let db, //Declare a variable called db but not assign a value
    dbConnectionStr = process.env.DB_STRING, //Declaring a variable and assigning our database connection string to it
    dbName = 'todo' //Declaring a variable and assigning the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Creating a connection to MongoDB, and passing in our connection string.
//Also passing in an additional property
    .then(client => { //Waiting for the connection and proceeding if successful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`) //Log to the console a template literal "connected to todo Database"
        db = client.db(dbName) //Assigning a value to previously declared db variable that contains a db client factory method
    }) //Closing our .then
//Middleware
app.set('view engine', 'ejs') //Sets EJS as the default render method
app.use(express.static('public')) //Sets the location for static assets
app.use(express.urlencoded({ extended: true })) //Tells express to decode and encode URL's where the header matches the content. Supports
//arrays and objects
app.use(express.json()) //Parses JSON content from incoming requests


app.get('/',async (request, response)=>{ //Starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //Sets a variable and awaits ALL items from the todo collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //Sets a variable and awaits a count of uncompleted
    //items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //Rendering the EJS file and passing through the db items and the
    //count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) //Ending the GET

app.post('/addTodo', (request, response) => { //Starts a POST method when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //Inserts a new item into todos collection, gives it
    //a completed value of false by default
    .then(result => { //If insert is successful, do something
        console.log('Todo Added') //Console log action
        response.redirect('/') //Gets rid of the /addTodo route, and redirects back to the homepage
    }) //Closing the .then
    .catch(error => console.error(error)) //Catching errors
}) //Ending the POST

app.put('/markComplete', (request, response) => { //Starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //Look in the db for one item matching the name of the item passed
        //in from the main.js file that was clicked on
        $set: {
            completed: true //Set completed status to true
          }
    },{
        sort: {_id: -1}, //Moves item to the bottom of the list
        upsert: false //Prevents insertion if item does not already exist
    })
    .then(result => { //Starts a then if update was successful
        console.log('Marked Complete') //Logging successful completion
        response.json('Marked Complete') //Sending a response back to the sender
    }) //Closing .then
    .catch(error => console.error(error)) //Catching errors

}) //Ending PUT

app.put('/markUnComplete', (request, response) => { //Starts a PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //Look in the db for one item matching the name of the item passed
        //in from the main.js file that was clicked on
        $set: {
            completed: false //Set completed status to false
          }
    },{
        sort: {_id: -1}, //Moves item to the bottom of the list
        upsert: false //Prevents insertion if item does not already exist
    })
    .then(result => { //Starts a then if update was successful
        console.log('Marked Complete') //Logging successful completion
        response.json('Marked Complete') //Sending a response back to the sender
    }) //Closing .then
    .catch(error => console.error(error)) //Catching errors

}) //Ending PUT

app.delete('/deleteItem', (request, response) => { //Starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //Look inside the todos collection for the ONE item that has a
    //matching name from our JS file
    .then(result => { //Starts a then if delete was successful
        console.log('Todo Deleted') //Logging successful completion
        response.json('Todo Deleted') //Sending a response back to the sender
    }) //Closing .then
    .catch(error => console.error(error)) //Catching errors

}) //Ending DELETE

app.listen(process.env.PORT || PORT, ()=>{ //Setting up which port we will be listening on - either the port from the .env file or the port
    //variable we set
    console.log(`Server running on port ${PORT}`) //Console.log the running port
}) //Ending LISTEN