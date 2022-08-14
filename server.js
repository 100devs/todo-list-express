const express = require('express') // make it possible to use express in this file
const app = express() // set a variable and assign it to the instance of express
const MongoClient = require('mongodb').MongoClient // make possible to use methods assocaited with MongoClient to talk to our DB
const PORT = 2121 // setting a constant to determine the location where our server will be listening
require('dotenv').config() // allows us to look for variables inside of the .env file


let db, // declare a variable called db but not assign a value
    dbConnectionStr = process.env.DB_STRING, // declare a variable and assign our database connection string to it
    dbName = 'todo' // declare a variable and assign the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // create a connection to MongoDB, and pass in our connection string, and an additional property
    .then(client => { // waiting for the connection and proceed on success, also passing in all the client information
        console.log(`Connected to ${dbName} Database`) // log to the console a template literal "connected to todo Database"
        db = client.db(dbName) // assign a value to previously declared db variable that contains a db client factory method
    }) // close our .then

// middleware
app.set('view engine', 'ejs') // sets ejs as the default render method
app.use(express.static('public')) // set location for static assets
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLs where he header matches the content. supports arrays and objects
app.use(express.json()) // parses JSON content from incoming requests


app.get('/',async (request, response)=>{ // start a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() // set a variable and awaits all items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // rendering the EJS file and passing through the db items and the count remaining insider of an object

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    .catch(error => console.error(error))
}) // close / route

app.post('/addTodo', (request, response) => { // start a POST method when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts a new item into todos collection, go into the body of the request object and grap the todoItem, assign it to "thing" key in the document, give it completed value of false by default
    .then(result => { // if insert success do something
        console.log('Todo Added') // console log action
        response.redirect('/') // removes the /addTodo route, redirects back to homepage
    }) // close .then
    .catch(error => console.error(error)) // catch errors
}) // end post route

app.put('/markComplete', (request, response) => { // start a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // search db for one item matching item name passed in from main.js file that was clicked on
        $set: {
            completed: true // set completed status to true
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insert if item does not already exist
    })
    .then(result => { // starts a then if update was success
        console.log('Marked Complete') // log successful completion
        response.json('Marked Complete') // send response back to the calling function in main.js
    }) //close .then
    .catch(error => console.error(error)) // catch errors

}) // end put route

app.put('/markUnComplete', (request, response) => { // start a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // search db for one item matching item name passed in from main.js file that was clicked on
        $set: {
            completed: false // set completed status to true
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insert if item does not already exist
    })
    .then(result => { // starts a then if update was success
        console.log('Marked Complete') // log successful completion
        response.json('Marked Complete') // send response back to the calling function in main.js
    }) //close .then
    .catch(error => console.error(error)) // catch errors

}) // end put route

app.delete('/deleteItem', (request, response) => { // start a DELETE method when the markComplete route is passed in
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // search todos collection for one item that has a matching name from our JS file
    .then(result => { // starts a then if delete was success
        console.log('Todo Deleted') // log successful deletion
        response.json('Todo Deleted') // send response back to the calling function in main.js
    }) //close .then
    .catch(error => console.error(error)) // catch errors

}) // end put route

app.listen(process.env.PORT || PORT, ()=>{ // set port we will be listening on - either the port from the .env or the port variable we set
    console.log(`Server running on port ${PORT}`) // console log the running port
}) // end listen method