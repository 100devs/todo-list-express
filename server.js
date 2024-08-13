// Packages that will be used - express, mongoDb and dotenv (to read the .env file)
const express = require('express');
// To let me use express
const app = express();
// Only part of mongodb that is needed is the client, so just get that straight away
const MongoClient = require('mongodb').MongoClient;
// The port that will be used by the server
const PORT = 2121;
// No longer needed, can just pass in with --env-file=.env
require('dotenv').config();

// Variables all assigned in a single line.
// db is left unassigned because it will be assigned later when the connection has been made
// Connection string is read from the .env
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = 'todo';

// Uses a promise to connect to the DB. When connected, logs a message
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    // Assigns to the variable declared earlier
    db = client.db(dbName);
  }
);

// I want to use ejs to render
app.set('view engine', 'ejs');
// Middleware - public folder will hold my static files
app.use(express.static('public'));
// I am going to want to read data from forms
app.use(express.urlencoded({ extended: true }));
// I need to be able to read json that is passed in
app.use(express.json());

// On the home route
app.get('/', async (request, response) => {
  // Connect to the todos collection, find everything and get it back as an array so it can be parsed through
  const todoItems = await db.collection('todos').find().toArray();
  // Count how many results have completed set to false
  const itemsLeft = await db
    .collection('todos')
    .countDocuments({ completed: false });
  // Render the page using EJS, pass in the two values that I just got from the DB
  response.render('index.ejs', { items: todoItems, left: itemsLeft });

  // This is using regular promise logic - has a catch which is nicer - but is harder to read
  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
});

// Deals with a post request for a new todo to /addTodo
app.post('/addTodo', (request, response) => {
  // Connect to the todos collection, insert a new document with the todoItem taken from the body and set it to be not completed
  db.collection('todos')
    .insertOne({ thing: request.body.todoItem, completed: false })
    .then((result) => {
      // Got a response? Log that it has been added and redirect to / so the page can be re-rendered
      console.log('Todo Added');
      response.redirect('/');
    })
    // Handles errors by logging them to the console
    .catch((error) => console.error(error));
});

// A put request - used to update a record
app.put('/markComplete', (request, response) => {
  // Connect to the todos collection
  db.collection('todos')
    // To update a single document - find the one that matches the text passed in
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: true,
        },
      },
      //   If there are multiple documents that match the same body, match the first one and mark it complete
      {
        sort: { _id: -1 },
        upsert: false,
      }
    )
    // Return that it has been completed both in the console and by sending a json document back
    .then((result) => {
      console.log('Marked Complete');
      response.json('Marked Complete');
      //   This one doesn't do a redirect, the reloading is done client-side
    })
    // Error handling
    .catch((error) => console.error(error));
});

// A put to untick a task. Basically the opposite of the one above.
// Given duplication, could be a function call that takes in a boolean and pass that in to the $set operation
app.put('/markUnComplete', (request, response) => {
  db.collection('todos')
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        // This is the difference - set completed to false instead of true
        $set: {
          completed: false,
        },
      },
      //   It's the first one that matches that we want to mark incomplete
      {
        sort: { _id: -1 },
        // If the item doesn't exist, don't create a new one
        upsert: false,
      }
    )
    // When the promise has fulfilled
    .then((result) => {
      // Log to the console saying that it has been marked complete (this is a mistake - should say marked incomplete)
      console.log('Marked Complete');
      //   Also send a string to the client saying that it has been marked complete - it is not an object. Cleaner if eg {'message': 'marked incomplete'}
      response.json('Marked Complete');
    })
    // Error handling - log if there's an error
    .catch((error) => console.error(error));
});

// If there's a delete request sent to /deleteItem
app.delete('/deleteItem', (request, response) => {
  // Connect to the todos collection
  db.collection('todos')
    // Ask to deleteOne and use the filter of the text from the todo item that has been passed in
    .deleteOne({ thing: request.body.itemFromJS })
    // When that promise has been fulfilled
    .then((result) => {
      // Log to the console and pass a json back saying that the todo has been deleted
      console.log('Todo Deleted');
      response.json('Todo Deleted');
    })
    // Error handling - got an error? Log it
    .catch((error) => console.error(error));
});

// Start the server. Use the port in the .env file or the PORT defined above
app.listen(process.env.PORT || PORT, () => {
  // Log that the server is running
  console.log(`Server running on port ${PORT}`);
});
