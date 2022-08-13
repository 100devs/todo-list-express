const express = require('express') // making it posible to use express in this file
const app = express() // saving the expresss call to the 'app' variable as a constant
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 // setting a const to define the location where our server will be listening
require('dotenv').config() // allows us to look for variables inside of the .env file


let db, // creating a variable called db
    dbConnectionStr = process.env.DB_STRING, // declaring a variable and assigning our databe connection string to it
    dbName = 'todo' // declaring a variable and setting the name of our database as todo

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Creating a connection to MongoDB, and passing in our connection string. 
//Also passing in an additional property
    .then(client => { //waiting for the connection and proceeding if successful and passing in all the client information
        console.log(`Connected to ${dbName} Database`) // logging to the console our connection to the database name of 'todo'
        db = client.db(dbName) // assigning db variable that contains a db client factory method
    })// closing our .then
    
//middleware: the purpose of middleware is to allow us to facilitate our communication channels for our requests
app.set('view engine', 'ejs') // sets ejs as the default render method
app.use(express.static('public')) // sets the location for the static assets
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json()) //Parses JSON content from incoming requests


app.get('/',async (request, response)=>{ //app referencing express, handling a read request, starts a GET method when the root route is passing in, sets up req and res paramters
    const todoItems = await db.collection('todos').find().toArray() // sets a variable and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // rendering our index.ejs and inside of that render method we are passing an object that contains our todoItems and itemsLeft and the count remaining inside of an object

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) // closing our get block

app.post('/addTodo', (request, response) => { //starts a POST method when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item into todos collection, gives it a completed value of false by default
    .then(result => { //promise syntax for the next 3 lines, if insert is successful, do something
        console.log('Todo Added') //console.log action
        response.redirect('/') //redirecting to refresh on the root page, gets rid of the /addTOdo route, and redirects back to homepage
    }) //closes our .then promise
    .catch(error => console.error(error)) //catches errors if any and console logs them 
}) //closes our post block

app.put('/markComplete', (request, response) => { //starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: { //setting the completed value to true
            completed: true //set completed status to true
          } 
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => { //starting a THEN if the update was successful
        console.log('Marked Complete') //console logs marked complete
        response.json('Marked Complete') //sending a response back to the sender
    }) // closing our THEN 
    .catch(error => console.error(error)) //catching errors
 
}) //ending our PUT

app.put('/markUnComplete', (request, response) => { //starts a PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in teh db for one item matching the name of the passed in from the main.js file that was clicked on 
        $set: { //setting the completed value to false
            completed: false //set completed status to false
          } 
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertion if item does not already exist
    }) //
    .then(result => { //starting a THEN if the update was successful
        console.log('Marked Complete') // logging succseeful completion
        response.json('Marked Complete') //sending a response back to the sender
    }) //closing .then
    .catch(error => console.error(error)) //cathing errors

}) //ending our PUT

app.delete('/deleteItem', (request, response) => { //starts a DELETE method when the delete route is passed 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //look inside the todos collection for the ONE item that has a matching name from our JS file
    .then(result => { //starts a THEN if delete was successful
        console.log('Todo Deleted') //console log the results
        response.json('Todo Deleted') //sending a response back to the sender
    }) //closing .then
    .catch(error => console.error(error)) //catching errors

}) //ending delete method

app.listen(process.env.PORT || PORT, ()=>{ //settuing up which port we will be listening on - either the prot from the .env file if it exists or the port variable we set
    console.log(`Server running on port ${PORT}`) // console.log the running port.
}) //end the listen method