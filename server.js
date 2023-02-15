const express = require('express') //declare a constant, make it possible to use express in this file
const app = express() //declare a constant, assign it to use express
const MongoClient = require('mongodb').MongoClient //declare a constant, make it possible to use methods associated with MongoClient to talk to MongoDB
const PORT = 2121 //declare a constant, set the location to where the server will be listening
require('dotenv').config() //access variables inside .env file


let db, //declare a variable (value not assigned)
    dbConnectionStr = process.env.DB_STRING, //declare a variable, assign to database connection string
    dbName = 'todo' //declare variable, assign to name of database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //create a connection to MongoDB, pass in connection string and additional property
    .then(client => { //wait for connection, proceed if successfull, pass in client information
        console.log(`Connected to ${dbName} Database`) //log to the console a template literal
        db = client.db(dbName) //assign a value to previously declared variable to contain a db client factory method
    }) //close .then
    
//Middleware
app.set('view engine', 'ejs') //set ejs as the default render method
app.use(express.static('public')) //set the location for static assets
app.use(express.urlencoded({ extended: true })) //tell express to decode and encode URLs where the header matches content (supports arrays and objects)
app.use(express.json()) //parse JSON content from incoming requests


app.get('/',async (request, response)=>{ //start a GET method when the root route is passed in, set up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //declare a constant to await all items from the "todos" collection, turn into array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //declare a constant to await a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //render EJS file and pass through the db items and the count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //start a POST method when the "addTodo" route is passed in, set up req and res parameters
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //insert a new item into "todos" collection, give a completed value of false by default
    .then(result => { //if insert is successful, do taskes below
        console.log('Todo Added') //console log action
        response.redirect('/') //redirect back to the root route (homepage)
    }) //close .then
    .catch(error => console.error(error)) //catch errors
}) //end POST method

app.put('/markComplete', (request, response) => { //start a PUT method when the "markComplete" route is passed in, set up req and res parameters
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in db for an item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: true //set completed status to true
          }
    },{
        sort: {_id: -1}, //move item to the bottom of the list
        upsert: false //prevent insertion if item does not exist
    })
    .then(result => { //if successful, do tasks below
        console.log('Marked Complete') //log to console
        response.json('Marked Complete') //send response back to sender
    }) //close .then
    .catch(error => console.error(error)) //catch errors
}) //end PUT method

app.put('/markUnComplete', (request, response) => { //start a PUT method when the "markUnComplete" route is passed in, set up req and res parameters
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in db for an item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false //set completed status to false
          }
    },{
        sort: {_id: -1}, //move item to the bottom of the list
        upsert: false //prevent insertion if item does not exist
    })
    .then(result => { //if successful, do tasks below
        console.log('Marked Complete') //log to console
        response.json('Marked Complete') //send response back to sender
    }) //close .then
    .catch(error => console.error(error)) //catch errors
}) //end PUT method

app.delete('/deleteItem', (request, response) => { //start a DELETE method when "deleteItem" route is passed in, set up req and res parameters
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //look in db for an item matching the name of the item passed in from the main.js file that was clicked on
    .then(result => { //if successful, do tasks below
        console.log('Todo Deleted') //log to console
        response.json('Todo Deleted') //send response back to sender
    }) //close .then
    .catch(error => console.error(error)) //catch errors
}) //end DELETE method

app.listen(process.env.PORT || PORT, ()=>{ //set up port to listen on, either the port from the .env file or the port variable set on server.js file
    console.log(`Server running on port ${PORT}`) //log to console
}) //close listen method