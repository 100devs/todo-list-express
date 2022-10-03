const express = require('express') //importing the express module
const app = express() // assign express function call to app
const MongoClient = require('mongodb').MongoClient //import mongoDB
const PORT = 2121 //setting a constant variable to declare the location where the server will listen
require('dotenv').config() //import dotenv file


let db, //create a variable named db without assigning a value
    dbConnectionStr = process.env.DB_STRING, //connect to the Database String in the dotenv file
    dbName = 'todo' //create a variable that holds the database name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Connect to MongoDB using the connection string
    .then(client => {    //wait for the connection and proceeding if successful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`) //log to the console a template literal "connected to todo Database"
        db = client.db(dbName) //assinging a value to previously declared db variable that contains
    }) //closing out .then
    
app.set('view engine', 'ejs') // sets ejs as the default render method
app.use(express.static('public')) // sets the location for static assets
app.use(express.urlencoded({ extended: true })) //Tell express to decode and encode URLs where the header matches the content. Supports arrays and objects.
app.use(express.json()) // Parses JSON content from incoming requests


app.get('/',async (request, response)=>{ // starts a GET method when the root route is passed in, sets up request and response parameters
    const todoItems = await db.collection('todos').find().toArray() // sets a variable and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering the EJS file and passing through the db items and the count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    .catch(error => console.error(error)) //catching errors
}) //ending of GET method

app.post('/addTodo', (request, response) => { //starts a POST method when the add route is passed in 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item into todos collection, gives it a completed value of false by default
    .then(result => { //if insert is successful, do something
        console.log('Todo Added') //console log action
        response.redirect('/') //gets rid of the /addTodo route, and redirects back to the homepage
    })// closing the .then
    .catch(error => console.error(error)) //catching errors
}) //ending of POST method

app.put('/markComplete', (request, response) => { //starts a PUT method when the markCompleted route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
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
    }) //.then closing
    .catch(error => console.error(error)) //catching errors

}) //ending PUT method

app.put('/markUnComplete', (request, response) => { //starts a PUT method when the markUnCompleted route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false //set completed status to false
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete')//logging successful completion
        response.json('Marked Complete')//sending a response back to the sender
    })//.then closing
    .catch(error => console.error(error)) //catching errors

})//ending PUT method

app.delete('/deleteItem', (request, response) => { //starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // looks in the todos collection for one item that matches the name of our item from our JavaScript file
    .then(result => {  //if the delte is successful, the .then starts
        console.log('Todo Deleted') // Logs that the deletion was successful
        response.json('Todo Deleted') // sends a response to the sender
    }) // End of then
    .catch(error => console.error(error)) //catches any errors

}) //Ending DELETE method

app.listen(process.env.PORT || PORT, ()=>{ //the servers listens for the specified port. port can be retrieved from the .env file or from the variable declaration above
    console.log(`Server running on port ${PORT}`) // console.log which port the server is running on
}) //closing Listen method