const express = require('express') //require express so we can use express in the file
const app = express() //set a constant and assign it to the express instance
const MongoClient = require('mongodb').MongoClient //make it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 //set a constant to define the location where our server will be listening
require('dotenv').config() //allows us to look for variables inside of the .env file


let db, //declare variable called db but do not assign a value
    dbConnectionStr = process.env.DB_STRING, //declare variable and assign our database connection string to it
    dbName = 'todo' //declare variable and assign name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //create connection to MongeDB, and pass in our connection string and pass in an additional property.
    .then(client => { //wait for connection. if successful, pass in all client information
        console.log(`Connected to ${dbName} Database`) //log a template literal "connected to todo Database" to the console
        db = client.db(dbName)  //asign a value to previously declare db variable that contains a db client factory method
    }) //close our .then function
    
app.set('view engine', 'ejs') //set EJS as the default render method
app.use(express.static('public')) //set location for static assets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json()) //parses JSON content from incoming requests


app.get('/',async (request, response)=>{ //start a GET method when the root route is passed in, set up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //set a variable and awaits for all items from the todo collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //set a varialbe and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //render EJS file and pass trhough the db items. Then count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) //close the GET method

app.post('/addTodo', (request, response) => { //starts a POST method when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item into todo collection, gives it a completed value of false by defualt
    .then(result => { //if insert is successful, do something
        console.log('Todo Added') //log the action to the console
        response.redirect('/') //gets rid of the /addTodo route, and redirects back to homepage
    }) //close the .then
    .catch(error => console.error(error)) //catches errors
}) //close the POST method

app.put('/markComplete', (request, response) => { //starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: { //
            completed: true //set completed status to true
          }
    },{
        sort: {_id: -1}, //move item to bottom of the list
        upsert: false //prevent insertion if item does not already exist
    })
    .then(result => { //start a then if update is successful
        console.log('Marked Complete') //log successful completion
        response.json('Marked Complete') //send a response back to the sender
    }) //close the .then function
    .catch(error => console.error(error)) //catch errors

}) //close the PUT method

app.put('/markUnComplete', (request, response) => { //start a PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passsed in from the main.js file that was clicked on
        $set: { 
            completed: false //set completed status to false
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts a then function if update is successful
        console.log('Marked Complete') //log successful completion
        response.json('Marked Complete') //send a response back to the sender
    }) //close .then
    .catch(error => console.error(error)) //catch errors 

}) //close PUT method

app.delete('/deleteItem', (request, response) => { //starts a delete method when delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //look inside the todo collection for the ONE item that has a matching name from our JS file
    .then(result => { //starts a then if delete was successful
        console.log('Todo Deleted') //logs successful completion
        response.json('Todo Deleted') //sending a response back to the sender
    }) //close .then
    .catch(error => console.error(error)) //catch errors

}) //close delete method

app.listen(process.env.PORT || PORT, ()=>{ //set up port which will listen on either the port from the .env file or specific port variable we set
    console.log(`Server running on port ${PORT}`) //log the running port to the console
}) //close the listen method