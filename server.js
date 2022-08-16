// MODULES
const express = require('express'); // Require Express import
const app = express(); // Set app variable to Express so that you're starting an Express application
const MongoClient = require('mongodb').MongoClient; // Require MongoClient library import
const PORT = 2121; // Localhost port 2121
require('dotenv').config(); // Refer to .env file for hidden variables

let db, // Creates database
  dbConnectionStr = process.env.DB_STRING, // Sets dbConnectionStr variable to connection string provided by MongoDB - added in .env file
  dbName = 'todo'; // The database name is 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then( // Set connection to database. UseUnifiedTopology uses MongoDB driver's new connection management engine
  (client) => { // Responding with information about connection with client
    console.log(`Connected to ${dbName} Database`);  // logs to the console: `Connected to 'todo' Database` if connection is established
    db = client.db(dbName); // Set variable db to the 'todo' database when a connection is established
  }
);

// MIDDLEWARE
app.set('view engine', 'ejs'); // Use Embedded Javascript as the view engine for this app
app.use(express.static('public')); // Find all static files (images, css etc.) in a folder called 'public'
app.use(express.urlencoded({ extended: true })); // Middleware: makes sure incoming requests are not only seen as strings, but also any other object
app.use(express.json()); // / Middleware: makes sure requests with JSON are parsed as such

// ROUTES
app.get('/', async (request, response) => { // asyncronous GET request for root page: ask for stuff to display to users on the client side (in this case, index.ejs) using an asynchronous function
  const todoItems = await db.collection('todos').find().toArray(); // Find the documents in the todo database, turn it into an array of objects and assign to 'todoItems'
  const itemsLeft = await db // Constant for the items from the database that are specified in the next two lines
    .collection('todos') // From collection 'todos'
    .countDocuments({ completed: false }); // Counts the number of documents that have a completed status equal to 'false'
  response.render('index.ejs', { items: todoItems, left: itemsLeft }); // Response by rendering the found to do items and the items that are not yet completed to file index.js
  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))  // Using promises instead of async/await
});

app.post('/addTodo', (request, response) => { // Post request: add item to the database via route /addTodo
  db.collection('todos') // In database collection 'todos' something will be added - further specified on the next lines
    .insertOne({ thing: request.body.todoItem, completed: false }) // Add one document with property 'thing' set by the value from 'todoItem' in the request body, with a status of "completed" set to "false"
    .then((result) => { // If that went well:
      console.log('Todo Added'); // Log 'Todo Added' in the console
      response.redirect('/'); // Redirect to root page (where the item will now be rendered as part of the 'todos' database)
    })
    .catch((error) => console.error(error)); // If we weren't able to add anything to the database, we'll see an error message in the console
});

app.put('/markComplete', (request, response) => { // Put request: update item in the database via route /markComplete
  db.collection('todos') // In database collection 'todos' something will be updated - further specified on the next lines
    .updateOne( // Update a single document
      { thing: request.body.itemFromJS }, // Filtered based on the value set for property 'itemFromJS' in the request body
      {
        $set: { 
          completed: true, // Change status for "completed"" to "true" for the found document
        },
      },
      {
        sort: { _id: -1 }, // Then sort the array in descending order by id
        upsert: false, // Doesn't create a document for the todo if the item isn't found
      }
    )
    .then((result) => {  // If that went well:
      console.log('Marked Complete'); // Log "Marked Complete" in the console
      response.json('Marked Complete'); // Return JSON response containing "Marked Complete" to the fetch request that fired this route
    })
    .catch((error) => console.error(error)); // If something broke, an error is logged to the console
});

app.put('/markUnComplete', (request, response) => { // Put request: update item in the database via route /markUnComplete
  db.collection('todos') // In database collection 'todos' something will be updated - further specified on the next lines
    .updateOne( // Update a single document
      { thing: request.body.itemFromJS }, // Filtered based on the value set for property 'itemFromJS' in the request body
      {
        $set: {
          completed: false, // Change status for "completed"" to "false" for the found document
        },
        },
    ),
      {
        sort: { _id: -1 }, // Then sort the array in descending order by id
        upsert: false, // Doesn't create a document for the todo if the item isn't found
      }
    .then((result) => {  // If that went well:
      console.log('Marked Complete');  // Log "Marked Complete" in the console
      response.json('Marked Complete'); // Return JSON response containing "Marked Complete" to the fetch request that fired this route
    })
    .catch((error) => console.error(error)); // If something broke, an error is logged to the console
});

app.delete('/deleteItem', (request, response) => { // Delete request: delete item in the database via route /deleteItem
  db.collection('todos') // In database collection 'todos' something will be deleted - further specified on the next lines
    .deleteOne({ thing: request.body.itemFromJS }) // Delete a single document based on the value set for property 'itemFromJS' in the request body
    .then((result) => { // If that went well:
      console.log('Todo Deleted'); // Log "Todo Deleted" in the console 
      response.json('Todo Deleted'); // Return JSON response containing "Todo Deleted" to the fetch request that fired this route
    })
    .catch((error) => console.error(error)); // If something broke, an error is logged to the console
});

app.listen(process.env.PORT || PORT, () => {
  // Tells the server to listen for connections on the PORT we defined in the .env file. If not found, use earlier defined PORT constant.
  console.log(`Server running on port ${PORT}`); // logs to the console that the server is running and specifies on which port.
});
