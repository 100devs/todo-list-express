const express = require('express') //make it possible to use express in this file
const app = express() // setting a constant and assigning it to the instand of express
const MongoClient = require('mongodb').MongoClient // setting a constant and make it possible to use methods associated w MongClient and talk to DB
const PORT = 2121 // setting a constant and assigning the location (PORT) where server will be listening
require('dotenv').config() //allows us to access variables inside the .env file


let db,//declaring a variable globally so we have access multi places, but not assiging a value
    dbConnectionStr = process.env.DB_STRING,//declare variable and assign DB connection string (look in env file and look variable called DB_STRING
    dbName = 'todo'//declaring variable and assiging name to the DB we'll use

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating connection to MongDB and passing in our connection string and an additonal property 
    .then(client => { //waiting for the connection and proceedign if successful, also passing in all the client information.  This is a next step to a promise that started on line 12
        console.log(`Connected to ${dbName} Database`)//console log a template literal connected to todo DB 
        db = client.db(dbName) //assigning a value to previous declared db variable that contains a db client factory method
    })//closing .then
    
//Middleware that opens communication cables    
app.set('view engine', 'ejs') // sets up ejs as defualt rendering method
app.use(express.static('public')) //sets location for static assests (like a plain HTML file, main.js, and additional style sheets)
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URLS where the header matches the content.  Supports arrays and objects
app.use(express.json()) //helps to parse json


app.get('/',async (request, response)=>{ //starts a GET method when the root route is passed in, sets up req and res params (the initial page load or a refresh)
    const todoItems = await db.collection('todos').find().toArray() //set a variable and awaits all items from the todos collecton (go to the todos collection and find everything then put it into an array)
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets variable and awaits a count of uncompleted items to later display in ejs (where completed is false and getting a number)
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //responds by rendering index.ejs and passing through db items and count remaining inside of an object 

    //Below is a classic promise with then statements.  Above is the fancier await
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) //close the get method

app.post('/addTodo', (request, response) => { //starts a POST method when the addTodo route is passed in on the URL (comes from the form, there is a matching action on the form)
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts new item to todos collection, gives it a completed value of false by default (comes from form input that has a name called todoItem. (completed is false and we want it displayed with no formatting)
    .then(result => { //if insert is successful, do something
        console.log('Todo Added') //console log action
        response.redirect('/') //response will redirect to home page
    })//close then statement
    .catch(error => console.error(error)) // catching and console any errors if the code does not execute
}) //close the POST

app.put('/markComplete', (request, response) => { //starts the PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on (updateONe then do something)
        $set: {
            completed: true //set completed status to true
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') // console log what's in parenthesis
        response.json('Marked Complete') // sending response back to sender
    }) //close .then
    .catch(error => console.error(error)) // catching and console any errors if the code does not execute

}) //end PUT

app.put('/markUnComplete', (request, response) => { //starts the PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on (updateONe then do something)
        $set: {
            completed: false //set completed status to false
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') // console log what's in parenthesis
        response.json('Marked Complete') // sending response back to sender
    })
    .catch(error => console.error(error)) // catching and console any errors if the code does not execute

}) //end PUT

app.delete('/deleteItem', (request, response) => { //starts the DELETE method when the deleteItem route is passed in
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //look inside todos collection for the ONE item that has a matching name from our JS file
    .then(result => { //starts a then if update was successful
        console.log('Todo Deleted') // console log what's in parenthesis
        response.json('Todo Deleted') // sending response back to sender
    })
    .catch(error => console.error(error)) // catching and console any errors if the code does not execute

}) //end DELETE

app.listen(process.env.PORT || PORT, ()=>{ //sets up specific PORT that we'll listen on. It grabs one from the .env file if one exists or uses the PORT we assigned
    console.log(`Server running on port ${PORT}`) //console log template literal with the variable PORT we assigned
}) //closes the listen