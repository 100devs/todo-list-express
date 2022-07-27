// imports 
const express = require('express') // importing express package
const app = express() // defining express function
const MongoClient = require('mongodb').MongoClient // import MongoClient
const PORT = 2121  // Declaring port for app to use
require('dotenv').config() // importing dotenv package


let db, // declaring db variable for use at line 16
    dbConnectionStr = process.env.DB_STRING, // declare and assign ConnectionStr to the DB_STRING used in .env(dotenv) file
    dbName = 'todo' // assigns the database collection 'todo' to the dbName variable

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connecting to the database with the ConnectionStr, useUnifiedTopology is to allow async/await but is deprecated
    .then(client => { // promise chain of the collections in the db cluster
        console.log(`Connected to ${dbName} Database`) // logs collection db name to the console
        db = client.db(dbName) // sets the db variable to the declared collection in the cluster
    })

    
// middleware 
app.set('view engine', 'ejs') // setting view engine to EJS for html templates
app.use(express.static('public')) // serve will automatically serve any files requested in the public folder
app.use(express.urlencoded({ extended: true })) // parses incoming requests with urlencoded payloads, transforms url query parameter into json object
app.use(express.json()) // parses incoming requests with json payloads - based on body-parser


app.get('/',async (request, response)=>{  // html get request aka READ - user requesting main route
    const todoItems = await db.collection('todos').find().toArray() // Grabs 'todos' collection in its entirety, converts it into an array, stores it in todoItems
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // Grabs all documents which have not been completed and stores them in itemsLeft
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // Renders index.ejs, passing in the variables items(equal to todoItems) and left(equal to itemsLeft) to the EJS file. The EJS file will use these variables in some way to determine the number, type, and content of HTML elements to create.
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // html post request aka CREATE - url/addTodo route 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // Insert a new todo document into the todos collection in the database, with the content of the todo determined by JSON data within the post request object.
    .then(result => {
        console.log('Todo Added') // after inserting document into the db, log it on server console
        response.redirect('/') // reload the main / route performing a get request
    })
    .catch(error => console.error(error)) // if insert fails with an error, log it to console
})

app.put('/markComplete', (request, response) => { // html put request aka UPDATE/ALTER - using the /markComplete route
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // connect to todos collection and update the parameter from the req.body
        $set: {     // set the item to complete
            completed: true         
        }
    },{
        upsert: false   // upsert inserts the query param to the database if its not found, in this case false - default is false/line not needed
    })
    .then(result => {                   // after completion
        console.log('Marked Complete')  // log to console
        response.json('Marked Complete') // send a json response with marked complete
    })
    .catch(error => console.error(error)) // error catching if put fails

})

app.put('/markUnComplete', (request, response) => {     // similar code as above 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => { // html delete request 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // connect to todos collection and delete the document passed in from delete request
    .then(result => {                   // after delete
        console.log('Todo Deleted')     // log it
        response.json('Todo Deleted')   // send json response
    })
    .catch(error => console.error(error))  // error exception

})

app.listen(process.env.PORT || PORT, ()=>{ // telling the app to listen for requests on a port provided by system or the port defined on line 6
    console.log(`Server running on port ${PORT}`) // log port number
})

// A node http.Server is returned, with this application (which is a Function) as its callback. 
// If you wish to create both an HTTP and HTTPS server you may do so with the "http" and "https" modules as shown here:
// var http = require('http') , https = require('https') , express = require('express') , app = express();
