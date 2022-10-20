const express = require('express') //making it possible to use express in this file
const app = express() //setting the variable and assiging it to the instance of express
const MongoClient = require('mongodb').MongoClient // makes it possible to use the methods associated with Mongoclient to talk to our database
const PORT = 2121 // setting the variable for the PORT that our server will lsiten on
require('dotenv').config() // allows us to look for variables inside the .env file


let db,// declare a variable called db but don't assign it a value; decalre so we can use it globally
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning it the 'secret' DB_STRING that lives in the .env file
    dbName = 'todo' // declaring a variable; setting the 'name' of our database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //using the mongoclient method to create a connection to MongoDB, passing in our DB_STRING and passing in an additional property
    .then(client => {//waiting for the connection and proceeding if successful and passing in all the client information
        console.log(`Connected to ${dbName} Database`)//log to the console using template literal to log 'connected to DB'
        db = client.db(dbName)//assigning a value to previously declared variable that contains db client factory method
    })//closing our .then
//Middleware - helps us to facilitate our communication, sets up a pipeline    
app.set('view engine', 'ejs')//setting the view engine to ejs templating language; setting as the default render method
app.use(express.static('public'))//utilizing an express method to use the public folder for static assets; sets the location for static assets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URLS where the header matches the content. Supports arrays and objects.
app.use(express.json()) //helps us to parse json content from incoming requests

//get method - Read request
app.get('/',async (request, response)=>{//starts a GET method at the root route of the application. Starting asynchronous function. Sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray()// setting a variable and awaits the ALL items from the todos collection and creates an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})// sets variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//takes the response and renders into the index.ejs file. Passing through thedb items and the count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    .catch(error => console.error(error)) // if there are any errors catch and log them in the error tab
})//closing GET method

//POST method - Creating new item
app.post('/addTodo', (request, response) => { //starts a POST method when the addTodo route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})// look in the DB find the todo collection, inserts a new item into the collection with a value of false by default
    .then(result => {// if successful do something
        console.log('Todo Added')//console log action; todo successfully added
        response.redirect('/')// redirect back to the root route; refresh page which triggers a GET
    })//close then
    .catch(error => console.error(error))// if any errors catches and logs the errors
})// closing POST method

//PUT method; Update request 
app.put('/markComplete', (request, response) => {// trigger a PUT request on the markComplete route
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{// update the item in the collection, look in db matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: true //set completed status to true
          }
    },{
        sort: {_id: -1}, //move item to bottom of the list
        upsert: false //prevents insertion if item does not exist
    })
    .then(result => { // starts a then if update is successful
        console.log('Marked Complete')//logs marked complete
        response.json('Marked Complete')// responds with JSON marked complete; JSON sent back to the sender file to resolve
    })// close .then
    .catch(error => console.error(error)) //catching errors

})//close put

app.put('/markUnComplete', (request, response) => {// trigger a PUT request on the markUnComplete route
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{// update the item in the collection, look in db matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false//set completed status to false
          }
    },{
        sort: {_id: -1},
        upsert: false//prevents insertion if item does not exist
    })
    .then(result => {// starts a then if update is successful
        console.log('Marked Complete')//logs marked complete
        response.json('Marked Complete')// responds with JSON marked complete; JSON sent back to the sender file to resolve
    })// close .then
    .catch(error => console.error(error))//catching errors

})//close put

//DELETE request
app.delete('/deleteItem', (request, response) => {// trigger a DELETE request on the deleteItem route
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})// go into todos collection find the item with matching name from main.js and delete
    .then(result => {//then start
        console.log('Todo Deleted') //log todo deleted
        response.json('Todo Deleted') // respond with JSON back to sender
    })// close then
    .catch(error => console.error(error))// catching any errors

})// close delete

app.listen(process.env.PORT || PORT, ()=>{// setting up which port we will be listening on - either port from .env file or the variable declared
    console.log(`Server running on port ${PORT}`)//log the running port
})//close listen