const express = require('express') //making it possible to use express in this file
const app = express() //setting a variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient //makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 // setting a constant to define the location where our server will be listening
require('dotenv').config() //allows us to look for variables inside of the .env file


//Here we setup or Mongo Database and provide the required login information within the DB_STRING variable. Log our database
//connection status to the console

let db, //declare a variable called db but not assign a value
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our database connection string to it
    dbName = 'todo' //declaring a variable and assigning the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Creating a connection to MongoDB, and passing in our connection string. Also passing in an additional property
    .then(client => { //waiting for the connection and proceeding if successful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`) //Log to console that we are connected to the Database
        db = client.db(dbName) //assigning a value to previously declared db variable that contains a db client factory method
    }) //closing our .then

//middleware
app.set('view engine', 'ejs') //set the view engine to use the ejs file 
app.use(express.static('public')) //sets the location for static assets
app.use(express.urlencoded({ extended: true })) //Tells express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json()) //Needed for us in order to parse JSON easier

//route for our root page. Async function. Retrieves how many todo items we have and how many todo items we have left to complete
app.get('/',async (request, response)=>{ //starts a GET method when the route is passed in, sets up req and res parameters
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
    // .catch(error => console.error(error))
})

//Allows us to add a new item to the todo list. Then redirects us to the get request so we can see our new list of todo items
app.post('/addTodo', (request, response) => { //starts a POST method when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item in to todos collection, gives it a completed value of of false by default
    .then(result => { //if insert is successful, do something
        console.log('Todo Added') //console log actions
        response.redirect('/') //gets rid of /addTodo route, and redirects back to the homepage
    }) //closing the .then
    .catch(error => console.error(error)) //catching errors
}) //ending the POST

// Update - put. Lets you update existing item in todos collection to mark complete and moves to bottom of list. Logs "Marked Complete"
app.put('/markComplete', (request, response) => { //starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: true //set completed status to false
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => {
        console.log('Marked Complete') //logging successful completion
        response.json('Marked Complete') //sending a response back to the sender
    }) //closing .then
    .catch(error => console.error(error))

}) //ending put

// Update - put. Lets you update existing item in todos collection to mark uncomplete and moves to bottom of list. Logs "Marked Complete"
app.put('/markUnComplete', (request, response) => { //starts a PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false //set completed status to false
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

})


//Delete - delete an item you no longer need and log message
app.delete('/deleteItem', (request, response) => { //starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //look inside the todos collection for the ONE item that has a matching name from our JS file
    .then(result => { //starts a then if delete was successful
        console.log('Todo Deleted') //logging a successful completion
        response.json('Todo Deleted') // sending a response back to the sender
    }) //closing .then
    .catch(error => console.error(error)) //catching errors

}) //ending delete

//Which port to listen on and logging a message about it. Grab port from PORT or from env file
app.listen(process.env.PORT || PORT, ()=>{ //setting up which port we will be listening on - either the port fromr the .env file or the port variable we set
    console.log(`Server running on port ${PORT}`) //console.log the running port
})