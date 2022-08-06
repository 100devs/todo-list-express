const express = require('express') //makes is possible to use express in this file
const app = express() //assigns the constant app to an instance of express
const MongoClient = require('mongodb').MongoClient //makes it possible to use methods associated with MongoClient and talk to our database
const PORT = 2121 //sets a constant to the location our server will be listening
require('dotenv').config() //allows us to access variables inside of the .env file


let db, //declaring a global variable named db
    dbConnectionStr = process.env.DB_STRING, //declaring a variable named dbConnectionStr and assigning it to our database connection string located inside our .env file
    dbName = 'todo' //declaring a variable named dbName and assigning it to the name of the database we are accessing

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to MongoDB, passing in our connection string and also a property
    .then(client => { //waiting for the connection and proceeding if successful, as well as passing in all client information
        console.log(`Connected to ${dbName} Database`) //log to console a template literal "connected to todo Database"
        db = client.db(dbName) //assigning a value to the previously declared db variable that contains a db client factory method
    }) //closing our .then
    
//middleware
app.set('view engine', 'ejs') //sets ejs as the default render method
app.use(express.static('public')) //sets the location for static assets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URLs where the header matches the conent. Supports arrays and objects
app.use(express.json()) //parses JSON content from incoming requests


app.get('/',async (request, response)=>{ //starts a GET method when the root route is passed in, sets up req and ress paramteres
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering the EJS file adn passing through the db items and the count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) //close our method

app.post('/addTodo', (request, response) => { //starts a POST method when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item into todos collection, gives it completed value of false by default
    .then(result => { //if insert is successful, do something
        console.log('Todo Added') //console log action
        response.redirect('/') //gets rid of the /addTodo route and redirects back to the homepage
    }) //closing the .then
    .catch(error => console.error(error)) //catching errors
}) //ending the POST

app.put('/markComplete', (request, response) => { //starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: true //setting the completed status to true
          }
    },{
        sort: {_id: -1}, //moves item to bottom of the list
        upsert: false //prevents insertion if the item does not aleady exist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //logs to the console "Marked Complete" for successful completion
        response.json('Marked Complete') //sending response back to sender
    }) //closes .then
    .catch(error => console.error(error)) //catching errors

}) //end our PUT

app.put('/markUnComplete', (request, response) => { //starts a PUT method when the markUncomplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false //setting the completed status to false
          }
    },{
        sort: {_id: -1}, //moves item to bottom of the list
        upsert: false //prevents insertion if the item does not aleady exist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //logs to the console "Marked Complete" for successful completion
        response.json('Marked Complete') //sending response back to sender
    }) //closes .then
    .catch(error => console.error(error)) //catching errors

}) //end our PUT

app.delete('/deleteItem', (request, response) => { //starts a DELETE method when the deleteItem route is passed in
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
    .then(result => { //starts a then if delete is successful
        console.log('Todo Deleted') //logs to the console "Marked Complete" for successful completion
        response.json('Todo Deleted') //send response to sender
    }) //close .then
    .catch(error => console.error(error)) //catch errors

}) //end our DELETE

app.listen(process.env.PORT || PORT, ()=>{ //etting up which port we'll be listening on, either the port in the .env or the one assigned to the variable we set called PORT
    console.log(`Server running on port ${PORT}`) //console logs the server is running and the port that it's running on
}) //end the listen