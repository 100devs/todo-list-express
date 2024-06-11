const express = require('express') //allowing the use of express in this file
const app = express() //assigning a constant variable to hold the express function
const MongoClient = require('mongodb').MongoClient //assigning a constant variable to hold the use of MongoClient and its associated methods to communicate with MongoDB and our db
const PORT = 2121 //assigning constant variable to hold the endpoint where our server will be 'listening'
require('dotenv').config() //allows the storage and use of variables that we do not want to appear in the main code file, inside the .env file 


let db, //declaring a global variable called db
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning it to our database connection string
    dbName = 'todo' //assigning a variable to hold the name of the database being used

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating connection to mongodb and passing our connection string, and an additional property useUnifiedTopology
    .then(client => {  //awaiting successful connection to db and when it is, passing in all the client info
        console.log(`Connected to ${dbName} Database`) //logging a template literal to the console to alert successful connection to db
        db = client.db(dbName) //assigning value of a db method to the previously declared db variable
    }) //closing .then block

//middleware    
app.set('view engine', 'ejs') //setting up ejs to be render method
app.use(express.static('public')) //setting up location for static assets 
app.use(express.urlencoded({ extended: true })) //instructing express to decode and encode urls where the header matches the content. Supports arrays and objects
app.use(express.json()) //parses json content from incoming requests


app.get('/',async (request, response)=>{ //starts a GET method when the root route is passed in, sets up request and response parameters
    const todoItems = await db.collection('todos').find().toArray() //assigns const variable to await the action of finding the db collection and putting into an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //assigns const variable to await the count of documents in the db that are not marked completed to later display in ejs
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //redering the ejs file and passing throught db items and count remaining inside an object 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) //closing GET method

app.post('/addTodo', (request, response) => { //starts a POST method when the add route is passed in 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //in the db todos, insert one item into the collection and passing in an object that gives it a completed value of false
    .then(result => { //if insert is successful, do the following
        console.log('Todo Added') //log todo added to console
        response.redirect('/') // reloading/redirecting to the root page
    }) //closing .then block
    .catch(error => console.error(error)) //error handling
}) //closing POST method

app.put('/markComplete', (request, response) => { //starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //in the db todos, update one document that matches the name of the item passed in from main.js file that was clicked on
        $set: {
            completed: true //set completed status to true
          }
    },{
        sort: {_id: -1}, //moves item to bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts .then if update was successful
        console.log('Marked Complete') //logging successful completion to console
        response.json('Marked Complete') //sending response back to sender
    }) //closing .then
    .catch(error => console.error(error)) //error handling

}) //closing PUT method

app.put('/markUnComplete', (request, response) => { //starts a PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //in the db todos, update one document that matches the name of the item passed in from main.js file that was clicked on
        $set: {
            completed: false //set completed status to false
          }
    },{
        sort: {_id: -1}, //moves item to bottom of list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts .then if update was successful
        console.log('Marked Complete') //logging successful completion to console
        response.json('Marked Complete') //sending response back to sender
    }) //closing .then
    .catch(error => console.error(error)) //error handling

})//closing PUT method

app.delete('/deleteItem', (request, response) => {//starts a DELETE method when the markUnComplete route is passed in
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //in the db todos, delete one document that matches the name of the item passed in from main.js file that was clicked on
    .then(result => { //starts .then if delete was successful
        console.log('Todo Deleted') //logging successful deletion to console
        response.json('Todo Deleted') //sending response back to sender
    }) //closing .then
    .catch(error => console.error(error)) //error handling
}) //closing DELETE method

app.listen(process.env.PORT || PORT, ()=>{ //setting up which port server will be listening on from either the .env file or the port variable 
    console.log(`Server running on port ${PORT}`) //logging the successful connection to the port
}) //closing listen method