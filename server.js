// import express
const express = require('express');
// import mongodb
const MongoClient = require('mongodb').MongoClient;
// set up dotenv
require('dotenv').config();
// use express
const app = express();
// set default port
const PORT = 2121;
// initialize db variables
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = 'todo';

// connect to MongoDB database
MongoClient.connect(dbConnectionStr, {
  useUnifiedTopology: true,
}).then((client) => {
  console.log(`Connected to ${dbName} Database`);
  db = client.db(dbName);
});

// let express know to expect ejs as view engine
app.set('view engine', 'ejs');
// tell express to use static files inside the public folder
app.use(express.static('public'));
// replace bodyparser middleware, this is how express can parse JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// set up route for home page -> GET/Read
// is async because need to await req to mongodb for todo items
app.get('/', async (request, response) => {
  // search db for all todo items, put into an array
  const todoItems = await db.collection('todos').find().toArray();
  // count how many todos are not done
  const itemsLeft = await db
    .collection('todos')
    .countDocuments({ completed: false });
  // render the DOM using the index.ejs template, supplying the todoItems as items and itemsLeft as left
  response.render('index.ejs', { items: todoItems, left: itemsLeft });
});

// route to add a new todo item -> POST/Create
app.post('/addTodo', (request, response) => {
  // access the todos db collection
  db.collection('todos')
    // insert one item (as thing) using the form to set the body, hard coding whether it is completed as false
    .insertOne({ thing: request.body.todoItem, completed: false })
    // after the item is inserted (async)
    .then((result) => {
      // print to the console that the todo was added
      console.log('Todo Added');
      // tell the client to redirect back to the home page (essentially a refresh) to cause a new GET request
      response.redirect('/');
    })
    // if something goes wrong, print the error to the console
    .catch((error) => console.error(error));
});

// route to mark a todo as complete -> PUT/Update
app.put('/markComplete', (request, response) => {
  // access the todos db collection
  db.collection('todos')
    // update the first todo item found based on the todo text grabbed from the DOM on the client-side
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        // set its completed attribute to true
        $set: {
          completed: true,
        },
      },
      {
        // sort the items in descending order
        sort: { _id: -1 },
        // if no item found, do not add a new one
        upsert: false,
      }
    )
    .then((result) => {
      // print to the console that the item is marked complete
      console.log('Marked Complete');
      // respond to client that item marked complete
      response.json('Marked Complete');
    })
    // if something goes wrong, print error to console
    .catch((error) => console.error(error));
});

// route to mark a todo as uncompleted -> PUT/Update
app.put('/markUnComplete', (request, response) => {
  // access the todos db collection
  db.collection('todos')
    // update the first todo item found based on the todo text grabbed from the DOM on the client-side
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        // set its completed attribute to false
        $set: {
          completed: false,
        },
      },
      {
        // sort the items in descending order
        sort: { _id: -1 },
        // if no item found, do not add a new one
        upsert: false,
      }
    )
    .then((result) => {
      // print to the console that the item is marked uncompleted
      console.log('Marked Uncompleted');
      // respond to client that item marked uncompleted
      response.json('Marked Uncompleted');
    })
    // if something goes wrong, print error to console
    .catch((error) => console.error(error));
});

// route to remove a todo from the list -> DELETE/Dee-ley-tey
app.delete('/deleteItem', (request, response) => {
  // access the todos db collection
  db.collection('todos')
    // remove the first todo item found based on the todo text grabbed from the DOM on the client-side
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      // print to the console that the item was deleted
      console.log('Todo Deleted');
      // respond to client that item was deleted
      response.json('Todo Deleted');
    })
    // if something goes wrong, print error to console
    .catch((error) => console.error(error));
});

// tell the server where to listen
app.listen(process.env.PORT || PORT, () => {
  // print listening statement to console
  console.log(`Server running on port ${PORT}`);
});
