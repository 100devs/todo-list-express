const express = require('express') //making it possible to use express in this file
const app = express() //setting a variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient //makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 //setting a constant to define the location where our server will be listening 
require('dotenv').config() //allows us to look for variables inside of the .env file


let db, //declare a variable called db bit not assign a value
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our database connection stringg to it
    dbName = 'todo' //declaring a variable and assigning the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to MongoDB, and passsing in ouru connection string. Also passing in an addition property 
    .then(client => { //waiting for the connection and proceeding if successful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`) //log to the console a template literal 'Conntected to todo Database'
        db = client.db(dbName) //assigning a value to previously declared db variable that contains a db client factory method
    })//closing our then

//middleware
app.set('view engine', 'ejs') //sets ejs as the default render method
app.use(express.static('public')) //sets the location for static assets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json()) //parses JSON content from incoming requests

app.get('/', async (request, response) => { //starts a get method when the root route is passed in, sets up req and res as parameters
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits all items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false }) //sets a variable andn awaits a count of uncompleted items to later display in ejs
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering the ejs file and passing through the db items and the count remaining inside of an object
    /* db.collection('todos').find().toArray()
     .then(data => {
         db.collection('todos').countDocuments({completed: false})
        .then(itemsLeft => {
             response.render('index.ejs', { items: data, left: itemsLeft })
        })
     })
     .catch(error => console.error(error))
    */
})//

app.post('/addTodo', (request, response) => {  //starts a post method when the root route is passed in, sets up req and res as parameters
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false }) //inserts a new item into todos collection, gives it a completed value of false by default
        .then(result => { //if insert is successful, do something
            console.log('Todo Added') //console log action
            response.redirect('/') //get rid of the /addTodo routue and returns to the homepage
        })//closing the then
        .catch(error => console.error(error)) //catching errors
}) //ending the post

app.put('/markComplete', (request, response) => {  //starts a put method when the markComplete route is passed in, sets up req and res as parameters
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, { //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on 
        $set: { 
            completed: true //set completed status to true
        }
    }, {
        sort: { _id: -1 }, //moves item to othe bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
        .then(result => { //starts a then if update was successful
            console.log('Marked Complete') // loggging successful completion
            response.json('Marked Complete') //sending a response nacl tp the sender
        }) //closing then
        .catch(error => console.error(error)) //catching errors 
}) //ending the put

app.put('/markUnComplete', (request, response) => { //starts a put method when the markUnComplete route is passed in, sets up req and res as parameters
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, { //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on 
             $set: {
            completed: false //set completed status to false
        }
    }, {
        sort: { _id: -1 }, //moves item to othe bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
        .then(result => { //starts a then if update was successful
            console.log('Marked Complete') // loggging successful completion
            response.json('Marked Complete') //sending a response nacl tp the sender
        }) //closing then
        .catch(error => console.error(error)) //catching errors 
}) //ending the put

app.delete('/deleteItem', (request, response) => { //starts a put delete when the deleteItem route is passed in, sets up req and res as parameters
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS }) //look insdie the todos collection for the one item that has a matching name from our js file (and deleting it)
        .then(result => { //if delete is successful
            console.log('Todo Deleted') //logging successful completion
            response.json('Todo Deleted') //sending a response back to the sender
        }) //closing then
        .catch(error => console.error(error)) //catching errors
}) //ending delete

app.listen(process.env.PORT || PORT, () => { //setting up which port we will be listening on - eiteher the port from the .env file or the port variable we set
    console.log(`Server running on port ${PORT}`) //console.log the running port
}) //end the listen method