const express = require('express') // Making it possible to use express in this file
const app = express() // Setting a variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient // Makes it possible to use methods associated with Mongolient and talk to our DB
const PORT = 2121 // Setting a constant to define the location where we will be listening 
require('dotenv').config() // Allows us to look for variables inside of the .env file


let db, // declaring a variable db but not assigning a value
    dbConnectionStr = process.env.DB_STRING, // Declaring a variable and assigning our DB String to it 
    dbName = 'todo' // declaring a variable and assigning the name of the db we will be assinging

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // creating a connection to mongodb and passing in our connection string and passing in an additional property.
    .then(client => { // waiting for connection and proceeding if successful and passing in all of the client information
        console.log(`Connected to ${dbName} Database`) // log to the console a template literal 'connected to TODO database'
        db = client.db(dbName) // assigning a value to previously declared db variable that contains a db client factory method
    }) // Closing our .then
    
// Middleware
app.set('view engine', 'ejs') // Sets ejs as the default render method
app.use(express.static('public')) // Sets the locatino for static assets
app.use(express.urlencoded({ extended: true })) // Tells express to decode and encode URLS where th eheader matches the content.
app.use(express.json()) // Parses JSON content


app.get('/',async (request, response)=>{ // Starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() // sets variable and awaits ALL items from todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets variable and awaits count or number of uncompleted items to later display in EJS.
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // Rendering the EJS file and passing through the db items & the count remaining inside of an object.

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // Starts a post method when the addTodo method is passed in 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // Inserts a new item into todos gives it a completed value of false by default. 
    .then(result => { // If above is successful do something
        console.log('Todo Added') // console log action
        response.redirect('/') // Gets rid of add to do route and redirects to home page which triggers new get request
    }) // Closing the .then 
    .catch(error => console.error(error)) // catching errors
}) // ending the host 

app.put('/markComplete', (request, response) => {   // Start a Put (Update) method once the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Look in the database for one item matching the name of the item passed in from main.js file that was clicked on
        $set: {         
            completed: true // Setting completed value to true 
          }
    },{
        sort: {_id: -1}, // Sort in decending order
        upsert: false    // prevents insertion if an item does not already exist.
    })
    .then(result => {   // Starts a then if, update was successful
        console.log('Marked Complete')  // Logging successful completion 
        response.json('Marked Complete') // Sending a response back to the sender
    }) // closing .then
    .catch(error => console.error(error)) // catching errors

}) // ending put

app.put('/markUnComplete', (request, response) => { // Start a Put (Update) method once the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Look in the database for one item matching the name of the item passed in from main.js file that was clicked on
        $set: { 
            completed: false // set completed status to false 
          }
    },{
        sort: {_id: -1}, // Sort in decending order
        upsert: false // prevents insertion if an item does not already exist.
    })
    .then(result => {
        console.log('Marked Complete') // Logging successful completion 
        response.json('Marked Complete') // Sending a response back to the sender
    }) // closing .then
    .catch(error => console.error(error)) // catching errors

})// ending put

app.delete('/deleteItem', (request, response) => {  // Starts a delete method once the delete route is passed 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // looks inside todos collection for the one item that has a matching name from our js file 
    .then(result => { // starts a then IF the delete was succesful
        console.log('Todo Deleted') // logging successful completion 
        response.json('Todo Deleted')  // sending a response back to the sender
    }) // closing .then 
    .catch(error => console.error(error)) // catching errors 

}) // closes delete 

app.listen(process.env.PORT || PORT, ()=>{  // settng up which port we will be listening on -- either the port from the .env file or the port variable we set. 
    console.log(`Server running on port ${PORT}`) // console logs the running port
}) // closes the listen