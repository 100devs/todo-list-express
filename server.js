//we need git -terminal
//we need to initilize npm now

//how to install nodemon
//npm install nodemon --save-dev
//then change in package.json
//  "scripts": {
//     "test": "echo \"Error: no test specified\" && exit 1",
//     "start": "node server.js",
//     "dev": "nodemon server.js"
//   },

const express = require('express') //making it possible to use express in this file
const app = express() //setting a variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient //makes it possible to use methods associated with MongoClient and talk to our DB
//http://localhost:2121/
const PORT = 2121 //setting a constant to define the location where our server will be listening. 
require('dotenv').config() //allows us to look for or access variables inside of the .env file


let db, //declare a variable (globally) called db but not assign a value 
//in .env add DB_STRING = connection string from mongoDB overview change password 
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our database connection string to it
    //dbName = adding in our mongodb database collection name
    dbName = 'todo-item' //declaring a variable and assigning the name of the database we will be using
//connecting to MongoClient using our db 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to MongoDB and passing in our connection string.  Also passing in an additional property.
    .then(client => { // waiting for the connection and proceeding if successful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`) //log to the console a template literal "connected to todo Database"
        db = client.db(dbName) //assigning a value to previously declared db variable that contains a db client factory method
    }) //closing our .then
 
//middleware 
app.set('view engine', 'ejs') //sets ejs as the default render
app.use(express.static('public')) //sets the location for static assets
app.use(express.urlencoded({ extended: true })) //tells expres to decode and encode URLs where the header matches the content.  Supports arrays and objects.
app.use(express.json()) //parses JSON content from incoming requests

//METHODS 
app.get('/',async (request, response)=>{ // get is associated w/ Read from CRUD.  starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable and awaits a count of uncompleted items to later display in ejs
    //in ejs for loop display these items value
    //display items left in h2 
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

app.post('/addTodo', (request, response) => { //post method = Create in CRUD. Starts a POST method when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item ito todos collection, gives it a completed value of false by default
    .then(result => { //if insert is successful, then do something
        console.log('Todo Added') //console log action
        response.redirect('/') //gets rid of the /addTo route, and redirects back to homepage
    }) //closing the .then
    .catch(error => console.error(error)) //catching erros
}) //ending the POST

app.put('/markComplete', (request, response) => { //PUT = Update in CRUD.  Starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: true //set completed status to true
          }
    },{
        sort: {_id: -1}, //moves item to bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //logging successful completion
        response.json('Marked Complete') //sending a response back to the sender
    }) //closing .then
    .catch(error => console.error(error)) //catching errors

}) //ending put

app.put('/markUnComplete', (request, response) => { //Starts a PUT method when the markUncomplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false //set completed status to false
          }
    },{
        sort: {_id: -1}, //moves item to bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //logging successful completion
        response.json('Marked Complete') //sending a response back to the sender
    }) //closing .then
    .catch(error => console.error(error)) //catching errors

}) //ending put

app.delete('/deleteItem', (request, response) => { //starts delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //look inside the todos collection for the ONE item that has a matching name from our JS file
    .then(result => { //start a then if delete was successful
        console.log('Todo Deleted') //logging successful results
        response.json('Todo Deleted') //sending response back to sender
    }) //closing .then
    .catch(error => console.error(error)) //catch errors

}) //ending delete

app.listen(process.env.PORT || PORT, ()=>{ //setting which port we will be listening on - either the port from the .env file or the port variable we set
    console.log(`Server running on port ${PORT}`) //console log the running port
}) //end the listen method