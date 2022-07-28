const express = require('express') //telling the server to use the express module 
const app = express() //seting a const and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient //telling the server to use the mongodb and .MongoClient is a node.JS module that allows you to create, connect and manipulate a mongo database using different methods
const PORT = 2121 //setting a constant to define the location where our server will be listening - localhost:2121
require('dotenv').config() //sets up the folder that holds your passwords and keys for example the key to mongoDB


let db, //declare a variable called db but not assign a value
    dbConnectionStr = process.env.DB_STRING, //declaring a variable to go into the .env file and find the DB_string
    dbName = 'todo' //declaring a variable and assigning the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // useUnifiedTopology to allow mongoDB to decide where the server should run from
    .then(client => { //this is a promise that returns the connection to the database, so we can get the data from it
        console.log(`Connected to ${dbName} Database`) //console.logs "connected to todo database"
        db = client.db(dbName) //client is basically what comes back from the promise, and we are naming the database connection db 
    }) //closing our .then

//middleware    
app.set('view engine', 'ejs') //its telling the server to use ejs as the templating engine
app.use(express.static('public')) //sets the location for static assets (css, main.js)
app.use(express.urlencoded({ extended: true })) //Tells express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json()) //Parses JSON content from incoming requests


app.get('/',async (request, response)=>{ //starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //seets a variable and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //renders returned items in the DOM
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) //ending get

app.post('/addTodo', (request, response) => { //when the route '/addTodo' is requested by client, returns a response
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item into todos collection, gives it a completed value of false by default
    .then(result => { //promise created
        console.log('Todo Added') //console logs action
        response.redirect('/') //auto refreshes database to show new task that was added
    })
    .catch(error => console.error(error)) //catching errors
}) //ending post

app.put('/markComplete', (request, response) => { //updates the to do item to complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: { //$set outputs documents that contain all existing fields from the input documents and newly added fields.
            completed: true //adds the property of completed, and sets it to true
          }
    },{
        sort: {_id: -1}, //sorts in descending order the numbers in the collection of the database
        upsert: false //we don't want any new documents added into the collection
    })
    .then(result => {
        console.log('Marked Complete') //logging successful completion
        response.json('Marked Complete') //sending a response back to the sender
    })
    .catch(error => console.error(error)) //catching errors

}) //ending put

app.put('/markUnComplete', (request, response) => { //updates the to do item to uncomplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false //adds the property of completed, and sets it to false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete') //logging successful completion
        response.json('Marked Complete') //sending a response back to the sender
    })
    .catch(error => console.error(error)) //catching errors

}) //ending put

app.delete('/deleteItem', (request, response) => { //when deleteItem is sent as part of the URL it runs this method
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //delete the itemFromJS property of the body object
    .then(result => {
        console.log('Todo Deleted') //logging successful completion
        response.json('Todo Deleted') //sending a response back to the sender
    })
    .catch(error => console.error(error)) //catching errors

}) //ending delete

app.listen(process.env.PORT || PORT, ()=>{ //setting which port we will be listening on - either the port from the .env  file or the port variable we set
    console.log(`Server running on port ${PORT}`) //console.log the running port
}) //end the listen method