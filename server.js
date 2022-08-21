const express = require('express'); // Allows us to use express in this file
const app = express(); // Assigns app with an instance of express
const MongoClient = require('mongodb').MongoClient; // Allows us to use methods associated with MongoClient and talk to our database
const PORT = 2121; // The port where our server will be listening
require('dotenv').config(); // Allows us to see variables inside of our .env file

let db,
  dbConnectionStr = process.env.DB_STRING, // Assigns dbConnectionStr with database connection string from the .env file
  dbName = 'todo'; // The name of our database

// Creates connection to MongoDB using our connection string and useUnifiedTopology makes it so that we use MongoDB driver's new connection management engine
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName); // gives us access to the data in our todo database
  }
);

// middleware
app.set('view engine', 'ejs'); // sets ejs as our view engine
app.use(express.static('public')); // sets public as the location for our static files
app.use(express.urlencoded({ extended: true })); // decode and encode URLs where header matches the content and extended: true supports arrays and objects
app.use(express.json()); // parses incoming JSON requests

// responds with index.ejs when a GET request is made to the homepage
app.get('/', async (request, response) => {
  const todoItems = await db.collection('todos').find().toArray(); // finds all the items in the todos collection and converts into an array
  const itemsLeft = await db
    .collection('todos')
    .countDocuments({ completed: false }); // counts all the items in the todos collection that aren't completed
  response.render('index.ejs', { items: todoItems, left: itemsLeft }); // sends a reponse that renders the index.ejs page and passes in todoItems and itemsLeft
  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
});

// adds item to todos collection when a POST request is made to /addTodo
app.post('/addTodo', (request, response) => {
  db.collection('todos')
    .insertOne({ thing: request.body.todoItem, completed: false }) // inserts the todoItem received from the request.body to the collection and sets completed to false by default
    .then((result) => {
      console.log('Todo Added');
      response.redirect('/'); // redirects back to the homepage once the item has been added to the collection (refreshes the page which triggers a GET request to the homepage)
    })
    .catch((error) => console.error(error)); // catches errors
});

// marks item from the todos collection as complete when a PUT request is made to /markComplete
app.put('/markComplete', (request, response) => {
  db.collection('todos')
    .updateOne(
      { thing: request.body.itemFromJS }, // updates the item that matches request.body.itemFromJS
      {
        $set: {
          completed: true, // sets the item's completed to true
        },
      },
      {
        sort: { _id: -1 }, // moves item to the bottom of the list
        upsert: false, // doesnt insert a new document if there is no match found
      }
    )
    .then((result) => {
      console.log('Marked Complete');
      response.json('Marked Complete'); // sends a reponse that says the item was marked as complete
    })
    .catch((error) => console.error(error)); // catches errors
});

// marks item from the todos collection as uncomplete when a PUT request is made to /markUnComplete
app.put('/markUnComplete', (request, response) => {
  db.collection('todos')
    .updateOne(
      { thing: request.body.itemFromJS }, // updates the item that matches request.body.itemFromJS
      {
        $set: {
          completed: false, // sets the item's completed to false
        },
      },
      {
        sort: { _id: -1 }, // moves item to the bottom of the list
        upsert: false, // doesnt insert a new document if there is no match found
      }
    )
    .then((result) => {
      console.log('Marked UnComplete');
      response.json('Marked UnComplete'); // sends a reponse that says the item was marked as uncomplete
    })
    .catch((error) => console.error(error)); // catches errors
});

// deletes a item from the todos collection when a DELETE request is made to /deleteItem
app.delete('/deleteItem', (request, response) => {
  db.collection('todos')
    .deleteOne({ thing: request.body.itemFromJS }) // deletes the item that matches request.body.itemFromJS
    .then((result) => {
      console.log('Todo Deleted');
      response.json('Todo Deleted'); // sends a reponse that says the item was deleted
    })
    .catch((error) => console.error(error)); // catches errors
});

// app listens either on port provided by .env or port 2121
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
