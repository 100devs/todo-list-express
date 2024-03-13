const express = require('express')//making it possible to use express in this file
const app = express() //setting a variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient //makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121//setting a constant to determine the location where our server will be listening

require('dotenv').config()//allows us to look for variables inside of the .env file

//COMMENT
let db, //declare a variable called db but not assign a value
    dbConnectionStr = process.env.DB_STRING, //declariing a variable and assigning our database connection string to it
    dbName = 'todo' //declaring a variable and assigning the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to MongoDB, and passing in our connection string. Also passing in an additional property
    .then(client => { //waiting for the connection and proceeding if successful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`) //log to the console a template literal "connected to todo Database"
        db = client.db(dbName) //assigning a value to a previously declared variable that contains a db client factory method
    }) //closing our .then
//middleware that helps open the communication channels for our requests   
app.set('view engine', 'ejs') //sets ejs as the default render method
app.use(express.static('public')) //sets the location for static assets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URLs where the header matches the content. supports arrays and objects
app.use(express.json()) //parses JSON content from the incoming requests


app.get('/',async (request, response)=>{ //starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering the EJS file and passing through the DB items and the count remaining inside of an object

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //starts a POST method when the add route is passed in from the form
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item into todos collection, gives it a completed value of false by default
    .then(result => { // if insert is successful, do something
        console.log('Todo Added') //console log action
        response.redirect('/') //gets rid of the /addtodo route and redirects back to the home page
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => { //starts a POST method when the add route is passed in from the form
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{  //look in the database for one item matching the name in the item passed in from the main.js file that was clicked on
        $set: { 
            completed: true //set completed status to true
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list 
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //logging successful completion
        response.json('Marked Complete') //sending a response back to the sender
    }) //closing .then
    .catch(error => console.error(error)) //catching errors

}) //ending our put

app.put('/markUnComplete', (request, response) => { //starts a POST method when the add route is passsed in from the form
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the database for one item matching the name in the item passed in from the main.js file that was clicked on
        $set: {
            completed: false //set completed status to false
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list 
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //logging successful 
        response.json('Marked Complete') //sending a response back to the sender
    }) //closing .then
    .catch(error => console.error(error)) //catching errors

}) //ending our put

app.delete('/deleteItem', (request, response) => { //starts a DELETE method when the add route is passed in from the form
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //look inside the todos collection for the one item that has a matching name from our JS file
    .then(result => { //starts a then if delete was successful
        console.log('Todo Deleted') //console log results
        response.json('Todo Deleted') //send a response back to sender
    }) //closer then
    .catch(error => console.error(error)) //catch erros

}) //ending delete

app.listen(process.env.PORT || PORT, ()=>{ //setting up which port we will be listening on - when hosting your application on another service (like Heroku, Nodejitsu, and AWS), your host may independely configure the process.env.PORT variable for you; after all, your script runs in their environment OR the PORT variable we set
    console.log(`Server running on port ${PORT}`) //console.log the running port
}) //end the listen