// Assign the express module to the express variable
const express = require('express');
// Assign the express application to the variable 'app'
const app = express();
// Assign the mongoDB module to the MongoClient variable
const MongoClient = require('mongodb').MongoClient;
// Assign a PORT number to the PORT variable
const PORT = 2121;
// Call the config method on the imported dotenv module, loading the environment variables from the '.env' file into 'process.env'
require('dotenv').config();

// Declare three mutable variables. 'db' stores the DB class instance, 'dbConnectionStr' to store the connection string read from the DB_STRING env variable and dbName is the name of the database we want to use.
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = 'todo';

// Call the static 'connect' method on the 'MongoClient' class, passing the dbConnectionStr' and an options object with the 'useUnifiedTopology' property set to true to use the new Server Discover and Monitoring engine.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  // No callback provided. The connect method returns a Promise that will resolve to a "MongoClient" instance, so use the .then method to execute our callback with MongoClient.
  (client) => {
    // Console log the connection string, notifying the user that we are connected to the database.
    console.log(`Connected to ${dbName} Database`);
    // Assign the desired 'Db' instance - returned by the 'db' method on the 'MongoClient' instance - to the 'db' variable.
    db = client.db(dbName);
  }
);

// We use the .set method to ensure that we are using ejs as our view engine renderer.
app.set('view engine', 'ejs');
// We use the use method on the app object to use the serve-static middleware so that we will serve any files requested from the public folder.
app.use(express.static('public'));
// Add the 'body-parser' 'urlencoded' middleware to our express app
app.use(express.urlencoded({ extended: true }));
// Add the 'body-parser' 'json' middleware to our express app
app.use(express.json());

// Add a custom request handler to the GET method of the root '/' path
app.get('/', async (request, response) => {
  // Assign an array containing all of the 'todos' documents to the todoItems variable
  const todoItems = await db.collection('todos').find().toArray();
  // Assign any documents with the 'completed: false' property to the itemsLeft variable
  const itemsLeft = await db
    .collection('todos')
    .countDocuments({ completed: false });
  // Finally we send back a response with a rendering of our index.ejs. We assign "items" in our EJS to the todoItems variable and the "left" variable in our EJS file to the itemsLeft variable in our express
  response.render('index.ejs', { items: todoItems, left: itemsLeft });
});

// Add a custom request handler to the POST method of the '/addTodo' path. The route of the post request is '/addTodo' from the form on our index.ejs.
app.post('/addTodo', (request, response) => {
  // Access the 'todos' collection in our database and insert a new document to our 'todos' collection. The new documents 'thing' property will use the requests.body.todoItem and it's completed property will default to false.
  db.collection('todos')
    .insertOne({ thing: request.body.todoItem, completed: false })
    // When the Promise resolves we then log "Todo Added" to the console
    .then((result) => {
      console.log('Todo Added');
      // We refresh the page
      response.redirect('/');
    })
    // Any errors are console.error logged to the console.
    .catch((error) => console.error(error));
});

// Add a custom request handler for the PUT method of the "/markComplete" path
app.put('/markComplete', (request, response) => {
  // Access the todos collection and run the updateOne method on it. It uses the $set operator telling our database to change the completed property to true.
  db.collection('todos')
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: true,
        },
      },
      // Attempt to sort the document _id's descending to get the latest document first - this works because the `_id` is a `ObjectId` and these contain the second they were created encoded within them.
      {
        sort: { _id: -1 },
        upsert: false,
      }
    )
    // After the update is successful, redirect the user to the '/' path.
    .then((result) => {
      console.log('Marked Complete');
      response.json('Marked Complete');
    })
    // If this operation fails, then log the error to the console.
    .catch((error) => console.error(error));
});

// Add a custom request handler for the PUT method of the "/markComplete" path
app.put('/markUnComplete', (request, response) => {
  // Access the todos collection and run the updateOne method on it. It uses the $set operator telling our database to change the completed property to false.
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

// Add a custom request handler for the DELETE method of the "/deleteItem" path
app.delete('/deleteItem', (request, response) => {
  // We go to the database, find the "todos" collection
  db.collection('todos')
    // We run the deleteOne method on the thing that has the matching itemFromJS text
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      console.log('Todo Deleted');
      // We respond with "Todo Deleted" and we refresh the page.
      response.json('Todo Deleted');
    })
    // Console error log any errors
    .catch((error) => console.error(error));
});

// Setting the express js server to listen on the .env port or our PORT variable if one isn't provided.
app.listen(process.env.PORT || PORT, () => {
  // We log the fact that the server is running on the selected port
  console.log(`Server running on port ${PORT}`);
});
