// imports express packages to be used by our application
const express = require('express') // making it possible to use express in this file 
// here we are creating an object express and storing it in the variable app
const app = express() // setting a variable and assigning it to the instance of express
// here we are importing the mongo db packages and storing it in MongoClient
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associated with MongoClient and talk to our DB 
const PORT = 2121 // setting a variable to dertermnie the location where our server will be listening.
require('dotenv').config()// allows us to look for variables inside of the .env file

// defining our database and string settings 
let db,// declaring a variable called db but not assign a value 
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our database connection string to it
    dbName = 'to-do-list-db'//declaring a variable and assiging the name of the database we will be using

// establishing a connection to MongoDB and then testing to make sure the connection is working  
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // creating a connection to MongoDb, and passing in our connection string.Also passing in an additional property.
    .then(client => { //waiting for the connection and proceeding if successful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`)// log to the console a template literal 'connected to todo Database"
        db = client.db(dbName) //assinging a value to previously declared db variable that contains a db client factory method 
    })//closing our .then
 
//    ---middleware - helps faciliate communication betweemn client & server---
// setting the view engine to ejs by changing the output of our files   
app.set('view engine', 'ejs') // sets ejs as the default render 
app.use(express.static('public')) // sets the location for static assets 
// Built in function in express that allows data to be accessed through different routes. Parses incoming requests 
app.use(express.urlencoded({ extended: true }))// tells express to decode and encode URLs where the header matches the content. Supports arrays and objects.
// built in function in express that parses incoming JSON request and places them in Req.body. w/o this line, req/body would be undefined. 
app.use(express.json()) // Parses JSON content from incoming requests

// here we are routing how the app will get the information with a function and defines the root directory as '/'

// ROUTING 
// this routing is for the home or index page 
// with app.get we are reading the 
app.get('/', async (request, response) => { //starts a GET method when the root route is passed in, sets up req and res parameters
// async, meaning asynchronous turns a sync function into async  
// awaits for a response and accesses the todos db, finds all of them and stores them into an array 
    const todoItems = await db.collection('todos').find().toArray()//sets a variable and awaits ALL items from the todos collection
// parsing the documents in our todos db and looking for porperty values pairs. Only returns the ones that are false or are not completed 
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false }) // sets a variable and awaits a count of uncompleted items to later display in EJS
// rendering the index.ejs as an html file. We're passing our todoItems to the ejs as Items and the itemsLeft as left
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // rendering the EJS file and passing through the db items and the count remaining inside of an object

    //this is another way of doing the same thing using the .then classic promise syntax... the .then .then catch. 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    .catch(error => console.error(error))
})

// with app.post we're creating a new object. this ROUTING '/addTodo' is adding todo items into our app. When the client sends a request to add a todo into our db, we then respond

app.post('/addTodo', (request, response) => { //starts a POST method when the add route is passed in
// allows a new todoitem to be inserted into the db. The information is being accessed via request.body.todoItem through the index.ejs form  
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false }) //inserts a new item into todos collection, gives it a completed value of false by default 
// if the insertOne succeeded we console.log 'todo added' and the homepage is then refreshed.         
    .then(result => {// if insert is successful, do something 
        console.log('Todo Added') //console log action
        response.redirect('/') // gets rid of the /addTodo route, and redirects to the homepage
    }) // closing the .then
// if insertOne fails, the error is caught and console logged. 
    .catch(error => console.error(error)) //catching errors 
}) //ending the POST


app.put('/markComplete', (request, response) => { // starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {//look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: true //set completed status to true
          }
    }, {
 // sorting each object from the most recent item in the array, or the last item which was added  
        sort: { _id: -1 },// moves item to the bottom of the list 
// if upsert is true, the object is created. If upsert=false, nothing happens. 
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts a then if update was successful 
        console.log('Marked Complete') //logging successful completion
// a response is sent to the client as a json object
        response.json('Marked Complete') //sending a response back to the sender
    }) //closing .then
    .catch(error => console.error(error))
}) //ending put


app.put('/markUnComplete', (request, response) => { //starts a PUT method when the markUncomplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false //sets completed status to false
          }
    },{
        sort: {_id: -1},// moves item to the bottom of the list 
        upsert: false//prevents insertion if item does  not already exist
    })
    .then(result => { // starts a then if update was successful
        console.log('Marked Incomplete') //logging successful completion
        response.json('Marked Incomplete') //sending a response back to sender
    }) //closing .then
    .catch(error => console.error(error))//catching errors
}) //ending PUT

// the delete button trigers the app.delete
app.delete('/deleteItem', (request, response) => { //starts a delete method when the delete route is passed 
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS })//look inside the todos collection for the one item that has a matching name fromm our JS file 
    .then(result => { // starts a then if delete was successful
        console.log('Todo Deleted') // logging successful completion
        response.json('Todo Deleted') // sending a response back to the sender
    }) //closing .then
    .catch(error => console.error(error)) // catching errors
}) //ending delete 

app.listen(process.env.PORT || PORT, ()=>{ //setting up which port we will be listening on - either the port from the .env file or the port variabele we set
    console.log(`Server running on port ${PORT}`) // console.log the running port 
}) //end the listen method 