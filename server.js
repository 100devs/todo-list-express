// Import and assign modules
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
// Set default PORT as 2121
const PORT = 2121;
// Import th dotenv module and call the config method, which reads from .env file nearby and adds them all to process.env
require('dotenv').config();

// declare db variable
// dbConnectionStr holds value of env var set up in .env as DB_STRING
// dbName holds the string "todo"
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = 'todo';

// Using connect method and passing dbConnectionStr
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);

// setting the templating engine to use ejs
app.set('view engine', 'ejs');
// setting the static files location to the public folder
app.use(express.static('public'));
// setting express urlencoded to enable express grab data from the form element by adding it to the request body property
app.use(express.urlencoded({ extended: true }));
// this allows us to be able to use express
app.use(express.json());

// GET request
app.get('/', async (request, response) => {
  // access collection called 'todos' from connected database and find all documents
  const todoItems = await db.collection('todos').find().toArray();
  // access collection named 'todos' from connceted database and get the count of all documents to match the filter
  const itemsLeft = await db
    .collection('todos')
    .countDocuments({ completed: false });
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

// use POST request to create items in the todo list
app.post('/addTodo', (request, response) => {
  // selecting our collection here and inserting one item
  db.collection('todos')
    .insertOne({ thing: request.body.todoItem, completed: false })
    .then((result) => {
      console.log('Todo Added');
      response.redirect('/');
    })
    .catch((error) => console.error(error));
});

// PUT request updating an item in the list
app.put('/markComplete', (request, response) => {
  db.collection('todos')
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        //$set operator from mongo to change the completed key to true
        $set: {
          completed: true,
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

// PUT request to update one item in the todo list
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

// Deletes a todo document from the collection
app.delete('/deleteItem', (request, response) => {
  db.collection('todos')
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      console.log('Todo Deleted');
      response.json('Todo Deleted');
    })
    .catch((error) => console.error(error));
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
