//Modules
const express = require('express') //Makes it possible to use express in this file
const app = express(); //Sets a constant and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient; //Makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 //Sets a constant to determine the location where our server will listen
require('dotenv').config() //Allows you to look for variables inside the .env file


let db, //Declares a variable called db
    dbConnectionStr = process.env.DB_STRING, //Declares a variable called dbConnectionsStr and assigning our database connection string to it
    dbName = 'todo' ////Declares a variable and assigning the name of the database to "todo"

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Creates a connection to MongoDB and passing in a connection string. Also passing in an additional property
    .then(client => { //Waits for connection and proceeds if successful, and passing in all client information
        console.log(`Connected to ${dbName} Database`) //Logs to the console and template literal "connected to the todo database"
        db = client.db(dbName) //Assigns a value to previouesly declared variable that contains a db client factory method
    }) //Closes our .then

//MIDDLEWARE    
app.set('view engine', 'ejs') //Sets ejs as the default render method
app.use(express.static('public')) //Sets the location for static assets
app.use(express.urlencoded({ extended: true })) //Tells express to decode and encode URLs where the header matches the content. Supports arrays and objects.
app.use(express.json()) //Parses JSON content

//ROUTES
app.get('/',async (request, response)=>{ //Starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //Sets a variable and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //Sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //Renders the EJS file and passes through the db items and the count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //Starts a POST method when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //Inserts a new itm into todos collection, gives it a completed value of false by default
    .then(result => { //If insert is successful, do something
        console.log('Todo Added') //console log the action
        response.redirect('/') //Gets rid of the /addTodo route and redirects to the homepage
    }) //Closes the .thn
    .catch(error => console.error(error)) //Catches the errors
}) //Ends the POST

app.put('/markComplete', (request, response) => { //Starts a PUT method when the add route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //Looks in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: true //Sets completed status to true
          }
    },{
        sort: {_id: -1}, //Moves item to the bottom of the list
        upsert: false //Prevents insertion if item does not already exist
    })
    .then(result => { //Starts a then if update was successful
        console.log('Marked Complete') //Logs successful completion
        response.json('Marked Complete') //Sends a response back to the sender
    }) // Closes the .then
    .catch(error => console.error(error)) //Catches errors

}) //Closes PUT

app.put('/markUnComplete', (request, response) => { //Starts a PUT method when the markUncomplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},  //Looks in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        {
        $set: {
            completed: false //Sets completed status to false
          }
    },{
        sort: {_id: -1}, //Moves item to the bottom of the list
        upsert: false //Prevents insertion if item does not already exist
    })
    .then(result => { //Starts a then if update was successful
        console.log('Marked Complete') //Logs successful completion
        response.json('Marked Complete') //Sends a response back to the sender
    }) // Closes the .then
    .catch(error => console.error(error)) //Catches errors

}) //Closes PUT

app.delete('/deleteItem', (request, response) => { //Starts a delete method
    db.collection('todos') //Goes into your collection
    .deleteOne({thing: request.body.itemFromJS}) //Looks inside the todos collection for the one item that has a matching name from our JS file
    .then(result => { //Starts a then if update was successful
        console.log('Todo Deleted') //Logs successful completion
        response.json('Todo Deleted') //Sends a response back to the sender
    }) // Closes the .then
    .catch(error => console.error(error)) //Catches errors

}) //Closes DELETE

app.listen(process.env.PORT || PORT, ()=>{ //Sets up which port we'll be listening on - either from the .env file or the port variable
    console.log(`Server running on port ${PORT}`) //Console log the running port
}) //Closes the listen 