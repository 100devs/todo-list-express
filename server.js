const express = require('express') // enables express methods in this project
const app = express() // invokes express and saves it to the 'app' variable
const MongoClient = require('mongodb').MongoClient // enables mongoDB methods via MongoClient
const PORT = 2121 // sets the variable that stores the number of the port that the server will listen to (2121)
require('dotenv').config() // requires use of a .env file that stores environment variables


let db, // declares variable 'db'
    dbConnectionStr = process.env.DB_STRING, // find DB_STRING in the .env file and assigns it to 'dbConnectionStr'
    dbName = 'todo' // stores the name of the database to variable 'dbName'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connects to mongoDB using our DB_STRING variable; passing a property:value pair
    .then(client => { // after connecting to DB, then run the following function on the client
        console.log(`Connected to ${dbName} Database`) // log a success message to the console
        db = client.db(dbName) // initializes the previous 'db' variable to the database name
    }) // close .then statement
    
app.set('view engine', 'ejs') // sets ejs as the default render method
app.use(express.static('public')) // sets the location of the static assets
app.use(express.urlencoded({ extended: true })) // tells express to only parse requests that match the Content-Type header
app.use(express.json()) // tells express to use json


app.get('/',async (request, response)=>{ // express method declaration to handle GET/READ requests, passing req and res parameters
    const todoItems = await db.collection('todos').find().toArray() // looks for items in the 'todos' database, set to an array, and set to 'todoItems' variable after an await
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // look for items in the 'todos' database and count the items that are not completed, then set to variable 'itemsLeft' after an await
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // render todoItems and itemsLeft into index.ejs into 'items' and 'left'
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) // closes the get method

app.post('/addTodo', (request, response) => { // defines express POST method, specifying a route '/addTodo'
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts one thing to the db, sets 'thing' to the form input 'todoItem' and 'completed' to 'false'
    .then(result => { // if successful, then runs a resulting action
        console.log('Todo Added') // logs "Todo Added" to the console
        response.redirect('/') // responds with a redirect to '/' to return back home from '/addTodo'
    }) // closes .then block 
    .catch(error => console.error(error)) // error catching, then console log the error if it exists
}) // closes the post method

app.put('/markComplete', (request, response) => { // defines express PUT method, specifying a route '/markComplete'
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // matches the 'itemFromJS' passed in from main.js to 'thing' as the property to update in the database
        $set: { // sets
            completed: true // completed value to 'true'
          } // closes the set
    },{// closes the update, opens next block
        sort: {_id: -1}, // sorts item to the bottom?
        upsert: false // prevents insertion if item does not exist
    })
    .then(result => { // if update was successful, then runs result
        console.log('Marked Complete') // logs "Marked Complete" to the console
        response.json('Marked Complete') // responds with json 'Marked Complete'
    }) // closes the .then block
    .catch(error => console.error(error)) // catch error block, logs error to the console

}) // closes the update

app.put('/markUnComplete', (request, response) => { // defines express PUT method, specifying a route '/markUnComplete'
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // matches the 'itemFromJS' passed in from main.js to 'thing' as the property to update in the database
        $set: { // sets
            completed: false // completed value to 'false'
          } // closes the set
    },{// closes the update, opens next block
        sort: {_id: -1}, // sorts item to the bottom?
        upsert: false // prevents insertion if item does not exist
    }) // closes the block
    .then(result => {  // if update was successful, then runs result
        console.log('Marked Complete') // logs "Marked Complete" to the console
        response.json('Marked Complete') // responds with json 'Marked Complete'
    }) // closes the .then block
    .catch(error => console.error(error)) // catch error block, logs error to the console

}) // closes the put method

app.delete('/deleteItem', (request, response) => { // defines express DELETE method, specifying a route '/deleteItem'
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // matches the 'itemFromJS' passed in from main.js to 'thing' as the property to delete in the database
    .then(result => { // if delete was successful, then runs result
        console.log('Todo Deleted') // logs "Todo Deleted" to the console
        response.json('Todo Deleted') // responds with json marked "Todo Deleted"
    }) // closes the .then block
    .catch(error => console.error(error)) // catch error block, logs error to the console

}) // closes the delete method

app.listen(process.env.PORT || PORT, ()=>{ // sets express to listen to the .env port if it exists OR to the variable PORT (2121)
    console.log(`Server running on port ${PORT}`) // logs the port number to the server
}) // closes the listen method