// Importing required modules
const express = require('express'); // Importing Express framework
const app = express(); // Creating an Express application instance
const MongoClient = require('mongodb').MongoClient; // Importing MongoClient from MongoDB
const PORT = 2121; // Defining the port number
require('dotenv').config(); // Loading environment variables from .env file

// Database connection variables
let db,
    dbConnectionStr = process.env.DB_STRING, // Getting database connection string from environment variables
    dbName = 'todo'; // Setting the name of the database

// Connecting to MongoDB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // Connecting to MongoDB with the specified options
    .then(client => { // Handling successful connection
        console.log(`Connected to ${dbName} Database`); // Logging successful connection
        db = client.db(dbName); // Storing the database instance
    });

// Setting view engine and middleware
app.set('view engine', 'ejs'); // Setting EJS as the view engine
app.use(express.static('public')); // Serving static files from the 'public' directory
app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded request bodies
app.use(express.json()); // Middleware for parsing JSON request bodies

// Handling GET request for home page
app.get('/', async (request, response) => { // Handling GET requests to the root route
    const todoItems = await db.collection('todos').find().toArray(); // Retrieving todo items from the database
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false }); // Counting incomplete todo items
    response.render('index.ejs', { items: todoItems, left: itemsLeft }); // Rendering the 'index.ejs' template with data
});

// Handling POST request to add a todo item
app.post('/addTodo', (request, response) => { // Handling POST requests to the '/addTodo' route
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false }) // Inserting a new todo item into the database
        .then(result => { // Handling successful insertion
            console.log('Todo Added'); // Logging successful addition
            response.redirect('/'); // Redirecting to the home page
        })
        .catch(error => console.error(error)); // Handling errors
});

// Handling PUT request to mark a todo item as complete
app.put('/markComplete', (request, response) => { // Handling PUT requests to the '/markComplete' route
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, { // Updating a todo item to mark it as complete
        $set: {
            completed: true
        }
    }, {
        sort: { _id: -1 }, // Sorting by descending order of ID
        upsert: false // Not performing upsert (insert if not exists)
    })
        .then(result => { // Handling successful update
            console.log('Marked Complete'); // Logging successful completion
            response.json('Marked Complete'); // Sending JSON response
        })
        .catch(error => console.error(error)); // Handling errors
});

// Handling PUT request to mark a todo item as incomplete
app.put('/markUnComplete', (request, response) => { // Handling PUT requests to the '/markUnComplete' route
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, { // Updating a todo item to mark it as incomplete
        $set: {
            completed: false
        }
    }, {
        sort: { _id: -1 }, // Sorting by descending order of ID
        upsert: false // Not performing upsert (insert if not exists)
    })
        .then(result => { // Handling successful update
            console.log('Marked Incomplete'); // Logging successful marking as incomplete
            response.json('Marked Incomplete'); // Sending JSON response
        })
        .catch(error => console.error(error)); // Handling errors
});

// Handling DELETE request to delete a todo item
app.delete('/deleteItem', (request, response) => { // Handling DELETE requests to the '/deleteItem' route
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS }) // Deleting a todo item from the database
        .then(result => { // Handling successful deletion
            console.log('Todo Deleted'); // Logging successful deletion
            response.json('Todo Deleted'); // Sending JSON response
        })
        .catch(error => console.error(error)); // Handling errors
});

// Starting the server
app.listen(process.env.PORT || PORT, () => { // Starting the server on the specified port or the default port
    console.log(`Server running on port ${PORT}`); // Logging server startup
});
