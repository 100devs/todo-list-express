const express = require('express') //import express & all its dependencies 
const app = express() //set the app variable to equal the imported instance of express so that this variable can use express methods
const MongoClient = require('mongodb').MongoClient //connecting to MongoClient so that we can make requests to the database through MongoClient
const PORT = 2121 //set default location (port) where our server will run 
require('dotenv').config() //import .env file to allow us to access the file's information 


let db, //declare db variable
    dbConnectionStr = process.env.DB_STRING, //declare and assign dbConnectionStr to the database connection string from .env file
    dbName = 'todo' //declare dbName variable and assign it to 'todo' which is the name of the database we will be accessing through MongoClient

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connecting to MongoDB using our connection string
    .then(client => { //if connection to mongoDB works (promise fulfilled), then execute this next code block
        console.log(`Connected to ${dbName} Database`) //log message to console
        db = client.db(dbName) //assign db variable to the corresponding database in mongoDB
    }) //closing the then statement

//middleware     
app.set('view engine', 'ejs') //setting our view engine to ejs so that the index.ejs file is rendered
app.use(express.static('public')) //sets the location for static assets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URLs where the reader matches the content
app.use(express.json()) //lets express parse JSON from incoming requests


app.get('/',async (request, response)=>{ //starts get request when the root route is passed in (load, refresh) and sets up request and response parameters
    const todoItems = await db.collection('todos').find().toArray() //create and assign todoItems variable to the items in the mongoDB database and create an array with them
    const itemsLeft = await db.collection('todos').countDocuments ({completed: false}) //sets and assigns itemsLeft variable to the number of items left todo by filtering the 'todos' database by completed value of false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //tells app to render the index.ejs file and passes the todoItems and itemsLeft values to corresponding object keys in index.ejs

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) //close get request

app.post('/addTodo', (request, response) => { //starts POST request (create) when user wants to add an item to the todo list (triggered by the submit button on the page)
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new thing into the todos collection from the form input box
    .then(result => { //if new item is successfully added (promise fulfilled), then execute the following code
        console.log('Todo Added') //logs 'todo added' to console
        response.redirect('/') //redirects to the root route which will render with the added todo item
    }) //closing the then block
    .catch(error => console.error(error)) //if there is an error, log it to console
})//end POST request

app.put('/markComplete', (request, response) => { //start PUT request (update) when the markComplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //go into todos collection and specifies which item to update (itemFromJS is the inner text of the list item)
        $set: { 
            completed: true //change completed value to true from false
          } 
    },{ 
        sort: {_id: -1}, //moves item to bottom of list
        upsert: false //prevents insertion if item doesn't exist
    })//end of put request parameters
    .then(result => { //if update action is successful (promise fulfilled), then execute the following code 
        console.log('Marked Complete') //log "marked complete" to the console
        response.json('Marked Complete') //sending a response back to the markComplete function in main.js
    }) //end then block
    .catch(error => console.error(error)) //if update is NOT successful (promise rejected), then catch the error and log it to the console
}) //end PUT request

app.put('/markUnComplete', (request, response) => { //start PUT request (update) when the markUnComplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //go into todos collection and specifying which item to update by matching itemFromJs value
        $set: {
            completed: false //set completed value to false from true
          }
    },{
        sort: {_id: -1}, //move item to bottom of list
        upsert: false //prevents insertion if item doesn't exist
    })
    .then(result => { //if the PUT request is successful, then execute the following code 
        console.log('Marked UnComplete') //log "marked uncomplete" to console
        response.json('Marked UnComplete') //send a response back to markUnComplete function in main.js
    }) //end then block
    .catch(error => console.error(error)) //if there is an error, catch it and log it to the console
}) //end PUT request

app.delete('/deleteItem', (request, response) => { //starts a DELETE request when the deleteItem is passed in by user clicking on the trashcan item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //go into todos collection and find and delete the document with the matching itemFromJS
    .then(result => { //if item successfully deleted, then execute the following code
        console.log('Todo Deleted') //log "todo deleted" to console
        response.json('Todo Deleted') //send a response back to deleteItem function in main.js
    }) //end then block
    .catch(error => console.error(error)) //if there is an error, catch it and log it to the console
}) //end DELETE request

app.listen(process.env.PORT || PORT, ()=>{ //setting up which port server will be listening on, either from the .env file or using the default port set above
    console.log(`Server running on port ${PORT}`) //logs message to console
}) //end listen method