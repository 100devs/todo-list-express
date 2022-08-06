const express = require('express') //Imports express and makes it so that express methods may be used
const app = express() //Assigns express to the constant named app
const MongoClient = require('mongodb').MongoClient //Allows methods associated with MongoClient to communicate with database
const PORT = 2121 //States where server will listen for connections
require('dotenv').config() //Provides access to data stored in a .env file


let db, //Declares variable named db globally so that it may be used later
    dbConnectionStr = process.env.DB_STRING, //Assigns database connection string from .env file to dbConnectStr variable
    dbName = 'todo' //Assigns name of database that will be used to the variable dbName

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Connects to the MongoDB passes in database connection string and an addtitional option
    .then(client => { //Waits for database to connect and will pass in client info if successful
        console.log(`Connected to ${dbName} Database`) //Prints message to confirm connection to the todo database
        db = client.db(dbName) //Assigns database client factory method to variable named db
    }) //Closes then method

//Middleware
app.set('view engine', 'ejs') //Makes Embedded Javascript (EJS) the default render method
app.use(express.static('public')) //Sets location for the static CSS and JavaScript files
app.use(express.urlencoded({ extended: true })) //Decodes and encodes URLs with headers that match the content and extends support to arrays and objects
app.use(express.json()) //Parses JSON from incoming requests

//CRUD Methods
app.get('/',async (request, response)=>{ //Begins a GET method when the root route is passed in and sets request and response as parameters
    const todoItems = await db.collection('todos').find().toArray() //Awaits all items from the todos database collection and stores them into an array that is assigned to the todoItems variable
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //Awaits a count of the not completed items in the todos database collection and assigns the number to the itemsLeft variable
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //Renders todo items and the number of items left from the database to the EJS file for the homepage 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) //Closes the GET method

app.post('/addTodo', (request, response) => { //Begins a POST method when the addTodo route is passed and sets request and response as parameters
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //Adds new item to the database collection todos and sets completed value as false
    .then(result => { //Begins a .then method and waits for an item to be added to the database
        console.log('Todo Added') //Prints message to the console confirming that an item was added to the database
        response.redirect('/') //Redirects to the homepage
    }) //Closes the .then method
    .catch(error => console.error(error)) //Creates a .catch method to handle exceptions to the then method and prints error to the console
}) //Closes the POST method

app.put('/markComplete', (request, response) => { //Begins a PUT method when the markComplete route is passed and sets request and reponse as parameters
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //Looks for an item in the database that matches the name in JS file
        $set: { //MongoDB operator that replaces the value of a field with the value specified within the curly braces
            completed: true //Changes the completed value of the item that was matched in the todos collection from false to true
          } 
    },{ 
        sort: {_id: -1}, //The MongoDB operator sort will arrange todo list items by id in descending order
        upsert: false //The MongoDB update statement upsert will not insert a new document to the database if item that is searched for doesn't exist
    }) //Closes the search 
    .then(result => { //Begins a .then method and waits for item to be updated in the database
        console.log('Marked Complete') //Prints message to the console that an item has been marked as complete
        response.json('Marked Complete') //Sends response to the sender
    }) //Closes .then method
    .catch(error => console.error(error)) //Creates a .catch method to handle exceptions to the .then method and prints error to the console

}) //Closes the POST method

app.put('/markUnComplete', (request, response) => { //Creates a PUT method when the markUncomplete route is passed and sets request and response as parameters
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //Looks for an item in the database that matches the name in JS file
        $set: { //MongoDB operator that replaces the value of a field with the value specified within the curly braces
            completed: false //Changes the completed value of the item that was matched to false
          }
    },{
        sort: {_id: -1}, //The MongoDB operator sort will arrange todo list items by id in descending order
        upsert: false //The MongoDB update statement upsert will not insert a new document to the database if item that is searched for doesn't exist
    }) //Closes the search
    .then(result => { //Begins a .then method and waits for item to be updated in the database
        console.log('Marked Complete') //Prints message to the console that an item has been marked as complete
        response.json('Marked Complete') //Sends response to the sender
    }) //Closes .then method
    .catch(error => console.error(error)) //Creates a .catch method to handle exceptions to the .then methods and prints error to console

}) //Closes PUT method

app.delete('/deleteItem', (request, response) => { //Begins a DELETE method when the route deleteItem is passed and sets request and response as parameters
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //Deletes an item from the todos collection in the database that matches name in the JS file
    .then(result => { //Begins a then method and waits for the result
        console.log('Todo Deleted') //Prints message to the console after an item is deleted from the database
        response.json('Todo Deleted') //Sends response to the sender
    }) //Closes then method
    .catch(error => console.error(error)) //Handles rejected promises and prints error

}) //Closes DELETE method

app.listen(process.env.PORT || PORT, ()=>{ //States server will listen on port stored in .env file or the variable PORT declared above
    console.log(`Server running on port ${PORT}`) //Prints messages to console confirming the port the server is running on
}) //Closes the listen