// Bringing in Express to be used in Node
const express = require('express');
// Assigning the running of express to app so that we can utilize it in our code
const app = express();
// Requiring the Mongoclient library from mongodb package
const MongoClient = require('mongodb').MongoClient;
// Set our PORT for our server to listen on so we don't use a magic number throughout our code (a random number that just appears)
const PORT = 2121;
// Require dotenv package to allow us to utilize a .env file to hold environmental variables (included in .gitignore)
require('dotenv').config();

// Setting 3 variables: db - currently undefined
// dbConnectionStr - set to DB_STRING from our .env file
// dbName to the name we created on MongoDB (mine is ToDoExpress).
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = 'todo';



// Use the MongoClient library to connect with our database via the previously defined dbConnectionStr. This is a promise, or asynchronous operation
//Topology is the way a network is connected, here we are selecting to use
//mongodb's simplified connection management engine
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
// When the promise resolves the resolved value is passed on as 'client'
// We console.log our connection to the database to double check we are connected
    console.log(`Connected to ${dbName} Database`);
// We set our previously instantiated variable db to the db value of client.
    db = client.db(dbName);
  }
);

// MIDDLEWARE: telling Express that we will be using the following helper software to provide functionality to our server/router
// Sets the view engine of our express server to ejs (embedded javascript) 
app.set('view engine', 'ejs');
// Tells express to look in the public folder whenever static files (.html, .css, .js, images, etc) are referenced in the codeblock
app.use(express.static('public'));
// Urlencoded: allows express to parse incoming requests, helps populate the body of the request with parsed data. Converts data into ASCII format
// the extended: true option is important to allow for a JSON-like experience with url-encoded data
app.use(express.urlencoded({ extended: true }));
// Parses incoming requests with JSON payloads, helps populate the request body with an object containing json
app.use(express.json());


//ROUTES: telling express to monitor for user requests of the indicated type (CRUD) and to the indicated url
// Handles the get (Read) request to our root url ('/') and our desired response to said request. Is asynchronous.
app.get('/', async (request, response) => {
  // Assigns the result of the promise initiated by the user's GET request to todoItems
  // Searching the connected database for a collection named 'todos'
  // Uses the .find() method to find documents (in this case all documents) in the collection
  // Uses the .toArray() method to create an array of those documents
  const todoItems = await db.collection('todos').find().toArray();
  // Assigns the result of the promise initiated by searching the connected database to itemsLeft
  // Searching the connected database for a collection named 'todos'
  // Uses the .countDocuments() method to find documents (in this case documents where the completed value is false) in the collection
  const itemsLeft = await db
    .collection('todos')
    .countDocuments({ completed: false });
  // Tells express to respond (send back to the browser) the rendering of the 'index.ejs' file in our public folder.
// Includes data for ejs to use in the rendering of the view, in this case
// items (set to the todoItems variable), and left (set to the itemsLeft variable)
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

// Handles the post (Create) request to the url ('/addTodo') and our desired response to said request. Is asynchronous.
app.post('/addTodo', (request, response) => {
// Indicates we are going to be doing something to our database, specifically the todos collection
  db.collection('todos')
// Uses the .insertOne() method to insert a new document into the database,
// includes the values for thing (taken from the request.body) and sets completed to false (this is a default value)
    .insertOne({ thing: request.body.todoItem, completed: false })
// Once the promise above has completed (the inserting one document)
    .then((result) => {
// Logs a message for the developer so that they know a todo has successfully been added
      console.log('Todo Added');
// Tells express to return the user to the root ('/') page and re-render the page to display the newly added document (redirects us to the GET request from above)
      response.redirect('/');
    })
// Handles a promise rejection if there is a problem with adding the document or connecting to our database by logging an error to the console (for developers only)
    .catch((error) => console.error(error));
});

// Handles the put (Update) request to the url ('/markComplete') and our desired response to said request. Is asynchronous.
app.put('/markComplete', (request, response) => {
  // Indicates we are going to be doing something to our database, specifically the todos collection
  db.collection('todos')
// Uses the .updateOne() method to update a document in our database
    .updateOne(
// Update the document where the thing property matches the itemFromJS value sent in our request body
      { thing: request.body.itemFromJS },
// Set the value of completed to true
      {
        $set: {
          completed: true,
        },
      },
// Sort the collection in descending value based on _id
      {
        sort: { _id: -1 },
// If you can't find the thing matching itemFromJS don't create it
        upsert: false,
      }
    )
// Once the above promise has resolved do the following
    .then((result) => {
// If the promise is fulfilled, tell the developer in the console that it has been marked complete
      console.log('Marked Complete');
// Send a response, in json form, back to indicate that the task is marked complete
      response.json('Marked Complete');
    })
// If the above promise is rejected console.error the error for the developer
    .catch((error) => console.error(error));
});


// Handles the put (Update) request to the url ('/markUnComplete') and our desired response to said request. Is asynchronous.
app.put('/markUnComplete', (request, response) => {
  // Indicates we are going to be doing something to our database, specifically the todos collection
  db.collection('todos')
    // Uses the .updateOne() method to update a document in our database
    .updateOne(
      // Update the document where the thing property matches the itemFromJS value sent in our request body
      { thing: request.body.itemFromJS },
      {
        // Set the value of completed to false
        $set: {
          completed: false,
        },
      },
      {
        // Sort the collection in descending value based on _id
        sort: { _id: -1 },
        // If you can't find the thing matching itemFromJS don't create it
        upsert: false,
      }
    )
    // Once the above promise has resolved do the following
    .then((result) => {
      // If the promise is fulfilled, tell the developer in the console that it has been marked complete
      // **WE SHOULD ACTUALLY BE SAYING IT IS MARKED UNCOMPLETE or INCOMPLETE **
      console.log('Marked Complete');
      // Send a response, in json form, back to indicate that the task is marked complete
      // **WE SHOULD ACTUALLY BE SAYING IT IS MARKED UNCOMPLETE or INCOMPLETE **
      response.json('Marked Complete');
    })
    // If the above promise is rejected console.error the error for the developer
    .catch((error) => console.error(error));
});


// Handles the delete (De-Le-Tey) request to the url ('/deleteItem') and our desired response to said request. Is asynchronous.
app.delete('/deleteItem', (request, response) => {
  // Indicates we are going to be doing something to our database, specifically the todos collection
  db.collection('todos')
    // Uses the .deleteOne() method to delete a document in our database
// This document's thing property should have the value itemFromJS passed in our request.body
    .deleteOne({ thing: request.body.itemFromJS })
// Once the above promise has fulfilled
    .then((result) => {
// Tell the developer that the todo has been deleted (via the console)
      console.log('Todo Deleted');
// Send a response, in json form, back to indicate that the task has been de-le-teyed
      response.json('Todo Deleted');
    })
// If the above promise is rejected, tell the developer via the console
// console.error the error message from the promise
    .catch((error) => console.error(error));
});

// Tells express to spin up a server to handle all the above route requests
// Tells express to use the PORT value supplied by the hosting platform via
// the environmental variables supplied by the platform or, if not supplied
// to the PORT variable set in the top of this code block
app.listen(process.env.PORT || PORT, () => {
// Tell the developer that the server is running and populate the message with
// the PORT variable
  console.log(`Server running on port ${PORT}`);
});
