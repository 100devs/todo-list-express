/*
========== ========== ========== ========== ==========
Shivakumar Mahakali, Saidat Rabiu, Chris Becker, Jordan Veloso, Kaleb Day, Billy Rodriguez
========== ========== ========== ========== ==========
*/

// Install node modules: Install and require Express
const express = require('express');
const app = express();

// Setting env variable for MongoDB
const MongoClient = require('mongodb').MongoClient;

// setting the port number --> start node server by "node server.js" --> navigate to localhost:PORT --> localhost:2121
const PORT = 2121;
require('dotenv').config();


// define the env file to store the connection information to MongoDB
let db;
let dbConnectionStr = process.env.DB_STRING;
let dbName = 'todo';

// async connection to the MongoDB: The promise return console logs successful connection.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // return of the promise object
    .then(client => {
        console.log(`Connected to ${dbName} Database`);
        db = client.db(dbName);
    })


// Set express settings to read EJS, and use JSON as the state of communication.
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Route to the main or landing page. This is what we are sending back as a response when a GET
// GET request, this is the READ request in the REST API
app.get('/', async (request, response) => {
    /*
    - create new variable called todoItems, go to the collection in MongoDB called "todos", get all of the items, and convert
        them into a JS Array.

    - Create variable called itemsLeft. Count the remaining documents, but set flag as finished as false. Store the item count
        into a variable into "itemsLeft".
    */
    const todoItems = await db.collection('todos').find().toArray();
    const itemsLeft = await db.collection('todos').countDocuments({completed: false});
    // This is the response to the user landing on the webpage /
    // We will send back the file index.ejs, and tell the engine to render that file as "HTML + JS".
    
    // We also pass in / bind variables: IN ejs we have 2 variables called items, and left. we BIND those variables to the variables
    // todoItems, and itemsLeft.
    response.render('index.ejs', { items: todoItems, left: itemsLeft });
    
    /*
    // manually use Promises for the data gathering and storing data into the variable todoItems
    db.collection('todos').find().toArray()
    .then(data => {
        db.collection('todos').countDocuments({completed: false});
        .then(itemsLeft => {
            response.render('index.ejs', { items: data, left: itemsLeft });
        })
    })
    .catch(error => console.error(error))
    */
})


// POST request, this is the Create for the REST API. In the HTML for the button click it is bound to a function "addTODO"
// The button click sends a POST request, express is listening for that request. We will respond as follows:
/*
    - Take the data that is entered into the <input> / <form> tag
    - We bind the data to a variable called "thing"
    - We route the data using Express
    - Go to the DB, look up a collection called "todos"
    - We will insert 1 object into the collection, this is the data from the form
    - Once we have entered data into the database, we will then redirect the user back to the home page /
    - Another GET request of the home page will occur, where all of the objects in the DB will be read and populated back into
        the EJS / HTML file, and re-rendered again.
*/
app.post('/addTodo', (request, response) => {
    // go to the Database, find a collection called "todos", insert in 1 data object
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        // print to the console
        console.log('Todo Added');

        // redirect the user back to the homepage where another GET request occurs.
        response.redirect('/');
    })
    .catch(error => console.error(error))
})


// PUT request, this is the UPDATE in the REST API
/*
    - When an update button is clicked this request is sent.
    - We receive the request, we first go to the DB and find a collection called "todos"
    - We update a entry in the database, this entry is provided and searched for by the variable called "thing" in EJS
        This variable is bound to a variable called itemFromJS in Express/Node. Set status to complete.
    - Once we have updated the value in the database, we will then sort the collection based on ID in decending order
*/
app.put('/markComplete', (request, response) => {
    // Update an entry in a collection called "todos"
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            // Set status complete to true
            completed: true
        }
    }, {
        // sort the DB in descending order
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        // console log the result
        console.log('Marked Complete');
        response.json('Marked Complete');
    })
    .catch(error => console.error(error))

    // page refresh ? . . . Yes page refresh is happening with the JS function when buttons are clicked.
    // page refresh is occuring due to location.reload()
    // GET request will occur.
})


// Another PUT request, this is the UPDATE in the REST API
/*
    - When an update button is clicked this request is sent.
    - We receive the request, we first go to the DB and find a collection called "todos"
    - We update a entry in the database, this entry is provided and searched for by the variable called "thing" in EJS
        This variable is bound to a variable called itemFromJS in Express/Node. Set status to uncomplete [complete=false].
    - Once we have updated the value in the database, we will then sort the collection based on ID in decending order
*/
app.put('/markUnComplete', (request, response) => {
    // Update an entry in a collection called "todos"
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            // Set status complete to false
            completed: false
        }
    }, {
        // sort the DB in descending order
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        // log the result
        console.log('Marked Complete');
        response.json('Marked Complete');
    })
    .catch(error => console.error(error))

    // page refresh ? . . . Yes page refresh is happening with the JS function when buttons are clicked.
    // page refresh is occuring due to location.reload()
    // GET request will occur.
})


// DELETE request, this is the DELETE in the REST API
/*
    - Delete request, occurs when the button to delete an entry is clicked.
    - Bind the variable of "thing" to "itemFromJS"
    - Go to the database, find a collection called "todos"
    - Delete an entry 
*/
app.delete('/deleteItem', (request, response) => {
    // go to databse, find collection called "todos"
    // delete 1 entry using the variable called "thing"
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        // log the result
        console.log('Todo Deleted');
        response.json('Todo Deleted');
    })
    .catch(error => console.error(error))

    // page refresh ? . . . Yes page refresh is happening with the JS function when buttons are clicked.
    // page refresh is occuring due to location.reload()
    // GET request will occur.
})


// Node / Express PORT configuration. Specify the PORT number manually through PORT variable or set the defualt PORT from Node
// in process.env.PORT
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
