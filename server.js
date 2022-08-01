const express = require('express') // Making possible to use express in this file
const app = express() // Setting a variable and assigningit to the intance of express 
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associated with MongoCLient and talk to uor Data Base 
const PORT = 2121 // Setting a variable to define the prot of the location where our server will be listing 
require('dotenv').config() // Allows us to access variables inside of the .env file


let db, // Declaring a varibale call db
    dbConnectionStr = process.env.DB_STRING, // Declaring a variable and assigning it our database connection string to it
    dbName = 'todo' //delcalring a variable and assigning ther name of the database we will be using 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // Creating a connection to MongoDB, and passing our connection string. Also passing in an additional 
    .then(client => { // Waiting for ther connection and proceeding if successful, and passing in all the client information 
        console.log(`Connected to ${dbName} Database`) // log to the console a template literal connected to todo Database
        db = client.db(dbName) //assigning a value to previously declared DB variable that contains a db client factory method 
    }) // Closing our then

    // Middleware     
app.set('view engine', 'ejs') // sets ejx as the default render method 
app.use(express.static('public')) //sets the location for static assets 
app.use(express.urlencoded({ extended: true })) // Tells epress to encode and decode URLS where header matches the content. Supports arrays and objects
app.use(express.json()) // Parses json content from incoming requests


app.get('/',async (request, response)=>{ // starts a Get method when the root route is passed in, sets up req and res parametters
    const todoItems = await db.collection('todos').find().toArray() // set a varibales and awaits All items from the todos collection 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // set a variable and await a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // Rendering the EJX file and passing through the DB items and the count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // Start a POST method when the add route is passed in 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserting a new item into todos collection, give it a completed value offalse by default 
    .then(result => { // If insert is succesfull, do something 
        console.log('Todo Added') // console log action 
        response.redirect('/') // get rid of the /addTodo route, and redirect tothe home page 
    }) // closing the .then 
    .catch(error => console.error(error)) // catching errors 
})// ending the POST

app.put('/markComplete', (request, response) => { // start a PUT method when the markComplet route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the data base for one item mactching the name of the item passed in from the main.js file that was clicked on 
        $set: {
            completed: true // set completed status to true 
          }
    },{
        sort: {_id: -1}, //move item to the bottom of the list 
        upsert: false //Prevent insertion if item does not already exist 
    })
    .then(result => { // Starting a then if update was successful 
        console.log('Marked Complete') // logging succesful completion 
        response.json('Marked Complete') // Sending a response back to the sender
    }) //closing then 
    .catch(error => console.error(error)) // catching errors 

}) // ending our Put 

app.put('/markUnComplete', (request, response) => { // starting a PUT method when the markUnComplete route is passed  
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the data base for one item mactching the name of the item passed in from the main.js file that was clicked on 
        $set: {
            completed: false // set completed status to false 
          }
    },{
        sort: {_id: -1}, //move item to the bottom of the list 
        upsert: false //Prevent insertion if item does not already exist 
    })
    .then(result => { // Starting a then if update was successful 
        console.log('Marked Complete') // logging succesful completion 
        response.json('Marked Complete') // Sending a response back to the sender
    })  //closing then 
    .catch(error => console.error(error)) // catching errors 

}) // ending our Put 

app.delete('/deleteItem', (request, response) => { // starting a DELETE method when the deleteItwm route is passed in  
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //look  inside the todos collection for the ONE item that has a matching name from our JS file 
    .then(result => { // starting a then if the deletes was successful 
        console.log('Todo Deleted') // logging succesful completion 
        response.json('Todo Deleted') // Sending a response back to the sender 
    }) //closing .then 
    .catch(error => console.error(error)) // catching errors 

}) // ending delete 

app.listen(process.env.PORT || PORT, ()=>{ // setting up which port we will be listening on, either the PORT on the .env file  
    console.log(`Server running on port ${PORT}`) // console log the running port 
}) // end the lsiten method  