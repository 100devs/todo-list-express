const express = require('express'); // Load express
const app = express(); // Initialize express
const MongoClient = require('mongodb').MongoClient; // Loading mongodb module
const PORT = 2121; // Declaring a constant for the port number
require('dotenv').config(); // Load dotenv module to read from .env file

// Declaring variables for db (set to undefined), dbConnectionStr (set to process.env.DB_STRING, dbName (set to the string 'todo'))
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo';

// Connecting to Mongo, console logging when connected, setting db variable
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`);
        db = client.db(dbName);
    });

app.set('view engine', 'ejs'); //Setting view engine to EJS
app.use(express.static('public')); //set static files directory to public
app.use(express.urlencoded({ extended: true })); //set urlencoded to an object with a key extended and value true
app.use(express.json()); //parses incoming URL requests with JSON

// '/' home GET route
app.get('/', async (request, response) => {
    // get all todo items from the database and convert to an array
    const todoItems = await db.collection('todos').find().toArray();
    // get number of items left by counting documents with completed key set to false
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false });
    // render index.ejs template, passing in items and number of items left
    response.render('index.ejs', { items: todoItems, left: itemsLeft });
});

// add todo POST route
app.post('/addTodo', (request, response) => {
    // add todo passed into request using key thing and setting completed flag to false
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false })
        .then(result => {
            // Console log todo added
            console.log('Todo Added');
            // Redirect to home route
            response.redirect('/');
        })
        .catch(error => console.error(error)); // Console log error
});

// mark todo complete PUT route
app.put('/markComplete', (request, response) => {
    // update 'thing' todo and set completed key to true
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
        $set: {
            completed: true
        }
    }, {
        sort: { _id: -1 }, //sort items
        upsert: false
    })
        .then(result => {
            console.log('Marked Complete'); //log complete
            response.json('Marked Complete'); //send response 
        })
        .catch(error => console.error(error)); //log error

});

// mark todo incomplete PUT route
app.put('/markUnComplete', (request, response) => {
    //update thing todo, set completed to false
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
        $set: {
            completed: false
        }
    }, {
        sort: { _id: -1 },
        upsert: false
    })
        .then(result => {
            console.log('Marked Incomplete'); //log complete
            response.json('Marked Incomplete'); //send incomplete response
        })
        .catch(error => console.error(error)); //log error

});

// Delete item DELETE route
app.delete('/deleteItem', (request, response) => {
    // Delete one item matching thing from request object
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS })
        .then(result => {
            console.log('Todo Deleted'); // Log todo deleted
            response.json('Todo Deleted'); // Send todo deleted response
        })
        .catch(error => console.error(error)); // log error

});

// Set up server to listen for requests using PORT environment variable
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`); // Log that server is running
});