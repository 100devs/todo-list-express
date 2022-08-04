const express = require('express') // making it possible to use express int his file
const app = express() // setting a varibale and assign it to the instance of express
const MongoClient = require('mongodb').MongoClient // makes it possible to use method associated with MongClient and talk to our DB
const PORT = 2121 // setting a varibale to determine the location where our server will be listening.
require('dotenv').config() // allows us to look for variables inside of the .env file


let db, // declaring a variable
    dbConnectionStr = process.env.DB_STRING, // declaring a vairable and assigning it our DB_STRING
    dbName = 'todo' // declaring a varibale and assigning it the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // Creating a connection to MongoDB and passing our connection string. and also passing an additional property
    .then(client => { //  waiting for the connection and proceeding if seccessful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`) // log to console a template literal 'connected todo Database'
        db = client.db(dbName) // assigning a value to previously declared db variable that contains our database.
    }) // closing our .then
    
// Middleware sets up the piepline for communication
app.set('view engine', 'ejs') // setting our view engine to use EJS
app.use(express.static('public')) // sets the location for static assets
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json()) // allows to parse to json


app.get('/',async (request, response)=>{ // starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() // sets varaibale and waits for collectio 'todos' from db and puts them in an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets varaibel and waits for collection 'db' and counts documents that have property completed set to false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // rendering the EJS file and passing the db items and the left count 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // starts a POST method when the add route is padded in 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts a new item into todos collection, gives it a complete value of false by default
    .then(result => { // if insert is successful, do something
        console.log('Todo Added') // console log action 
        response.redirect('/') // gets rid of the /addToDo route, and redirects back to the homepage
    }) // closing the .then
    .catch(error => console.error(error)) // catching erros
}) // ending the POST

app.put('/markComplete', (request, response) => { // starts a PUT method whent he markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the db for one item matching the name of the item passed in form the main.js file that was clicked on
        $set: {
            completed: true // set completed status to true
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => { // starts a then if update was successful
        console.log('Marked Complete') //logging successful completion
        response.json('Marked Complete') // sending a response back to the sender
    })
    .catch(error => console.error(error)) // catch errors

}) // end of PUT method

app.put('/markUnComplete', (request, response) => { // starts a PUT method when the markUncompleted route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the db for one item matching the name of the item passed in form the main.js file that was clicked on
        $set: {
            completed: false // set completed status to false
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => {
        console.log('Marked Complete') // starts a then if update was successful
const express = require('express') // making it possible to use express int his file
const app = express() // setting a varibale and assign it to the instance of express
const MongoClient = require('mongodb').MongoClient // makes it possible to use method associated with MongClient and talk to our DB
const PORT = 2121 // setting a varibale to determine the location where our server will be listening.
require('dotenv').config() // allows us to look for variables inside of the .env file


let db, // declaring a variable
    dbConnectionStr = process.env.DB_STRING, // declaring a vairable and assigning it our DB_STRING
    dbName = 'todo' // declaring a varibale and assigning it the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // Creating a connection to MongoDB and passing our connection string. and also passing an additional property
    .then(client => { //  waiting for the connection and proceeding if seccessful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`) // log to console a template literal 'connected todo Database'
        db = client.db(dbName) // assigning a value to previously declared db variable that contains our database.
    }) // closing our .then
    
// Middleware sets up the piepline for communication
app.set('view engine', 'ejs') // setting our view engine to use EJS
app.use(express.static('public')) // sets the location for static assets
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json()) // allows to parse to json


app.get('/',async (request, response)=>{ // starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() // sets varaibale and waits for collectio 'todos' from db and puts them in an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets varaibel and waits for collection 'db' and counts documents that have property completed set to false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // rendering the EJS file and passing the db items and the left count 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // starts a POST method when the add route is padded in 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts a new item into todos collection, gives it a complete value of false by default
    .then(result => { // if insert is successful, do something
        console.log('Todo Added') // console log action 
        response.redirect('/') // gets rid of the /addToDo route, and redirects back to the homepage
    }) // closing the .then
    .catch(error => console.error(error)) // catching erros
}) // ending the POST

app.put('/markComplete', (request, response) => { // starts a PUT method whent he markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the db for one item matching the name of the item passed in form the main.js file that was clicked on
        $set: {
            completed: true // set completed status to true
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => { // starts a then if update was successful
        console.log('Marked Complete') //logging successful completion
        response.json('Marked Complete') // sending a response back to the sender
    })
    .catch(error => console.error(error)) // catch errors

}) // end of PUT method

app.put('/markUnComplete', (request, response) => { // starts a PUT method when the markUncompleted route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the db for one item matching the name of the item passed in form the main.js file that was clicked on
        $set: {
            completed: false // set completed status to false
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => {// starts a then if update was successful
        console.log('Marked Complete') //logging successful completion
        response.json('Marked Complete') // sending a response back to the sender
    })
    .catch(error => console.error(error)) // catch errros

}) // end of PUT method

app.delete('/deleteItem', (request, response) => { // starsts a DELETE method when the delte route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // look inside the todos collection for the ONE item that has a matching name form our JS file
    .then(result => { // starts a then if delete was successful
        console.log('Todo Deleted') //logging successful completion
        response.json('Todo Deleted') // sending a response back to the sender
    }) // closing .then
    .catch(error => console.error(error)) // catching errors

}) // closing DELETE method

app.listen(process.env.PORT || PORT, ()=>{ // setting up which port we will be listening on - either the port form .env file or the port variable we set
    console.log(`Server running on port ${PORT}`) // console.log the running port
}) // closoing the listen method 