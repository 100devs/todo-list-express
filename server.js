// BIG PICTURE: this file handles incoming requests to the server

const express = require('express') //makes it possible to use express in this file
const app = express() //setting a variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient //makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 //setting a constant to define the location where our server will be listening
require('dotenv').config() //allows us to look for variables inside of the .env file

let db, //globally declare a variable with no assigned value
  dbConnectionStr = process.env.DB_STRING, //declares a variable and assigns our database connection string to it
  dbName = 'todo' //declares a variable and assigns the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Creates a connection to MongoDB, and passing in our connection string. Also passing in an additional property
  .then(client => { //waiting for the connection and proceeding if successful, and passing in all the client information
    console.log(`Connected to ${dbName} Database`) //log a template literal to the console "connected to todo Database"
    db = client.db(dbName) //assign a value to previously declared db variable that contains db client factory method
  }) //closing our .then

//middleware
app.set('view engine', 'ejs') //sets ejs as the default render method
app.use(express.static('public')) //sets the location for static assets
app.use(express.urlencoded({ extended: true })) //Tells express to decode and encode URLs where the header matches the content. SUpports arrays and objects
app.use(express.json()) //Parses JSON content from incoming requests


app.get('/', async (request, response) => { //starts a GET method when the root route is passed in, sets up req and res parameters
  const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits ALL items from the todos collection
  const itemsLeft = await db.collection('todos').countDocuments({ completed: false }) //sets a variable and awaits a count of uncompleted items to later display in EJS
  response.render('index.ejs', { items: todoItems, left: itemsLeft }) //renders the EJS file and passes an Object containing the db items and the remaining count
  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
}) //closes the function

app.post('/addTodo', (request, response) => { //starts a POST method when the addTodo route is passed in
  db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false }) //inserts a new item into todos collection, todoItem is the "name" attribute of the input box in main.js. Finally, gives it a completed value of false by default
    .then(result => { //is insert is successful, do something
      console.log('Todo Added') //console log action
      response.redirect('/') //gets rid of the /addTodo route, and redirects back to the homepage
    }) //closes the .then
    .catch(error => console.error(error)) //catching errors
}) //ending the POST

app.put('/markComplete', (request, response) => { //starts a PUT method when the markComplete route is passed in
  db.collection('todos').updateOne({ thing: request.body.itemFromJS }, { //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
    $set: {
      completed: true //set completed status to true
    }
  }, {
    sort: { _id: -1 }, //moves item to the bottom of the list
    upsert: false //prevents insertion if item does not already exist
  })
    .then(result => { //starts a then if update was successful
      console.log('Marked Complete') //logging successful completion
      response.json('Marked Complete') //sending a response back to the sender
    }) //closing .then
    .catch(error => console.error(error)) //catching errors

}) //ending PUT

app.put('/markUnComplete', (request, response) => { //starts a PUT method when the markUnComplete route is passed in
  db.collection('todos').updateOne({ thing: request.body.itemFromJS }, { //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
    $set: { //
      completed: false //set completed status to false
    } //
  }, { //
    sort: { _id: -1 }, //moves item to the bottom of the list
    upsert: false //prevents insertion if item does not already exist
  }) //
    .then(result => { //
      console.log('Marked Complete') //logging successful completion
      response.json('Marked Complete') //sending a response back to the sender
    }) //closing .then
    .catch(error => console.error(error)) //catching errors
}) //ending PUT

app.delete('/deleteItem', (request, response) => { //starts a DELETE method when the deleteItem route is passed in
  db.collection('todos').deleteOne({ thing: request.body.itemFromJS }) //look inside the todos collection for the ONE item that has a matching name from our JS file
    .then(result => { //starts a then if delete was successful
      console.log('Todo Deleted') //logging successful completion
      response.json('Todo Deleted') //sending a response back to the sender
    }) //closing .then
    .catch(error => console.error(error)) //catching errors
}) //ending DELETE

app.listen(process.env.PORT || PORT, () => { //starts the server listening on the port defined either from the .env file or the PORT constant we set earlier
  console.log(`Server running on port ${PORT}`) //console log a template literal to the console "Server running on port PORT"
}) //closing the listen function