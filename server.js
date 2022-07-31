const express = require('express')// making it possible to use express 
const app = express() // setting a constant and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 // setting a constant to determine the location where our server will be listening
require('dotenv').config() // allows us to look for variables inside the .env file


let db, // declaring a variable called db
    dbConnectionStr = process.env.DB_STRING, // declaring a variable and assigning our database connection string to it
    dbName = 'todo' // declaring a variable and assigning the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // creating a connection to MongoDB, and passing in our connection string. Also passing in an additional property
    .then(client => { //waiting for the connection and proceeding if successful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`) // log to the console a template literal
        db = client.db(dbName) // assigning a value to previously declared db variable that containts a db client factory method
    }) // closing our .then
    
// Middleware    
app.set('view engine', 'ejs') // sets ejs as the default render
app.use(express.static('public')) // sets the location for the static assests
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLS where the header matches the content. Supports the arrays and objects
app.use(express.json()) // parses JSON content from incoming requests


app.get('/',async (request, response)=>{ // starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() // sets a variable and awaits ALL items from the 'todo' collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets the variable and awaits a count of uncomplete items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // rendering the EJS file and passing through the db items and the count ramiaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) // closing the get method

app.post('/addTodo', (request, response) => { // starts a POST method when the addTodo route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts a new item into todos collection, gives it a completed value of false by default
    .then(result => { // if inser is successful, do the thing
        console.log('Todo Added') // console log action
        response.redirect('/') // gets rid of the /addToDo route and redirects back to the homepage
    }) // closing .then
    .catch(error => console.error(error)) // cataching errors
}) // ending the POST

app.put('/markComplete', (request, response) => { // startings a PUT method when the markComplete route is pass in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // looks in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: { 
            completed: true // set completed status to true
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // presents insertion if item does not already exist
    })
    .then(result => { // starts a then if update was successful
        console.log('Marked Complete') // console log successful completion
        response.json('Marked Complete') // sending a response back to the sender
    }) // closing then
    .catch(error => console.error(error)) // catching errors

}) // ending PUT

app.put('/markUnComplete', (request, response) => { // startings a PUT method when the markUnComplete route is pass in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // looks in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false // set completed status to false
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // presents insertion if item does not already exist
    })
    .then(result => { // starts a then if update was successful
        console.log('Marked Complete') // console log successful completion
        response.json('Marked Complete') // sending a response back to the sender
    }) // closing then
    .catch(error => console.error(error)) // catching errors

}) // ending PUT

app.delete('/deleteItem', (request, response) => { // starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // look inside the todos collection for the ONE item that has a matching name from our JS file
    .then(result => { // starts a then if delete was successful
        console.log('Todo Deleted') // logging successful complete
        response.json('Todo Deleted') // sending a response back to the sender
    }) // closing then
    .catch(error => console.error(error))// catching errors

}) // closing delete

app.listen(process.env.PORT || PORT, ()=>{ // setting up which port we will be listening on, either the port from the .env file or the port variable we set
    console.log(`Server running on port ${PORT}`) // console log the running port
}) // end the listen method