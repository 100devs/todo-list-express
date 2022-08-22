const express = require('express') // making it possible to use express in this file
const app = express() // setting a constant and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associate with MongoClient and to our DB
const PORT = 2121 // setting a constant to define the location where our server will be listening
require('dotenv').config() // allows us to look for variables inside of .env file

let db, // declaring a variable called db but not assign a value; declare as global to use in different places
    dbConnectionStr = process.env.DB_STRING, // declaring a varible and assigning our database connection string to it
    dbName = 'todo' // declaring a variable and assigning the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // creating connection to MongoDB, and passing in our connection string. Also passing in an additional property
    .then(client => {   // waiting for the connection and proceeding if successful, and passing in all the client info. Try/catch and async can also be used here.
        console.log(`Connected to ${dbName} Database`) // log to console a template literal 'connected to todo Database'
        db = client.db(dbName) // assigning a value to previously declared db variable that contains a db client factory method
    })
    
// middleware
app.set('view engine', 'ejs') // sets EJS as the default render method
app.use(express.static('public')) // sets location for static assets, js and css in this project
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json()) // parses JSON content


app.get('/',async (request, response)=>{ // starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() // sets a variable and awaits all items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // rendering EJS and passing through the db items and the count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
    // ABOVE COMMENTED OUT CODE DOES THE SAME AS ASYNC/AWAIT EXCEPT WITH PROMISE SYNTAX
}) // ending GET

app.post('/addTodo', (request, response) => { // starts a POST method when the addTodo route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts a new item into todos collection, gives it a completed value of false by default so it doesn't receive the class of .completed
    .then(result => { // if insert is successful, do something
        console.log('Todo Added') // log action
        response.redirect('/') // gets rid of the /addToDo route, and redirects back to the homepage
    })
    .catch(error => console.error(error))
}) // ending POST

app.put('/markComplete', (request, response) => { // starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the DB for one item matching the name of the item passed in from the main.js that was clicked on
        $set: {
            completed: true // set completed status to true
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => { // starts a then if update was successful
        console.log('Marked Complete') // logging successful completion
        response.json('Marked Complete') // sending a response back to the sender
    })
    .catch(error => console.error(error))

}) // ending PUT

app.put('/markUnComplete', (request, response) => { // starts a PUT method when markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the DB for one item matching the name of the item passed in from the main.js file that was clicked on 
        $set: {
            completed: false // set completed status to false
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => { // starts a then if update was successful
        console.log('Marked Complete') // logging successful completion
        response.json('Marked Complete') // sending a response back to the sender
    })
    .catch(error => console.error(error))
}) // ending PUT

app.delete('/deleteItem', (request, response) => { // starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // look inside the todos collection for ONE item that has a matching name from our JS file
    .then(result => { //starts a then if delete was successful
        console.log('Todo Deleted') //logging successful completion
        response.json('Todo Deleted') // sending a response back to the sender
    })
    .catch(error => console.error(error))
}) // ending DELETE

app.listen(process.env.PORT || PORT, ()=>{ // setting up which port we will be listening on - either the port from the .env file or the port variable we set
    console.log(`Server running on port ${PORT}`) // log the running port
})