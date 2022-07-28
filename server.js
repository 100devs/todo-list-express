const express = require('express') //Make express available for use in this file
const app = express() //Create a variable and assign it to an express call
const MongoClient = require('mongodb').MongoClient //Make MongoClient methods available for use in this file to allow interaction with our database
const PORT = 2121 //Create a variable to specify the location where the server will be listening
require('dotenv').config() //Make .env file availalbe for use in this file


let db, //Create a variable without assigning a value to it
    dbConnectionStr = process.env.DB_STRING, //Create a variable and assign the database connection string to it
    dbName = 'todo' //Create a variable and assign the name of the database to it

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Create a connection to MongoDB and pass in our connection string and an additional property
    .then(client => { //Wait for the connection and proceed if successful, passing in all the client information
        console.log(`Connected to ${dbName} Database`) //Log a template literal to the console specifying that the database is connected
        db = client.db(dbName) //Assign a value to the previously declared "db" variable
    }) //Close the then handler

//Middleware
app.set('view engine', 'ejs') //Specify EJS as the default render method
app.use(express.static('public')) //Specify the location for static assets
app.use(express.urlencoded({ extended: true })) //Specify that express should decode and encode URLs where the header matches the content
app.use(express.json()) //Parses JSON content from incoming requests


app.get('/',async (request, response)=>{ //Start a GET operation when the root route is passed in
    const todoItems = await db.collection('todos').find().toArray() //Create a variable, wait for all the items in the "todos" collection, and put them in an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //Create a variable and wait for a count of the uncompleted items in the "todos" collection
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //Render the EJS file, passing in all the items and the count of uncompleted items
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) //Close the GET operation

app.post('/addTodo', (request, response) => { //Start a POST operation when the "addTodo" route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //Add a new item to the "todos" collection, passing in the user-entered text and setting the "completed" property to "false"
    .then(result => { //Wait for the POST to be successful
        console.log('Todo Added') //Log success message to the console
        response.redirect('/') //Redirect back to the homepage
    }) //Close the then handler
    .catch(error => console.error(error)) //If an error occurs, pass the error into the catch block and log the error to the console
}) //Close the POST operation

app.put('/markComplete', (request, response) => { //Start a PUT operation when the "markComplete" route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //Look in the database for one item matching the name of the item passed in with the request, and update it
        $set: { //Specify update
            completed: true //Set the "completed" property to "true"
          } //Close update
    },{ //Specify options
        sort: {_id: -1}, //Move item to the bottom of the list?
        upsert: false //Prevent insertion if item does not already exist
    }) //Close options
    .then(result => { //Wait for the PUT to be successful
        console.log('Marked Complete') //Log success message to the console
        response.json('Marked Complete') //Send response back in JSON
    }) //Close the then handler
    .catch(error => console.error(error)) //If an error occurs, pass the error into the catch block and log the error to the console
}) //Close the PUT operation

app.put('/markUnComplete', (request, response) => { //Start a PUT operation when the "markUnComplete" route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //Look in the database for one item matching the name of the item passed in with the request, and update it
        $set: { //Specify update
            completed: false //Set the "completed" property to "false"
          } //Close update
    },{ //Specify options
        sort: {_id: -1}, //Move item to the bottom of the list?
        upsert: false //Prevent insertion if item does not already exist
    }) //Close options
    .then(result => { //Wait for the PUT to be successful
        console.log('Marked Complete') //Log success message to the console
        response.json('Marked Complete') //Send response back in JSON
    }) //Close the then handler
    .catch(error => console.error(error)) //If an error occurs, pass the error into the catch block and log the error to the console
}) //Close the PUT operation

app.delete('/deleteItem', (request, response) => { //Start a DELETE operation when the "deleteItem" route is passed in
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //Look in the database for one item matching the name of the item passed in with the request, and delete it
    .then(result => { //Wait for the DELETE to be successful
        console.log('Todo Deleted') //Log success message to the console
        response.json('Todo Deleted') //Send response back in JSON
    }) //Close the then handler
    .catch(error => console.error(error)) //If an error occurs, pass the error into the catch block and log the error to the console
}) //Close the DELETE operation

app.listen(process.env.PORT || PORT, ()=>{ //Specify the port for the server to listen on, either the port from the .env file or the PORT variable
    console.log(`Server running on port ${PORT}`) //Log a template literal to the console specifying where the server is running
}) //Close the listen