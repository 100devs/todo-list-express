const express = require('express') // Sets up express for use in the server file
const app = express() // sets express to the 'app' variable for ease of use later on
const MongoClient = require('mongodb').MongoClient // Makes it possible to use methods associated with MongoDB and MongoClient talks to MongoDB
// MongoClient is a class
const PORT = 2121 // Sets the desired port to a PORT variable to define where the server will be listening
require('dotenv').config() // allows us to look for variables in the .env file


let db, // declaring a global variable called 'db' but not assigning it a value
    dbConnectionStr = process.env.DB_STRING, // declaring a variable and assigning our database connection string to it
    dbName = 'todo' // declaring a variable and assigning our database name to it

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // Creating a connection to MongoDB and passing in our connection string
    .then(client => { // Waiting for the connection and continuing if all client info is successfully passed
        console.log(`Connected to ${dbName} Database`) // Logs 'Connected to todo Database' to the console
        db = client.db(dbName) // assigns a value to the 'db' variable containing a db client factory method
    }) // closes our .then
    
app.set('view engine', 'ejs') // sets EJS as the default render method
app.use(express.static('public')) // sets the location for static assets (client side files such as main.js, styles.css and HTML)
app.use(express.urlencoded({ extended: true })) // Tells express to decode URLs where the header matches the content
app.use(express.json()) // tells express to parse JSON content from incoming requests


app.get('/',async (request, response)=>{ // starts a GET on the root route, also sets up request and response parameters
    const todoItems = await db.collection('todos').find().toArray() // Declares a variable and awaits all db objects from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // Declares a variable and awaits a count of uncompleted
    // items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // Renders an EJS file containing all relevant db items and the count of
    // uncompleted items and responds with the EJS file
    // *** Below code is same as above, but written in a different way ***
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) // closes our GET 

app.post('/addTodo', (request, response) => { // starts a POST method on the '/addTodo' route and sets up request/response params
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts a new item into the todos collection
    // then grabs the item from the form (todoItem) and sets the value of the completed property to 'false' by default
    .then(result => { // if the insert is successful, do this
        console.log('Todo Added') // console logs 'todo Added'
        response.redirect('/') // Responds that everything went ok and tells the client it should refresh
    }) // closes the .then
    .catch(error => console.error(error)) // catches errors and displays any to the console
})// closes the POST

app.put('/markComplete', (request, response) => { // Starts a PUT on the 'markComplete' route and sets up request/response params
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Looks in the DB for one item matching the name of the item passed in
        // from the main.js file after it was clicked on
        $set: { // Starts a new object
            completed: true // Sets the value of the completed property to 'true'
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion into db if item doesn't already exist
    })
    .then(result => { // Starts a then if the update was successful
        console.log('Marked Complete') // console logs 'Marked Complete'
        response.json('Marked Complete') // responds that the item was marked complete
    })
    .catch(error => console.error(error)) // Catches errors and logs any to the console

}) // Closes PUT

app.put('/markUnComplete', (request, response) => { // Starts a PUT on the 'markUnComplete' route and sets up request/response params
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Looks in the DB for one item matching the name of the item passed in
        // from the main.js file after it was clicked on
        $set: { // starts a new object
            completed: false // sets the value of the 'completed' property to 'false'
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion into db if item doesn't already exist
    })
    .then(result => { // starts a then if update was successful
        console.log('Marked Complete') // console logs 'Marked Complete'
        response.json('Marked Complete') // reponds that the item was marked complete
    }) // closes .then
    .catch(error => console.error(error)) // catches any errors and logs them to the console

}) // Closes PUT 

app.delete('/deleteItem', (request, response) => { // Starts a DELETE on the 'deleteItem' route and sets up request/response params
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // looks into the todos collection for one item that has a matching name
    // from our JS file
    .then(result => { // starts a then if the delete was successful
        console.log('Todo Deleted') // console logs 'Todo Deleted'
        response.json('Todo Deleted') // responds with 'Todo Deleted'
    }) // closes .then
    .catch(error => cosole.error(error)) // catches errors and logs any found to the console

}) // closes DELETE

app.listen(process.env.PORT || PORT, ()=>{ // Sets up the port that the server will be listening on 
    // either the PORT variable or the port defined in the .env file
    console.log(`Server running on port ${PORT}`) // console logs that the server is running and on which port
}) // closes LISTEN