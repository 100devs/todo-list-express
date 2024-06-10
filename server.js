const express = require('express') // making it possible to use express in this file
const app = express() // creating a variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associated with MongoClient to connect to our database
const PORT = 2121 // creates PORT variable and assigning it the location our server will be listening on
require('dotenv').config() // allows us to look for variables inside of .env file


let db, // declares db variable globally with no variable assigned
    dbConnectionStr = process.env.DB_STRING, // declaring variable and assigning the database connection string to it
    dbName = 'todo' // creates variable and assigns our database name to it

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connecting to MongoDB and passing in connection string & a property
    .then(client => { // waiting for connection to be successful and passing in client information
        console.log(`Connected to ${dbName} Database`) // logs success message to console with our database name in template literal
        db = client.db(dbName) // assigns value to the db variable that contains db factory method
    }) // closing our .then

// middleware
app.set('view engine', 'ejs') // sets ejs as default render method
app.use(express.static('public')) // sets location for static assets
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLs where the header matches the content. supports arrays and objects
app.use(express.json()) // parses JSON content from incoming requests


app.get('/',async (request, response)=>{ // starts GET method when at the root route method, sets up request and response parameters
    const todoItems = await db.collection('todos').find().toArray() // creates a variable and awaits all items from todos collection and turns them into array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // creates a variable and awaits a count of uncompleted items to be displayed later
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // renders index.ejs and passes in object containing to do items and to do items left to be completed
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) // ends GET method


app.post('/addTodo', (request, response) => { // starts POST (create) method when the add route is passed in 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts a new todo item into collection. sets completed to false so it doesn't populate with a strikethrough
    .then(result => { // if insert is successful, proceed
        console.log('Todo Added') // console log if successful
        response.redirect('/') // redirect back to root path after adding new to do
    }) // closes .then
    .catch(error => console.error(error)) // logs error to console if error
}) // ends POST method

app.put('/markComplete', (request, response) => { // starts PUT (update) method when /markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // finds document in database with a thing property that matches itemFromJS from main.js
        $set: { 
            completed: true // set completed status to true
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list 
        upsert: false // prevents insertion if item does not already exist 
    })
    .then(result => { // starts a then if update was successful
        console.log('Marked Complete') // logging successful completion
        response.json('Marked Complete') // sends a response back to the sender
    }) // closes .then
    .catch(error => console.error(error)) // catches errors
 
}) // ends PUT method

app.put('/markUnComplete', (request, response) => { // starts PUT (update) method when /markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the database for item matching the name of itemFromJS from main.js
        $set: {
            completed: false // set completed status to false
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion if item does not already exist 
    })
    .then(result => { // starts a then if update was successful
        console.log('Marked Complete') // logging successful completion
        response.json('Marked Complete') // sends a response back to the sender
    })
    .catch(error => console.error(error)) // catches errors

}) // ends PUT method

app.delete('/deleteItem', (request, response) => { // starts delete method when /deleteItem route is passed in
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // look in the database for item matching the name of itemFromJS from main.js and deletes it
    .then(result => { // starts a then if deletion was successful
        console.log('Todo Deleted') // logs successful deletion
        response.json('Todo Deleted') // sends a response back to the sender
    }) // closes then
    .catch(error => console.error(error)) // catches errors

}) // closes delete method

app.listen(process.env.PORT || PORT, ()=>{ // tells app what port to listen on, getting port from env file if one exists or using PORT variable otherwise
    console.log(`Server running on port ${PORT}`) // logs successful server running message with port template literal
}) // closes listen method