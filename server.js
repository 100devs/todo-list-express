const express = require('express') //allows express to be used
const app = express() //assigns app variable to express
const MongoClient = require('mongodb').MongoClient
const PORT = 2121 //assigns port variable for port being used
require('dotenv').config() //dotenv - a zero-dependency module that loads env variables from the .env file

let db, //declare a variable of 'db'
    dbConnectionStr = process.env.DB_STRING, //DB_string is being pulled from .env file and assigned to 'dbConnectionStr'
    dbName = 'todo' //assigning 'todo' to dbName - the name of our database

MongoClient.connect(dbConnectionStr, { useNewUrlParser: true, useUnifiedTopology: true }) //runs MongoClient to connect to our db through our db string, useNewUrlParser: true allows users to fallback to old parser if there is an error.  useUnifiedTopology: true is to use Mongo's new connection management engine
 .then(client => { //this returns a promise - waiting for connecting and proceeding if it connects
        console.log(`Connected to ${dbName} Database`) //displays 'connected to todo database' if connection is successful
        db = client.db(dbName) //assigning value to above declared variable that contains a db client factory method
    }) //closing our then



app.set('view engine', 'ejs') //allows us render web pages using template files. So below we are setting the view engine to EJS 
app.use(express.static('public')) //this adds middleware for serving static files to your express app; makes it possible to access files from this folder via http. Public is where we are storing our style.css and js files.
app.use(express.urlencoded({ extended: true })) //a bit complicated but from what i gather, extended true allows us to parse nested JSON like objects and arrays.
app.use(express.json())//used to recognize incoming Request Objects as JSON Objects


app.get('/',async (request, response)=>{ //making a GET method from the root route, asyncronous function, and a request and a response parameter
    const todoItems = await db.collection('todos').find().toArray() //creates a variable of todoItems that goes to my todos db collection within the todo db, runs a find method to grab all my docs and makes my results into an array and stores it
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //goes through my todos collection, returns my count of documents that are NOT completed, hence the completed false, and assigns all data to itemsLeft variable
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //renders a response from the server that renders index.ejs, and displays our item data and how many items we have left
   // db.collection('todos').find().toArray() //this goes to my todos db collection within the todo db, runs a find method to grab all my docs and makes my results into an array
   // .then(data => { //the above code is creating a promise
       //  db.collection('todos').countDocuments({completed: false}) //goes through my todos collection, returns my count of documents that are NOT completed, hence the completed false
        // .then(itemsLeft => { //another promise
         //   response.render('index.ejs', { items: data, left: itemsLeft }) //renders a response from the server that renders index.ejs, and displays our item data and how many items we have left
       //  }) //closes out the nested .then
    // }) //closes out the parent .then
     //.catch(error => console.error(error)) //catch block, displays error to the console if there is one 
})

app.post('/addTodo', (request, response) => { //making a POST method that is triggered by addTodo route , and a request and a response parameter
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //goes into my todos db collection, inserts one document which comes from the value of the input.This is grabbed using .todoItem which is the name of the input. WE request that value from the body. We also make sure it only adds a document that is not complete
    .then(result => { //promise
        console.log('Todo Added') //displays 'Todo Added' to the console
        response.redirect('/') //the response from the server redirects us after to the root route
    }) //closes out the promise
    .catch(error => console.error(error)) //if we catch an error, displays it to the console
}) //closes out POST method

app.put('/markComplete', (request, response) => { //makes a PUT method that is triggered by markComplete route with request/response parameters
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // go into todos collection in my db, update one document from itemFromJS
        $set: {
            completed: true //sets completed status to true
          }
    },{
        sort: {_id: -1}, //this moves the item to the bottom of the list
        upsert: false //prevents insertion if the item doesnt already exist
    })
    .then(result => { //starts a then if update was unsuccessful
        console.log('Marked Complete') //displays 'mark complete' to the console
        response.json('Marked Complete') //sends a response back to server - feeds into 'data' variable
    }) //closes then block
    .catch(error => console.error(error)) //catches errors

})//closes out our PUT method

app.put('/markUnComplete', (request, response) => { //makes a PUT method that is triggered by markUnComplete route with request/response parameters
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // go into todos collection in my db, update one document named itemFromJS
        $set: {
            completed: false //sets completed status to false since we are reversing the complete
          } //closes out set
    },{
        sort: {_id: -1}, //this moves the item to the bottom of the list
        upsert: false //prevents insertion if the item doesnt already exist
    })
    .then(result => { //start a then
        console.log('Marked Complete') //displays 'mark complete' to the console
        response.json('Marked Complete') //sends a response back to server - feeds into 'data' variable
    })
    .catch(error => console.error(error)) //catches errors

}) //closes out markUnComplete PUT method

app.delete('/deleteItem', (request, response) => {  //makes a DELETE method that is triggered by deleteItem route with request/response parameters
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // go into todos collection in my db, delete one document with name itemFromJS
    .then(result => { //starts a then
        console.log('Todo Deleted') //if successful, logs 'Todo Deleted' to the console
        response.json('Todo Deleted') //send response back to server
    }) //close the then block
    .catch(error => console.error(error)) //catches errors

}) //closes the delete method

app.listen(process.env.PORT || PORT, ()=>{ //listens for a port we will be using
    console.log(`Server running on port ${PORT}`) //logs text literal to console if successful
}) //closes the listen