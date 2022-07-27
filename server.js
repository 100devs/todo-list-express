// import express package
const express = require('express');
// call the express function and store in variable
const app = express();
// import mongo client
const MongoClient = require('mongodb').MongoClient;
// Store port number
const PORT = 2121;
// import environment variable package and load .env file into process.env
require('dotenv').config();

// create database variables
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = 'todo';

// connect to db and use MongoDB driver's new connection management engine
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    // assign database name
    db = client.db(dbName);
  }
);

// sets the setting 'view engine' to the value 'ejs'
app.set('view engine', 'ejs');
// serve the public folder when the clients sends a GET request
app.use(express.static('public'));
// parses incoming URL-encoded data, such as form data
app.use(express.urlencoded({ extended: true }));
// parses incoming json requests
app.use(express.json());

// handle the client's GET request
app.get('/', async (request, response) => {
  // get all users in todos collection and convert to array
  const todoItems = await db.collection('todos').find().toArray();
  // count number of documents that are not marked completed
  const itemsLeft = await db
    .collection('todos')
    .countDocuments({ completed: false });
  // send data to template file for processing
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

// handle post/create request from client
app.post('/addTodo', (request, response) => {
  db.collection('todos')
    //   create a new document inside the todos collection
    .insertOne({ thing: request.body.todoItem, completed: false })
    .then((result) => {
      console.log('Todo Added');
      // direct user back to the root after POSTing
      response.redirect('/');
    })
    .catch((error) => console.error(error));
});
// handle put/update request from client
app.put('/markComplete', (request, response) => {
  // update a document that matches itemFromJS and only update the completed property
  db.collection('todos')
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: true,
        },
      },
      // sort by descending order
      // do not update or insert a new document
      {
        sort: { _id: -1 },
        upsert: false,
      }
    )
    // respond with json
    .then((result) => {
      console.log('Marked Complete');
      response.json('Marked Complete');
    })
    .catch((error) => console.error(error));
});
// handle PUT request for marking documents as incomplete
app.put('/markUnComplete', (request, response) => {
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
      console.log('Marked incomplete');
      response.json('Marked Complete');
    })
    .catch((error) => console.error(error));
});
// handle DELETE request
app.delete('/deleteItem', (request, response) => {
  // delete a document that matches the object data
  db.collection('todos')
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      console.log('Todo Deleted');
      response.json('Todo Deleted');
    })
    .catch((error) => console.error(error));
});
// Use the server to listen on the specified port
// Either use the server's env Port or our own specified port
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
