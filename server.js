const express = require('express')//tells js where to get express - imports express more or less *hand waves*
const app = express() //calling/initializing the express module in a variable
const MongoClient = require('mongodb').MongoClient // tells js to get the MongoClient part of MongoDB???
// const { MongoClient } = require('mongodb');
const PORT = 2121 //sets our port constant to 2121
require('dotenv').config() // imports dotenv so we can use a .env so we can privatize our usernames/passwords/etc - .env will be in .gitignore
console.log(process.env.test);

let db, //empty variable representing our database that we assign on line 16
    dbConnectionStr = process.env.DB_STRING, //assigning our connection string from .env, with our username/psswrd/etc.
    dbName = 'todo' //this is the name of our database that we'll use to query later

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connecting to our database
    .then(client => { // once we have connected...
        console.log(`Connected to ${dbName} Database`) //our terminal prints out that we're connected
        db = client.db(dbName) //we assign our database from the client to the db variable
    })
    .catch(err => { // TODO: handle any errors
        console.log("Error: ");
                 console.error(err);
    })

// Our middlewares below    
app.set('view engine', 'ejs') //setting our view engine so our server knows to use ejs template
app.use(express.static('public')) // lets us use our css and client side js folders in our public file
app.use(express.urlencoded({ extended: true })) //parses the incoming request from client - helps us alot thanks
app.use(express.json()) // parse incoming requests from client with JSON Payloads. Lets the client send a JSONified body

//Our Routes Start Here
app.get('/',async (request, response)=>{ // when the client request the root page
    const todoItems = await db.collection('todos').find().toArray() // psuedo-synchronously search database for all items, and put them in an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // psuedo-synchronously ask the database to count all documents that are incomplete
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // once we have our items, render them with the index ejs template
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) // *close brackets*

app.post('/addTodo', (request, response) => { //when the client makes a post request with the /addTodo url...
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // add the new todo item to the database
    .then(result => { //async promise created
        console.log('Todo Added') //terminal indicates that todo has been added to database
        response.redirect('/') // Redirect client back to homepage if database successfully adds item
    }) // *close brackets*
    .catch(error => console.error(error)) //catch any errors this time and log them to the console
})

app.put('/markComplete', (request, response) => { //when the client makes a put request with the /markComplete url...
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // get the item from the database...
        $set: {             // and set...
            completed: true // the item's 'completed' boolean to true
          } // *close brackets*
    },{ // *close brackets*, *open brackets for new object literal*
        sort: {_id: -1}, // sorting order: id descending 
        upsert: false // upsert is a portmanteau of "update" and "insert". 
    }) // *close brackets*
    .then(result => { //async promise created
        console.log('Marked Complete') //terminal indicates that item has been marked complete
        response.json('Marked Complete') //provide a response to tell the browser not to wait anymore
    }) // *close brackets*
    .catch(error => console.error(error))//catch any errors this time and log them to the console

}) // *close brackets*

app.put('/markUnComplete', (request, response) => { //when the client makes a put request with the /markUnComplete url...
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // get the item from the database...
        $set: {              // and set...
            completed: false // the item's 'completed' boolean to false
          } // *close brackets*
    },{ // *close brackets*, *open brackets for new object literal*
        sort: {_id: -1},// sorting order: id descending 
        upsert: false // upsert is a portmanteau of "update" and "insert".
    }) // *close brackets*
    .then(result => { //async promise created
        console.log('Marked Complete') // terminal indicates that item has been marked complete
        response.json('Marked Complete') // provide a response to tell the browser not to wait anymore
    }) // *close brackets*
    .catch(error => console.error(error))//catch any errors this time and log them to the console

}) // *close brackets*

app.delete('/deleteItem', (request, response) => { //when the client makes a delete request with the /deleteItem url...
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //removes an item from the db 
    .then(result => { //async promise created
        console.log('Todo Deleted') // terminal indicates that item has been deleted
        response.json('Todo Deleted') // provide a response to tell the browser not to wait anymore
    }) // *close brackets*
    .catch(error => console.error(error)) //catch any errors this time and log them to the console
}) // *close brackets*

// Tell app to listen to client requests.
// if there is no environment port, use our local PORT variable.
app.listen(process.env.PORT || PORT, ()=>{ // when the server is up and running...
    console.log(`Server running on port ${PORT}`) // log to the console that the server is running correctly
}) // *close brackets*