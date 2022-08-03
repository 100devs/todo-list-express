const express = require('express') // making possible use express in this file
const app = express() // assigning express instance to the variable called app
const MongoClient = require('mongodb').MongoClient //makes it possible to use method associated with MongoClient and talk to our DB
const PORT = 2121 //setting variable where server will be listening
require('dotenv').config() //look for variable inside the .env file


let db, //declaring variable not assinging value 
    dbConnectionStr = process.env.DB_STRING, // declaring variable and assigning our database connection string from .env file
    dbName = 'todo' //declaring variable and assigning DB name which we using for this project

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to MongoDb and passing in our connection string
    .then(client => { //waiting for the connection and proceeding if successful ,and passing all client information
        console.log(`Connected to ${dbName} Database`) //log to console a template literal
        db = client.db(dbName) //assigning a value to db value that db client factory method
    }) //closing our then
    
app.set('view engine', 'ejs') //sets ejs as default render method
app.use(express.static('public')) //sets the location for static assets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URls where the header matches the content supports arrays and objects
app.use(express.json()) //Parses Json content from incoming requests


app.get('/',async (request, response)=>{ //starts GET method wheb root route is passed in,sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits all the items from todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable and awaits count of uncompleted items to later display in ejs
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering ejs file and passing the db items and count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) //closing get method

app.post('/addTodo', (request, response) => { //starts a POST method when addToDo route is passed
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts one new item into todos collection 
    .then(result => { //if insert is successful, do something
        console.log('Todo Added') //console log text
        response.redirect('/') //redirecting backs to the homepage
    }) //closing the then
    .catch(error => console.error(error)) //catching the error
}) //closing GET method

app.put('/markComplete', (request, response) => { //startring PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one time matching the name of the item passed in
        $set: {
            completed: true //set cmomplete status to true
          }
    },{
        sort: {_id: -1},//sorting the list
        upsert: false //prevent insertion if items doesn,t exist
    })
    .then(result => { //starting the done
        console.log('Marked Complete') //console logging Marked completed
        response.json('Marked Complete') //sending the response as json back
    }) //closing the then
    .catch(error => console.error(error)) //catching error

}) //closing PUT method

app.put('/markUnComplete', (request, response) => { //startring PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one time matching the name of the item passed in
        $set: {
            completed: false //set cmomplete status to false
          }
    },{
        sort: {_id: -1}, //sorting the list
        upsert: false //prevent insertion if items doesn,t exist
    })
    .then(result => {  //starting the done
        console.log('Marked Complete') //console logging Marked completed
        response.json('Marked Complete') //sending the response as json back
    })
    .catch(error => console.error(error))//catching error//catching error

}) //closing PUT method


app.delete('/deleteItem', (request, response) => { //startring DELETE method when the delete route is passed in
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //looking inside todos collection for the ONE item that has a matching name from our JS file
    .then(result => { //starts then if delete is successful
        console.log('Todo Deleted') // console log Todo Deleted
        response.json('Todo Deleted') //respond back with JSON to the sender
    }) //ending then
    .catch(error => console.error(error)) // catching error

}) //closing DELETE method

app.listen(process.env.PORT || PORT, ()=>{ //setting up which port will be listening on - either port from the .env file or the PORT variable we set
    console.log(`Server running on port ${PORT}`) //console.log the  running port
}) //end the listen method