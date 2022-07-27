const express = require('express');
const app = express();

// creates the mongoClient object
const MongoClient = require('mongodb').MongoClient;

// declaring PORT number for fallback if .env PORT isn't available
const PORT = 3000;

// will read your .env file, parse contents, assign it to process.env
// with no path option will default to file directory
require('dotenv').config();

// spread out the let declare, combining in one line is bad practice

// declare db in global scope because we need to get it from an async function
let db;

// string for mongo db connection, stored in .env file to keep private on public repo
let dbConnectionStr = process.env.DB_STRING;
let dbName = 'todo';

// connect to our database with the connect method that returns a promise
// useUnifiedTopology: true is an opt in option to use the new Topology Layer
// without useUnifiedTopology there will be a deprecation error
// this option is only required because we are in mongoDB 3.6.x, in current 4.8 mongo you don't need useUnifiedTopology
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    // creates a new DB instance sharing the current socket connections
    // pass in dbName to avoid the default
    // returns a promise
    db = client.db(dbName);
  }
);

// changes application setting for view engine to ejs
app.set('view engine', 'ejs');
// uses built in middleware function to serve static files in the public folder
app.use(express.static('public'));
// uses built in middleware function
// urlencoded means urls with %20 will be parsed as spaces
// extended true === use qs library for parsing
// https://www.npmjs.com/package/qs#readme
app.use(express.urlencoded({ extended: true }));
// uses built in middleware function to parse json and fill in the body property on the request object
app.use(express.json());
// express method, handles get request for the "/" endpoint from frontend
// using async middleware function to support calling to the database
app.get('/', async (request, response) => {
  // get all data in the todos collection
  // .collection returns a collection obeject
  // find - a collection method which creates a cursor for a query that can used to iterate over
  // toArray() is a cursor method - to convert the cursor to an array of all the info documents in the database
  const todoItems = await db.collection('todos').find().toArray();

  // parse over todos collection, countDocuments with the key/value pair of "completed: false"
  const itemsLeft = await db
    .collection('todos')
    .countDocuments({ completed: false });

  // send the index.ejs file to the frontend as the response
  // pass an object of items and left to use when building the html before serving back
  response.render('index.ejs', { items: todoItems, left: itemsLeft });
  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
});

// on form submit, the /addTodo endpoint is hit with a post method set
// this catches the post method
app.post('/addTodo', (request, response) => {
  // insert an object into the database collection
  db.collection('todos')
    // thing property populated from request.body.todoItem property
    // todoItem property comes from the name attribute on the input element in the form
    .insertOne({ thing: request.body.todoItem, completed: false })
    .then((result) => {
      console.log('Todo Added');
      // redirect the user to the / endpoint because the browser expects a response on post requests
      // this sends a 302 Found header to let the browser know the resource was added and there is a redirection response so look at Location header
      response.redirect('/');
    })
    // if there is any errors, logs here
    .catch((error) => console.error(error));
});

// express methods to catch put request from /markComplete endpoint
// markComplete fires when the item in the todo list is clicked by the user on the frontend
app.put('/markComplete', (request, response) => {
  // access "todos" collection
  db.collection('todos')
    // update single document in a collection => return promise
    // updateOne(filter, update, [option], [callback])

    .updateOne(
      // first argument we filter by just the "thing" property
      // this is how we select a document from the collection to update
      // if the request.body.itemFromJS matches a document in the collection its selected
      { thing: request.body.itemFromJS },
      // 2nd argument takes an update operator
      // $set operator replaces the value of a field with the specified value
      //  if the field doesn't exist, it will be created with that value.
      // field === key in JS
      {
        $set: {
          completed: true,
        },
      },
      // 3rd argument is the options for the updateOne
      // sort option is sorting by Database _id backwards to get the most recent value
      // upsert: false === if no document is found, don't create the document
      {
        sort: { _id: -1 },
        upsert: false,
      }
    )
    .then((result) => {
      console.log('Marked Complete');
      // send 'Marked Complete' to frontend as JSON
      response.json('Marked Complete');
    })
    // will catch and log any errors in the promise chain
    .catch((error) => console.error(error));
});

// express methods to catch put request from /markUnComplete endpoint
// markComplete fires when the item in the todo list is crossed out but the client clicks the item again to re-activate it
app.put('/markUnComplete', (request, response) => {
  // access "todos" collection
  // changes the complete field in database to false based on matching thing field with a backwards sort. meaning the latest item is picked
  db.collection('todos')
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: false,
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      }
    )
    .then((result) => {
      console.log('Marked Complete');
      // send 'Marked Complete' to frontend as JSON
      response.json('Marked Complete');
    })
    // will catch and log any errors in the promise chain
    .catch((error) => console.error(error));
});

// express methods to catch delete request from /deleteItem endpoint
app.delete('/deleteItem', (request, response) => {
  // access "todos" collection
  // return promise
  db.collection('todos')
    // .deleteOne(filter [, options, callback])
    // filter based on thing field matching request.body.itemFromJS value
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      console.log('Todo Deleted');
      // send "Todo Deleted" to frontend as JSON
      response.json('Todo Deleted');
    })
    // will catch and log any errors in the promise chain
    .catch((error) => console.error(error));
});

// listen starts a UNIX socket and listens for connections on the given path
// returns a http.server object
// passed in PORT server will listen too
// if there is a .env PORT variable set up it will be used otherwise, use default PORT
// http://localhost:3001/
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${process.env.PORT || PORT}`);
});
