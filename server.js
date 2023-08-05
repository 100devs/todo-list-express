const express = require('express') //making it possible to use express in this file
const app = express() //setting a constant and assigning it to instance of express
const MongoClient = require('mongodb').MongoClient //Mongoclient helps connect to the database. makes if possible to use methods assoicated with MongoClient and talk to our DB
const PORT = 2121 //setting a constant to define the location wher our server will be listening.
require('dotenv').config() //allows us to look for variables inside the .env file


let db, //delcare a variable called db but not assign a value
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our database connection string to it
    dbName = 'todo' //delcaring a variable and assigning the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Creating a connection to MongoDB and passing in our connection string. Also passing in an additional property.
    .then(client => { //MongoClient is establishing a promise. Waiting for the connection and proceeding if successful and passing in all the client information
        console.log(`Connected to ${dbName} Database`) //log to the console a template literal "connected to todo Database"
        db = client.db(dbName) //assigning a value to previously delcared variable that contains a db client factory method
    }) //closing the then
    
//middleware is software and cloud services that provide common services and capabilities to applications and help developers and operators build and deploy applications more efficiently. Middleware acts like the connective tissue between applications, data, and users.
app.set('view engine', 'ejs') //sets ejs as the default render
app.use(express.static('public')) //sets the location for static assets
app.use(express.urlencoded({ extended: true })) //Tells express express to decode and encode URLs where the header matches the content. Supporst arrays and objects
app.use(express.json()) //Parses JSON content from incoming requests


app.get('/',async (request, response)=>{ //starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering the EJS file and passing through the db items and the count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error)) //catching errors
}) //ending get

app.post('/addTodo', (request, response) => { //starts a POST method whent eh add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item into todos collection, gives it a completed value of false by default
    .then(result => { //if insert is successful, do something
        console.log('Todo Added') //console log action
        response.redirect('/') //gets rid of the /addTod route, and redirects back to the homepage
    }) //closing the .then
    .catch(error => console.error(error)) //catching errors
}) //ending the POST

app.put('/markComplete', (request, response) => { //starts a PUT mehod when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: true //set completed status to true
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts a thenif update was successful
        console.log('Marked Complete') //logging successful completion
        response.json('Marked Complete') //sending a response back to the sender
    })
    .catch(error => console.error(error)) //catching errors

}) //ending put

app.put('/markUnComplete', (request, response) => { //starts a PUT method when the markUnComplete route is passe in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passe in from the main.js file that was clicked on
        $set: {
            completed: false //set completed status to false
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //logging successful completion
        response.json('Marked Complete') // seding a response back to the sender
    }) //closing the .then
    .catch(error => console.error(error)) //catching errors

}) //ending the put

app.delete('/deleteItem', (request, response) => { //starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //look inside the todos collection for the ONE item that has a matching name from our JS file
    .then(result => { //starts a then if update was successful
        console.log('Todo Deleted') //logging successful completion
        response.json('Todo Deleted') // seding a response back to the sender
    }) //closing the .then
    .catch(error => console.error(error)) //catching errors

}) //end delete

app.listen(process.env.PORT || PORT, ()=>{ //setting up which port we will be listening on - either the port from the .env file or the port variable we set
    console.log(`Server running on port ${PORT}`) //console.log the running port
}) //end the listen method