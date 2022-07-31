const express = require('express')  // making it possible to use express 
const app = express() // setting a constant and  assigning it to the indtance of expess
const MongoClient = require('mongodb').MongoClient  // makes it possible to use methods associated with MongoClient and talk to db
const PORT = 2121 // setting a constant to determine location where our server be listening
require('dotenv').config() // allows us to look for variables inside of the .env file


let db, // declare a  variable called db but not assign a value
    dbConnectionStr = process.env.DB_STRING, // declaring a variable and assigning our database connecting string to it
    dbName = 'todo' // declaring a variable and assigning the name of the database we will bw using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connecting to mdb, and passing in out connection string. Also passing in an additional property 
    .then(client => { // waiting for the connnection and proceeding if successful and passing in all the client information
        console.log(`Connected to ${dbName} Database`) // log to the console a template literal 'connected to todo database'
        db = client.db(dbName) // assinging a value to previously declared db variable that contains a db client factory method
    }) // closing .then 

// middleware   
app.set('view engine', 'ejs') // sets as the default render
app.use(express.static('public')) // sets the location for static assests
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode urls where the header matches the content. supports arrays and objects
app.use(express.json())  // parses json content from incoming  requests


app.get('/',async (request, response)=>{ // READ- responds to "/" route, request from the browser, response is what it sends back to client
    const todoItems = await db.collection('todos').find().toArray() // setting a variable and awaits all item from the todos collelctions
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // setting a variable and awaits a count of uncompleted items to later display in ejs
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //  rendering the ejs file and passing through the db items and the count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // starts a post method when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts a new item into todos collection, gives it a completed value of false by default
    .then(result => { // if insert is successful, do something
        console.log('Todo Added')  // console log action
        response.redirect('/') //gets rid of the /addTodo route and redirects back to the homepage
    }) //closing .then
    .catch(error => console.error(error)) // catching errors
}) //  end of the post

app.put('/markComplete', (request, response) => { // starts a put method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {  
            completed: true // set completed as true
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => { // stars a then if update was successful
        console.log('Marked Complete') // console log successful completion
        response.json('Marked Complete')  // send  a response back to the  sender
    }) // closing .then
    .catch(error => console.error(error)) // catching error

}) //ending put


app.put('/markUnComplete', (request, response) => { // starts a put method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false // set completed as false
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => { // stars a then if update was successful
        console.log('Marked Complete') // console log successful completion
        response.json('Marked Complete')  // send  a response back to the  sender
    }) // closing .then
    .catch(error => console.error(error)) // catching error
}) //ending put

app.delete('/deleteItem', (request, response) => { // starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // look inside the todos collection for the one item that has a matching name from our js file
    .then(result => { // starts a then if delete was successul
        console.log('Todo Deleted') // console log successful completion
        response.json('Todo Deleted')  // send  a response back to the  sender
    })  // closing .then
    .catch(error => console.error(error)) // catching error

}) //ending put

app.listen(process.env.PORT || PORT, ()=>{ // setting up which port we will be listening on - either the port from the .env or the port variable we set
    console.log(`Server running on port ${PORT}`) // console log the running port
}) // end of the listen method
