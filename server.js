// Imports the Express Framework - All tools needs to build a web server
const express = require('express');

// Creates a new Express application - Create the web server you will use
const app = express();

// Imports MongoDB Driver - Allows you to communicate with Database
const MongoClient = require('mongodb').MongoClient;

// Sets which port number your server will run on - Like choosing what door your website will use
const PORT = 2121;

// Loads enivroment variables from the .env file - This keeps sensitive info like database passwords secure
require('dotenv').config();

// Creates a variable 'db' that will hold your database connection later - currently empty
let db,
  // Gets your database connection string from your environment variables (.env file)
  // This is usually something like 'mongodb+srv://username:password@cluster.mongodb.net'
  dbConnectionStr = process.env.DB_STRING,
  // Names your database 'todo' - this is the specific database you'll be using in MongoDB
  dbName = 'todo';

// Starts connection to MongoDB using our connection string, with modern connection settings
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })

  // After successfully connecting, run this function with the database client
  .then((client) => {
    // Log a message confirming we've connected to our database
    console.log(`Connected to ${dbName} Database`);

    // Store the database connection in our db variable for later use
    db = client.db(dbName);
  });

// Tell Express to use EJS as the template engine for rendering our pages
app.set('view engine', 'ejs');

// Set up the 'public' folder to serve static files like CSS, images, and JavaScript
app.use(express.static('public'));

// Allow Express to handle form data submitted by users (like todo items)
app.use(express.urlencoded({ extended: true }));

// Allow Express to understand JSON data that's sent to the server
app.use(express.json());

// When someone visits the homepage ('/')
app.get('/', async (request, response) => {
  // Get all todo items from the database and convert them to an array
  const todoItems = await db.collection('todos').find().toArray();

  // Count how many uncompleted items are left (where completed = false)
  const itemsLeft = await db
    .collection('todos')
    .countDocuments({ completed: false });

  // Show the index.ejs page, passing in our todo items and count of items left
  response.render('index.ejs', { items: todoItems, left: itemsLeft });
});

// Handle POST requests to /addTodo when someone submits a new todo
app.post('/addTodo', (request, response) => {
  // Add a new todo item to our database 'todos' collection
  // 'thing' is the todo text, and set completed to false by default
  db.collection('todos')
    .insertOne({ thing: request.body.todoItem, completed: false })
    // After successfully adding the todo
    .then((result) => {
      // Log that we added a todo
      console.log('Todo Added');
      // Send the user back to the homepage
      response.redirect('/');
    })
    // If there's an error, log it to the console
    .catch((error) => console.error(error));
});

app.put('/markComplete', (request, response) => {
  db.collection('todos')
    .updateOne(
      { thing: request.body.itemFromJS },
      {
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

// Handle PUT requests to /markComplete when someone marks a todo as done
app.put('/markComplete', (request, response) => {
  // Find and update the todo in our database
  db.collection('todos')
    .updateOne(
      // Find the todo item that matches the text sent from our JavaScript
      { thing: request.body.itemFromJS },
      // Set its 'completed' status to true
      {
        $set: {
          completed: true,
        },
      },
      // Additional options for the update:
      // sort by newest first (-1), and don't create if not found (upsert: false)
      {
        sort: { _id: -1 },
        upsert: false,
      }
    )
    // After successfully marking as complete
    .then((result) => {
      // Log success message
      console.log('Marked Complete');
      // Send success response back to the browser
      response.json('Marked Complete');
    })
    // If there's an error, log it to the console
    .catch((error) => console.error(error));
});

// Handle DELETE requests to /deleteItem when someone wants to remove a todo
app.delete('/deleteItem', (request, response) => {
  // Delete the todo from our database 'todos' collection
  db.collection('todos')
    // Find and delete the todo that matches the text sent from our JavaScript
    .deleteOne({ thing: request.body.itemFromJS })
    // After successfully deleting the todo
    .then((result) => {
      // Log that we deleted the todo
      console.log('Todo Deleted');
      // Send success message back to the browser
      response.json('Todo Deleted');
    })
    // If there's an error, log it to the console
    .catch((error) => console.error(error));
});

// Start the server and make it listen for requests
app.listen(process.env.PORT || PORT, () => {
  // Use either the PORT from our environment variables (like Heroku provides)
  // OR use port 2121 (which we set earlier) if there's no environment variable

  // Log a message when the server successfully starts
  console.log(`Server running on port ${PORT}`);
});
