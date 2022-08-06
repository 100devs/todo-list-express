const express = require('express') // making it possible to use express in this file
const app = express() // setting a constant and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associated with MongoClient (which is a class) to talk to MongoDB
const PORT = 2121 // setting a constant to determine the location where our server will be listening
require('dotenv').config() // allows us to access variables inside the .env file


let db, // declaring a variable called db but not assigning a value - this positioned here to be a global variable
    dbConnectionStr = process.env.DB_STRING, // declaring a variable and assigning our database connection string to it
    dbName = 'todo' // declaring a variable and assigning the name of the database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // creating a connection to MongoDB and passing in the connection string. Also passing in an additional property.
    .then(client => { // MongoClient has established a promise with the connect method above, so we are waiting for the connection and proceeding if successful. Also passing in the client information. 
        console.log(`Connected to ${dbName} Database`) // logging template literal to the console "Connected to todo Database"
        db = client.db(dbName) // assigning a value to a previously declared db variable that contains a db client factory method
    }) // closing our .then

// middleware which helps open the communication channels for our requests    
app.set('view engine', 'ejs') // sets ejs as the default render method
app.use(express.static('public')) // sets the location for static assets (css and js or html if applicable)
app.use(express.urlencoded({ extended: true })) // Tells express to decode and encode URL's automatically where the header matches the content. Supports arrays and objects.
app.use(express.json()) // parses JSON content from incoming requests


app.get('/',async (request, response)=>{ // starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() // sets a variable and awaits all items from the todos collection and makes an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets a variable and awaits a count of the tasks that are uncompleted, to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // rendering the EJS file and passing through the db items and the count remaining inside of an object.
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // starts a POST method when the route is passed in 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts a new item into todos collection, sets up an object with two key/value pairs, gives a completed value of false by default
    .then(result => { // if insert is successful, do something
        console.log('Todo Added') // console log action
        response.redirect('/') // gets rid of the /addTodo route redirects user back to the index route
    }) // closing .then block
    .catch(error => console.error(error)) // catching errors
}) // ending the POST

app.put('/markComplete', (request, response) => { // starts a PUT method when the /markComplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the db for one item matching the name of the item passed from the main.js that was clicked on (better to use the unique id that is in the database rather than a name, to avoid possible issues with duplicate names), also starting a new object
        $set: { 
            completed: true // set completed status to true
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list (this may not be needed)
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => { // starts a then if update was successful
        console.log('Marked Complete') // logging successful completion
        response.json('Marked Complete') // sending a response back to the sender
    }) // closing .then block
    .catch(error => console.error(error)) // catching errors

})// ending put

app.put('/markUnComplete', (request, response) => { // starts a PUT method when the /markUnComplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the db for one item matching the name of the item passed from the main.js that was clicked on (better to use the unique id that is in the database rather than a name, to avoid possible issues with duplicate names), also starting a new object
        $set: {
            completed: false // set completed status to true
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list (this may not be needed)
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => { // starts a then if update was successful
        console.log('Marked Complete') // logging successful completion
        response.json('Marked Complete') // sending a response back to the sender
    }) // closing .then block
    .catch(error => console.error(error)) // catching errors

}) // ending put method

app.delete('/deleteItem', (request, response) => { // starts a DELETE method when the /deleteItem route is passed in 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // look in the db for one item matching the name of the item passed from the main.js that was clicked on (better to use the unique id that is in the database rather than a name, to avoid possible issues with duplicate names), also starting a new object
    .then(result => { // starts a then if the delete was successful
        console.log('Todo Deleted') // logging successful completion
        response.json('Todo Deleted') // sending a response back to the sender
    }) // closing .then block
    .catch(error => console.error(error)) // catching errors

}) // ending delete method

app.listen(process.env.PORT || PORT, ()=>{ // setting up which port we will be listening on and either uses the one in the .env file or the one specified in the PORT constant
    console.log(`Server running on port ${PORT}`) // console.log the running port using template literal syntax
}) // ending listen method