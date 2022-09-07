const express = require('express'); // use express js
const app = express(); // create new instance of an express application
const MongoClient = require('mongodb').MongoClient; // makes it possible to use methods associated with MongoClient and talk to our database
const PORT = 2121; // hosting our site at localhost:2121
require('dotenv').config(); // allows us to look for variables inside of the .env file

let db,
  dbConnectionStr = process.env.DB_STRING, // declaring our DB_STRING from .env file
  dbName = 'todo'; // declaring the name of our database

// creating a connection to MongoDB, and passing in our connection string
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  .then(client => { // waiting to proceed if connected succesfully, and passing in all client information
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName); // declaring db variable to our db client factory method
  });

// middleware
app.set('view engine', 'ejs'); // sets ejs as the default render method
app.use(express.static('public')); // sets the location for static asssets
app.use(express.urlencoded({ extended: true })); // Tells express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json()); // parses JSON content from incoming requests

// starts a GET method when the root route is passed in, sets up req and res params
app.get('/', async (request, response) => {
  // creates an array containing the documents (todos) in my collection (todo)
  const todoItems = await db.collection('todos').find().toArray();
  // creates a number of incomplete todos
  const itemsLeft = await db.collection('todos').countDocuments({ completed: false });
  // render index.ejs and pass in object containing todoItems and itemsLeft
  response.render('index.ejs', { items: todoItems, left: itemsLeft });

  // the code below is equal to the above code using promises instead of async await

  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
});

// starts a POST method when the addTodo route is passed in
app.post('/addTodo', (request, response) => {
  // look in the db to insert a new todo item into todos collection
  db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false })
    .then(result => {
      console.log('Todo Added');
      response.redirect('/'); // gets rid of the /addTodo route and redirects back to the homepage
    })
    .catch(error => console.error(error));
});

// starts a PUT method when the markComplete route is passed in
app.put('/markComplete', (request, response) => {
  // look in the db to update one item matching the item that was clicked on
  db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
    // set completed status to true
    $set: {
      completed: true
    }
  }, {
    // moves item to the bottom of the list (although this isnt working)
    sort: { _id: -1 },
    // prevents insertion if item doesnt exist
    upsert: false
  })
    .then(result => {
      console.log('Marked Complete');
      response.json('Marked Complete');
    })
    .catch(error => console.error(error));

});

// starts a PUT method when the markIncomplete route is passed in
app.put('/markIncomplete', (request, response) => {
  // look in the db to update one item matching the item that was clicked on
  db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
    // set completed status to false
    $set: {
      completed: false
    }
  }, {
    // moves item to the bottom of the list (although this isnt working)
    sort: { _id: -1 },
    // prevents insetion if item doesnt exist
    upsert: false
  })
    .then(result => {
      console.log('Marked Incomplete');
      response.json('Marked Incomplete');
    })
    .catch(error => console.error(error));

});

// starts a DELETE method when the deleteItem route is passed in
app.delete('/deleteItem', (request, response) => {
  // look in the db to delete one item matching the item that was clicked on
  db.collection('todos').deleteOne({ thing: request.body.itemFromJS })
    .then(result => {
      console.log('Todo Deleted');
      response.json('Todo Deleted');
    })
    .catch(error => console.error(error));

});

// setting up which port we will be listening on
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});