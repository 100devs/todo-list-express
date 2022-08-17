const express = require('express') //intializing expresss use in this file
const app = express() // Saving express call to app variable
const MongoClient = require('mongodb').MongoClient //Allows access to use methods associated with MongoClient to talk to db
const PORT = 2121 // sets port constant - location for server to listen
require('dotenv').config() //allows access to var values inside env file


let db, // declaring global db var (does not assign val)
    dbConnectionStr = process.env.DB_STRING, // declaring var and assigning db connection string to it from .env
    dbName = 'todo' // declare var and set name of db (db > collections > documents)

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating connection to MongoDB and passing n connection string and additional property
    .then(client => { //MongoClient is a promise. then waits for connection and proceeds if successful, passing in client info
        console.log(`Connected to ${dbName} Database`)//Logs template literal for connected to todo Database
        db = client.db(dbName) // assigning value to previously declared var that contains db client factory method
    }) //closing .then
    
//middleware
app.set('view engine', 'ejs') //sets ejs as default renderer
app.use(express.static('public')) // Sets location for static assets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URLs where header matches content. Supports arrays and objects
app.use(express.json()) // parses json metjhods from incoming requests


app.get('/',async (request, response)=>{ // starts GET method when root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() // Sets var, awaits all items from todos coll
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets var and awaits count of incomplete items
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //Renders ejs file, passes db items and count remaining inside object

    // ** This is promise version as alternative to await. Diffs in error handling - async await would crash server if something went wrong, while promise would log error. Code has no error handling currently
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // starts POST method when /addTodo is passed in. Form input
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // Inserts new item into todos collection. Setting item to false or incomplete by default
    .then(result => { //if insert successful
        console.log('Todo Added') // console log 
        response.redirect('/') // gets rid of /addTodo route by going back home
    }) //closing .then
    .catch(error => console.error(error)) // catching errors
}) //ending POST block

app.put('/markComplete', (request, response) => { // starts put request when /markComplete is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Look in db for item matching name of item passed in from main.js (itsead of id. Better to use id)
        $set: { 
            completed: true // set completed status to true
          }
    },{
        sort: {_id: -1}, // moves item to bottom of list
        upsert: false // Prevents insertion if item does not already exist
    })
    .then(result => { // if update was successful
        console.log('Marked Complete') //Logging success
        response.json('Marked Complete') // Informing sender
    }) // ending then block
    .catch(error => console.error(error)) //error catch

}) // ending PUT

app.put('/markUnComplete', (request, response) => {// starts put request when /markUnComplete is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Look in db for item matching name of item passed in from main.js (itsead of id. Better to use id)
        $set: {
            completed: false // sets status incomplete (false)
          } // closing set block
    },{ // closing and opening set block
        sort: {_id: -1}, // send item to end of list
        upsert: false //prevents insertion if item does not already exist
    }) // closing set block
    .then(result => { // if update was successful
        console.log('Marked Complete') //Logging success
        response.json('Marked Complete') // Informing sender message
    }) // closing then
    .catch(error => console.error(error)) //error catch

}) //ending put

app.delete('/deleteItem', (request, response) => { // starts delete CRUD method
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // Uses deleteOne method. Looks inside todos coll for ONE item that has matching name for js file
    .then(result => { // starts then if delete successful
        console.log('Todo Deleted') //log successful deletion
        response.json('Todo Deleted') //send successful message to sender
    }) // close .then
    .catch(error => console.error(error)) // catches error

}) // closes delete block

app.listen(process.env.PORT || PORT, ()=>{ //setting up which port listening on - either the port from the .env or the PORT var
    console.log(`Server running on port ${PORT}`) //console.log running port
}) //end listen method