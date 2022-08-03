const express = require('express') // Making it possible to use express in this file
const app = express() //Storing express call to variable called app, shortcut
const MongoClient = require('mongodb').MongoClient // Making it possible to use methods associated with MongoClient and talk to out DB
const PORT = 2121 // Set a variable to store our port location where our server will be listening.
require('dotenv').config() // Making it possible that allows use to create and use our .env file to hide our files and still access what is hidden


let db, // declaring variables, first one db
    dbConnectionStr = process.env.DB_STRING, // declare variable dbConnectionStr  and assigning our database connection string to it
    dbName = 'todo' //declare and store todo in dbName, naming our database that we want to access.

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Makes request to connect to mongo client database and passing our connection string and addition props.
    .then(client => { //takes request and then when successful does something
        console.log(`Connected to ${dbName} Database`) //console logs a message 
        db = client.db(dbName) //assigning db to be the client database that we want to connect to
    }) //Closing our then
    
app.set('view engine', 'ejs') // middleware to allow use to render html using ejs
app.use(express.static('public')) // middleware to set the location for static assests, css, js, images, etc.
app.use(express.urlencoded({ extended: true })) // Tells the express to decode and encode urls where the header matches the content. Supports arrays and objects
app.use(express.json()) //Parses JSON content from incoming requests.


app.get('/',async (request, response)=>{ // CRUD get methods that takes in the path and async function to do something when the path is triggered
    const todoItems = await db.collection('todos').find().toArray() // creating and storing in const all data inside db collection todos as an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // creates and stores in const the number of documents with the property value pair completed: false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // sending to our index.ejs file an object with todoItems and itemsLeft info to be used in the render of our ejs, and rendering our index.ejs
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // CRUD post method to path /addTodo with function including params req,res
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // access db collection named todos and insertOne document with the object key thing, value req.body.todoItem and key completed, value false
    .then(result => { // take result of top request and do something
        console.log('Todo Added') // log message
        response.redirect('/') // refresh page
    }) // end then 
    .catch(error => console.error(error)) //catch errors and console error errors
}) // end post method

app.put('/markComplete', (request, response) => { // CRUD put method to path /markComplete with function with params req,res
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //selects a document in db with identifying info given in todos collection
        $set: { // Start set for update
            completed: true // Set completed key to true in document
          } // End set
    },{ //start second object
        sort: {_id: -1}, // Sort documents
        upsert: false // Prevents insertion if item does not already exist
    }) //end updateOne
    .then(result => { // takes promise and does something
        console.log('Marked Complete') // logs message
        response.json('Marked Complete') // responds with json message
    }) //end then
    .catch(error => console.error(error)) // catch error

}) //

app.put('/markUnComplete', (request, response) => { //  CRUD put method to path /markUnComplete with function with params req,res
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // selects a document in db with identifying info given in todos collection
        $set: { // Start set for update
            completed: false // update completed key to false
          } // end set for update
    },{ //start next object passed into updateOne method
        sort: {_id: -1}, // Sort the documents
        upsert: false // Prevents insertion if does not exist
    }) // end object
    .then(result => { // starts upon successful updateOne request
        console.log('Marked Complete') // log message
        response.json('Marked Complete') // send json response 
    }) //end then
    .catch(error => console.error(error)) // catch error

}) // end CRUD method

app.delete('/deleteItem', (request, response) => { // CRUD delete method to path /deleteItem with function with params req res
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // Select db collection todos and deletes one that has the identifying info
    .then(result => { // upon succesful completion of delete request method does something
        console.log('Todo Deleted') // logs message
        response.json('Todo Deleted') // sends back json response
    }) // ends then
    .catch(error => console.error(error)) // catch error

}) // end delete CRUD method

app.listen(process.env.PORT || PORT, ()=>{ // sets up server to listen to correct port on the .env  or the varialbe we set up.
    console.log(`Server running on port ${PORT}`) //logs message
}) // ends listen methods