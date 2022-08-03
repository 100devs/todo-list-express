const express = require('express'); // import express
const app = express(); // create an instance of express
const MongoClient = require('mongodb').MongoClient; // import mongodb
const PORT = 2121; // set the port
require('dotenv').config(); // import dotenv

let db, // create a variable to hold the database
  dbConnectionStr = process.env.DB_STRING, // get the db connection string from the .env file
  dbName = 'todo'; // set the database name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  // connect to the database
  (client) => {
    // if the connection is successful
    console.log(`Connected to ${dbName} Database`); // log the connection
    db = client.db(dbName); // set the database to the client db
  }
);

app.set('view engine', 'ejs'); // set the view engine to ejs
app.use(express.static('public')); // use the public folder
app.use(express.urlencoded({ extended: true })); // use express urlencoded
app.use(express.json()); // use express json

app.get('/', async (request, response) => {
  // get the home page
  const todoItems = await db.collection('todos').find().toArray(); // get the todo items
  const itemsLeft = await db // get the items left
    .collection('todos') // get the todos collection
    .countDocuments({ completed: false }); // count the documents that are not completed
  response.render('index.ejs', { items: todoItems, left: itemsLeft }); // render the index page with the todo items and the items left
});

app.post('/addTodo', (request, response) => {
  // make post request to the add todo route
  db.collection('todos') // get the todos collection
    .insertOne({ thing: request.body.todoItem, completed: false }) // insert the todo item
    .then((result) => {
      // if the insert is successful
      console.log('Todo Added'); // log the insert
      response.redirect('/'); // redirect to the home page
    })
    .catch((error) => console.error(error)); // catch any errors
});

app.put('/markComplete', (request, response) => {
  // make put request to the mark complete route
  db.collection('todos') // get the todos collection
    .updateOne(
      // update the todo item
      { thing: request.body.itemFromJS }, // set the query to the item from the body
      {
        $set: {
          // set the update to the completed field to true
          completed: true, // set the completed field to true
        },
      },
      {
        sort: { _id: -1 }, // sort the results by the id
        upsert: false, // don't create a new document if one doesn't exist
      }
    )
    .then((result) => {
      // if the update is successful
      console.log('Marked Complete'); // log the update
      response.json('Marked Complete'); // send a response
    })
    .catch((error) => console.error(error)); // catch any errors
});

app.put('/markIncomplete', (request, response) => {
  // make put request to the mark incomplete route
  db.collection('todos') // get the todos collection
    .updateOne(
      // update the todo item
      { thing: request.body.itemFromJS }, // set the query to the item from the body
      {
        $set: {
          // set the update to the completed field to false
          completed: false, // set the completed field to false
        },
      },
      {
        sort: { _id: -1 }, // sort the results by the id
        upsert: false, // don't create a new document if one doesn't exist
      }
    )
    .then((result) => {
      // if the update is successful
      console.log('Marked Complete'); // log the update
      response.json('Marked Complete'); // send a response
    })
    .catch((error) => console.error(error)); // catch any errors
});

app.delete('/deleteItem', (request, response) => {
  // delete item route
  db.collection('todos') // query the db for the item
    .deleteOne({ thing: request.body.itemFromJS }) // delete the item
    .then((result) => {
      // if successful
      console.log('Todo Deleted'); // log the success
      response.json('Todo Deleted'); // send a response
    })
    .catch((error) => console.error(error)); // if error, log the error
});

app.listen(process.env.PORT || PORT, () => {
  // start server and listen on port 2121
  console.log(`Server running on port ${PORT}`); // log the port
});
