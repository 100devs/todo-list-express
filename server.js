const express = require('express') //making it possible to use express in this file
const app = express() // setting a variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient //makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 //setting a constant to define the location where out server will be listening
require('dotenv').config() //allows us to look for variables inside of the .env file


let db, //declare a variable but not assign a value
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning it our database connection string
    dbName = 'todo' //declaring a variable and assigning the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to MongoDB, and passing in our connection string. Also passing in an additional property
    .then(client => { //waiting for the connection and proceeding if successful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`) //log to the console using template literal that we are connected to db
        db = client.db(dbName) //assign the db variable from line 8 that contains a db client factory method
    }) //closing our then
    
//set middleware
app.set('view engine', 'ejs') //sets ejs as the default render method
app.use(express.static('public')) //look in the public folder for routes we call later
app.use(express.urlencoded({ extended: true })) //settings
app.use(express.json()) //more settings


app.get('/',async (request, response)=>{ //starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //sets variables and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets a variable and awaits a count of uncompleted items to later display in EJS
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

app.post('/addTodo', (request, response) => { // starts a POST method when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts new item into todos collection with completed value false by default
    .then(result => { //if  insert is successful, do something
        console.log('Todo Added') //console log action
        response.redirect('/') //gets rid of the /addTodo route and redirects back to the homepage
    }) // closing the .then
    .catch(error => console.error(error)) // catch errors
}) //end the POST

app.put('/markComplete', (request, response) => { //starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in form the main.js file that was clicked on 
        $set: {
            completed: true //set completed status to true
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //logging successful completion
        response.json('Marked Complete') //sending a response back to the sender
    }) //closing then
    .catch(error => console.error(error)) // catching errors

}) //ending put

app.put('/markUnComplete', (request, response) => { //starts a PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in form the main.js file that was clicked on 
        $set: {
            completed: false //set completed status to false
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => {
        console.log('Marked Incomplete') //logging successful completion
        response.json('Marked Incomplete') //sending a response back to the sender
    }) //closing then
    .catch(error => console.error(error)) //catching errors

}) //closing put

app.delete('/deleteItem', (request, response) => { //starts a delete method when the deleteItem rout is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //look inside the todos collection for the ONE item that has a matching name from our JS file
    .then(result => { //starts a then if delete was successful
        console.log('Todo Deleted') //logging successful completion
        response.json('Todo Deleted') //sending a response back to the sender
    })//closing then
    .catch(error => console.error(error)) //catching erros

}) //ending delete

app.listen(process.env.PORT || PORT, ()=>{ //set up the port that we listen on - either the port from the .env or the 
    console.log(`Server running on port ${PORT}`) //console.log the running port
}) //end listen