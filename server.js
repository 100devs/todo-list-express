// Import express module
const express = require('express');
// Set express as app variable
const app = express();
// Import mongoDB module
const MongoClient = require('mongodb').MongoClient;
// Set PORT for development
const PORT = 2121;
// Import dotenv module to allow environment variables
require('dotenv').config();

// Declare empty variable db
let db,
  // Declare and assign MonogoDB url string to connect to remote DB
  dbConnectionStr = process.env.DB_STRING,
  // Set remote databse name as todo
  dbName = 'todo';

// Connecting to remote DB and pass option parameter to use a different server discovery and monitoring engine
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  // Promise chain and pass returned client into arrow function
  .then((client) => {
    // Log DB name to terminal if connection is successful
    console.log(`Connected to ${dbName} Database`);
    // Set empty variable to a new/existing database on remote server
    db = client.db(dbName);
  });

// Setting EJS as the JS templating to use which will generate html files that are sent to the client
app.set('view engine', 'ejs');
// Middleware for serving files requested from the public folder
app.use(express.static('public'));
// Middleware which allows you to use the url query parameters and pass objects to the server from the client side
app.use(express.urlencoded({ extended: true }));
// Middleware to parse incoming payloads to the server as JSON
app.use(express.json());

// Handling get request on the base route
app.get('/', async (request, response) => {
  // Getting all documents from the todos collection and assigning them to a variable as an array
  const todoItems = await db.collection('todos').find().toArray();
  // Getting the number of documents from the todos collection which have been marked completed false
  const itemsLeft = await db
    .collection('todos')
    .countDocuments({ completed: false });
  // Pass in the above variables to the EJS engine to be render into HTML files for the client.
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

// Handling PORT request to the /addTodo route
app.post('/addTodo', (request, response) => {
  // Create a new document in the todos collection passing in data from the request body
  db.collection('todos')
    .insertOne({ thing: request.body.todoItem, completed: false })
    // Promise chain to deal with the result returned from above
    .then((result) => {
      // Log to terminal that todo was added successfully
      console.log('Todo Added');
      // Send client back to the base route
      response.redirect('/');
    })
    // Handle error if the above request isn't successful. Log error to terminal.
    .catch((error) => console.error(error));
});

// Handling PUT request to the /markComplete route
app.put('/markComplete', (request, response) => {
  // updating one document in the todos collection, searching by the itemFromJS from the request body
  db.collection('todos')
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        // Using set operator to update item
        $set: {
          // Change item to 'complete'
          completed: true,
        },
      },
      {
        // sort all documents in collection in descending order by id
        sort: { _id: -1 },
        // If document is not found it will not be created if upsert is set to false
        upsert: false,
      }
    )
    // Promise chain to deal with the result
    .then((result) => {
      // Log marked complete to terminal
      console.log('Marked Complete');
      // respond to client with marked complete JSON
      response.json('Marked Complete');
    })
    // Deal with error if operation is not successful, log error to terminal
    .catch((error) => console.error(error));
});

// Handling PUT request to route /markUnComplete
app.put('/markUnComplete', (request, response) => {
  // Access the todos collection
  db.collection('todos')
    //   update one document from the collection
    .updateOne(
      // document to update is found via itemFromJS from the request body
      { thing: request.body.itemFromJS },

      {
        // Using set operator to update item
        $set: {
          // Change item to 'uncomplete'
          completed: false,
        },
      },
      {
        // sort all documents in collection in descending order by id
        sort: { _id: -1 },
        // If document is not found it will not be created if upsert is set to false
        upsert: false,
      }
    )
    // Promise chain to deal with the result
    .then((result) => {
      // Log marked complete to terminal
      console.log('Marked Uncomplete');
      // respond to client with marked complete JSON
      response.json('Marked Uncomplete');
    })
    // Deal with error if operation is not successful, log error to terminal
    .catch((error) => console.error(error));
});

// Handle DELETE request on the /deleteItem route
app.delete('/deleteItem', (request, response) => {
  // Access the todos collection
  db.collection('todos')
    //   Delete one document from the collection, find it via the itemFromJS passed in the request body
    .deleteOne({ thing: request.body.itemFromJS })
    // Promise chain and handle the result
    .then((result) => {
      // Log todo deleted to terminal
      console.log('Todo Deleted');
      // respond to client with todo deleted JSON
      response.json('Todo Deleted');
    })
    // Deal with error if operation is not successful, log error to terminal
    .catch((error) => console.error(error));
});

// listen on environment variable defined PORT or development PORT for request
app.listen(process.env.PORT || PORT, () => {
  // Log to terminal that server is running when the server is up and listening
  console.log(`Server running on port ${PORT}`);
});
