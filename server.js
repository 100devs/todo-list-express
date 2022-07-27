// Tools to be used:
const express = require('express'); // Requiring Express
// To make it easier to use, we assign to a variable
const app = express();
// To connect to the DB we use MongoAtlas
const MongoClient = require('mongodb').MongoClient;
// Declaring port to be used
const PORT = 2121;
// Requiring dotenv
require('dotenv').config();

let db, // Declaring an empty 'db' varible
  dbConnectionStr = process.env.DB_STRING, // a connection string variable that gets the string from .env or heroku variables
  dbName = 'todo'; // Declaring the name of the database to the the 'dbName' variable

// Connecting to the Database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);
// using Express to run some methods
app.set('view engine', 'ejs'); // setting up EJS
app.use(express.static('public')); // setting up Public folder to be static files
app.use(express.urlencoded({ extended: true })); // tells express to decode and encode URLs automatically
app.use(express.json()); // Tells express to use json()

// Responding to a get request to the '/' route
app.get('/', async (request, response) => {
  // Gertting to do items from the database
  const todoItems = await db.collection('todos').find().toArray();
  // getting items left from the database with the status of {False}
  const itemsLeft = await db
    .collection('todos')
    .countDocuments({ completed: false });
  // Sending over the variables todoItems and itemsLeft to EJS
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

// Responding to a POST (UPDATE) request to the '/addTodo' route
app.post('/addTodo', (request, response) => {
  // hitting the todo collection
  // Add an item inside
  db.collection('todos')
    .insertOne({ thing: request.body.todoItem, completed: false }) // Adds the todo item with the status of false
    // Console loggin that the todo list item was added, then telling client to refresh the page to home '/'
    .then((result) => {
      console.log('Todo Added');
      response.redirect('/');
    })
    .catch((error) => console.error(error));
});

app.put('/markComplete', (request, response) => {
  // Going into the database, collection 'todos', and finding a document that matches request.body.itemFromJS
  db.collection('todos')
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: true,
        },
      },
      {
        // Sorting by oldest first
        sort: { _id: -1 },
        // If the document does not exist, don't create a new one
        upsert: false,
      }
    )
    // if it works, console log Marked Complete
    .then((result) => {
      console.log('Marked Complete');
      response.json('Marked Complete');
    })
    // Otherwise provide error
    .catch((error) => console.error(error));
});

// Responde to a POST (UPDATE) request
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
      console.log('Marked Complete');
      response.json('Marked Complete');
    })
    .catch((error) => console.error(error));
});

// Responding to a DELETE (REMOVE) request
app.delete('/deleteItem', (request, response) => {
  db.collection('todos')
    .deleteOne({ thing: request.body.itemFromJS }) // Delete the one item that matches
    // Console loggin and responding to the client that is been deleted
    .then((result) => {
      // console log and Json respond with Todo Deleted
      console.log('Todo Deleted');
      response.json('Todo Deleted');
    })
    .catch((error) => console.error(error));
});

// listening for a port to run on
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
