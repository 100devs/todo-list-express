// Make it possible to use express in our file 
const express = require('express');
// Setting a variable and assigning it to an instance of express
const app = express();
// Makes it possible to use methods associated w/ MongoClient and talk to our Db
const MongoClient = require('mongodb').MongoClient;
// Setting a variable to determine the port of the location where our server will be listening.
const PORT = 2121;
// allows us to look for variables inside the .env file
require('dotenv').config();

// declare a variable called db but not assigning a value
let db,
    // Declare a variable and assign to our database connection string to it
    dbConnectionStr = process.env.DB_STRING,
    // Declare a variable and assign the name of the database we will be using
    dbName = 'todo';

// Creating a connection to MongoDb, and passing in our connection string. Also passing in additional property (useUnifiedTopology)    
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // Waiting for connection, and proceeding if sucessful, and passing in all the client information
    .then(client => {
        // Console log the dbName "todo"
        console.log(`Connected to ${dbName} Database`);
        // Assign a value that contains a db client factory method to the db variable declared above. 
        db = client.db(dbName)
            // Close our then
    })

// Middleware!
// Sets ejs as the default render method
app.set('view engine', 'ejs')
    //sets the location for static assets
app.use(express.static('public'))
    // Tells express to decode and encode URLs where the header matches the content
app.use(express.urlencoded({ extended: true }))
    // Parses JSON content. 
app.use(express.json())

// Starts a GET  method when the root route is passed in, sets up req and res pararameters
app.get('/', async(request, response) => {
    //Sets a variable and awaits ALL items from the todos collection
    const todoItems = await db.collection('todos').find().toArray()
        // Sets a variable and awaits a count of unCompleted items to later display in EJS
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false })
        // Render EJS file and pass through the db items and the count remaining inside of an object
    response.render('index.ejs', { items: todoItems, left: itemsLeft });
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error));
})

// Starts a POST method when the addTodo route is passed in, sets up req and res pararameters
app.post('/addTodo', (request, response) => {
    //Sets a variable and inserts a new item into todos collection. Pass in thing value from the form request body, and pass in completed false
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false })
        // If insert is successful, do something
        .then(result => {
            // Console log "Todo added"
            console.log('Todo Added')
                // Gets rid of the /addTodo route and redirects to the homepage
            response.redirect('/')
        })
        // If error occurrs, console log error
        .catch(error => console.error(error))
})

// Starts a PUT method when the /markComplete route is passed in, sets up req and res pararameters
app.put('/markComplete', (request, response) => {
    //Look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
            // set completed status to true
            $set: {
                completed: true
            }
        }, {
            // Moves item to the bottom of the list
            sort: { _id: -1 },
            // Prevents insertion if item already exists
            upsert: false
        })
        // Starts a then if update was successful
        .then(result => {
            // console log the action that just occurred
            console.log('Marked Complete')
                // Sending a response back to the sender
            response.json('Marked Complete')
        })
        // If an erro occurs, console log the error
        .catch(error => console.error(error))

})

// Starts a PUT method when the /markUnComplete route is passed in, sets up req and res pararameters
app.put('/markUnComplete', (request, response) => {
    //Look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
            // set completed status to false
            $set: {
                completed: false
            }
        }, {
            // Moves item to the bottom of the list
            sort: { _id: -1 },
            // Prevents insertion if item already exists
            upsert: false
        })
        // Starts a then if update was successful
        .then(result => {
            // Sending a response back to the sender
            console.log('Marked inComplete')
                // Sending a response back to the sender
            response.json('Marked inComplete')
        })
        // If an error occurs, console log the error
        .catch(error => console.error(error))

})

// Starts a DELETE method when the /markDelete route is passed in, sets up req and res pararameters
app.delete('/deleteItem', (request, response) => {
    //Look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS })
        // Starts a then if update was successful
        .then(result => {
            // Sending a response back to the sender
            console.log('Todo Deleted')
                // Sending a response back to the sender
            response.json('Todo Deleted')
        })
        // If an error occurs, console log the error
        .catch(error => console.error(error))

})

// Setting up  which port we will be listening on - either the port from the .env file or the PORT variable we declared above
app.listen(process.env.PORT || PORT, () => {
    // Console log the port that the server is running on
    console.log(`Server running on port ${PORT}`)
})