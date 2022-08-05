const express = require('express')  // allowing use of express in the file
const app = express()  // assigns use of express to app variable.  
const MongoClient = require('mongodb').MongoClient //MongoClient allows us to speak to our database at mongodb using methods from MongoClient. MongoClient capitalized cuz is a class.
const PORT = 2121  // all caps cuz global constants by convention are all caps. declaring wher our server will be listening for responses.
require('dotenv').config()  // allows us to look for variables inside the .env file. 

// The below are global variables
let db,   // declare db variable but not assigning a value yet. 
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning it our database connection string made in .env file 
    dbName = 'todo' // declaring variable that holds the name of the database we want to access. Mongodb gave us one cluster with multiple databases with multiple collections containing mutliple individual documents. 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //using a method of the MongoClient to connect to our database using our dbConnection string (password). Also passing in a property called useUnifiedTopology
    .then(client => { //do this stuff only if above connection successful/ waiting for connection
        console.log(`Connected to ${dbName} Database`) //console log a message
        db = client.db(dbName) // assigne predeclared db to response from MongoClient specifically its .db property as it relates to dbName. 
    })

// Middleware: facilitates communication between the database and client.
app.set('view engine', 'ejs') //ejs is our default render instead of html. 
app.use(express.static('public'))  //sets the location for static assets. 
app.use(express.urlencoded({ extended: true }))  //allows expres to encode urls where header matches content, extended:true supports arrays and objects. 
app.use(express.json())  //parses json content automatically. Don't need body-parser.

//Starts a get method on pageload "/" sups up req and res parameters
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()  //from todos collection in Todo database when received turn into array and assign to todoItems variable. 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable and waits for a response with count of uncompleted items to display on ejs file
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rednering ejs file and giving the db todoItems and itemsLeft
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {  //send data to mogodb when addTodo route activated
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // sends body (what was typed) of input text box called todoItem and inserts it into todos collection at todo database of Mongodb and gives the newly created document a completed property of false.
    .then(result => {  //if insert succesful
        console.log('Todo Added') //console log that a todo was added message
        response.redirect('/') // tell browser to refresh which lets us see item that was just added to database. Also lets us escape back to the root instead of staying on /addTodo path
    })
    .catch(error => console.error(error))  //catching errors
}) // end of app.post method

app.put('/markComplete', (request, response) => {  //.put means updating something in the database when /markComplete route is used.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{  //looks to update a "thing" in the "todos" collection whose value matches body of "itemFromJS"
        $set: {  //sets a property of the "thing" being looked at
            completed: true //the completed property of the document being looked at is set to true
          }
    },{
        sort: {_id: -1},  //moves item to bottom of the list.
        upsert: false   //stops databse from creating a new document if it cannot find one that has a value matching the body of itemFromJS
    })
    .then(result => { //if update was successful
        console.log('Marked Complete')  //logging message if app.put succesful
        response.json('Marked Complete') //send a json response to main.js code that is awaiting a response when it initiates an asynch markComplete function.
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => { // same as above but marking incomplete instead
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//looks to update a "thing" in the "todos" collection whose value matches body of "itemFromJS"
        $set: {
            completed: false //completed property of the document being looked at is set to false
          }
    },{
        sort: {_id: -1},  //moves item to bottom of the list.
        upsert: false  //stops databse from creating a new document if it cannot find one that has a value matching the body of itemFromJS
    })
    .then(result => {
        console.log('Marked Complete')  //logging message if app.put succesful
        response.json('Marked Complete')  //send a json response to main.js code that is awaiting a response when it initiates an asynch markUnComplete function.
    })
    .catch(error => console.error(error))  //catches errors and console logs them

})

app.delete('/deleteItem', (request, response) => {  //starts a delete method when /deleteItem route is chosen
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //from todo database look for collection called todos and delete a document from their whose thing value matches the value of a body from a text input called itemFromJS.
    .then(result => { //if delete succedded
        console.log('Todo Deleted') //console log message
        response.json('Todo Deleted')  // send response to waiting async function that started this /deleteItem path
    })
    .catch(error => console.error(error)) //catch errors

})

app.listen(process.env.PORT || PORT, ()=>{ //specifies on which port you will be listening fro reponses from the database. First check in .env file for a specified port if cannot find a value then default to port listed at the top of this file (2121)
    console.log(`Server running on port ${PORT}`)  //console lof a message saying which port is being used. 
})