const express = require('express'); // Import express module
const app = express(); // To create an express application (object with methods)
const MongoClient = require('mongodb').MongoClient; // Require 'mongodb' package and get 'MongoClient' object and its methods
require('dotenv').config(); // allow us to look for environment variables inside the .env file

let db, // declare variable to use global
  dbConnectionStr = process.env.DB_STRING, // declaring a variable and assigning to our database string that is inside .env file
  dbName = 'todo'; // declare a variable dbName and assigning the name of our database that we set on mongodb

// Creating connection to mongodb and passing in our connection string
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then((client) => {
  // waiting for connection and proceeding if succesful, and passing in all client information
  console.log(`Connected to ${dbName} Database`); // log to console we're connected to our 'todos' database
  db = client.db(dbName); // reassigning value of db that contains
});

// Middlewares: methods between processing the request and sending the response in our app
app.set('view engine', 'ejs'); // setting ejs as the view engine, default render method
app.use(express.static('public')); // to serve any file we add on our public folder
app.use(express.urlencoded({ extended: true })); // tells express to decode and encode URLs where header matches content. Incoming request object as string or array
app.use(express.json()); // telling express to recognize the incoming request object as JSON object

// Listen to GET requests when the root route is passed in, sets up req and res parameters
app.get('/', async (request, response) => {
  const todoItems = await db.collection('todos').find().toArray(); // creates variable and awaits for all documents of the collection and transform the collection into an array (mongodb method)
  const itemsLeft = await db.collection('todos').countDocuments({ completed: false });
  response.render('index.ejs', { items: todoItems, left: itemsLeft }); // rendering the EJS file and passing the database items and count of documents (express method)
  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
});

// Listen to POST requests when the addTodo route is passed in (coming from the form action attribute), sets up req and res parameters
app.post('/addTodo', (request, response) => {
  console.log(request);
  db.collection('todos')
    .insertOne({ thing: request.body.todoItem, completed: false }) // insert a single document into our 'todos' collection. When sending the form the request comes with a lot of properties, body is one of them and the body is an object with what we send in the form. In this case we set the input name to 'todoItem' and add a default property of completed set to 'false'
    .then((result) => {
      // if insert is successful
      console.log('Todo Added'); // log action
      response.redirect('/'); // refresh to root so we can render the updated data and don't get stuck on /addTodos route
    }) // catching errors
    .catch((error) => console.error(error));
});

// Listen to PUT request when the /markComplete route is passed in from the fetch inside client side JS
app.put('/markComplete', (request, response) => {
  // look in the database collection for the item matching the name of the item passed (filter) and updates the document
  db.collection('todos')
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: true // if matches, set the completed property to 'true'
        }
      },
      {
        sort: { _id: -1 }, // moves item to the bottom of the list. when sort is -1 it sort descending
        upsert: false // upsert insert document if it doesn't exist, we want to prevent that so we set as 'false'
      }
    )
    .then((result) => {
      // if update was sucessful
      console.log('Marked Complete'); // log action
      response.json('Marked Complete'); // sending response back to the sender to resolve our fetch
    }) // catch error
    .catch((error) => console.error(error));
});

// Listen to PUT request when the /markUnComplete route is passed in from the fetch inside client side JS
app.put('/markUnComplete', (request, response) => {
  // look in the database collection for the item matching the name of the item passed (filter) and updates the document
  db.collection('todos')
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: false // if matches, set the completed property to 'true'
        }
      },
      {
        sort: { _id: -1 }, // moves item to the bottom of the list. when sort is -1 it sort descending
        upsert: false // upsert insert document if it doesn't exist, we want to prevent that so we set as 'false'
      }
    )
    .then((result) => {
      // if update was sucessful
      console.log('Marked Complete'); // log action
      response.json('Marked Complete'); // sending response back to the sender to resolve our fetch
    }) // catch error
    .catch((error) => console.error(error));
});

// Listen to DELETE requests when the /deleteItem route is passed
app.delete('/deleteItem', (request, response) => {
  // look inside the todos collection for the ONE item that has a matching name from our fetch and removes it from the collection
  db.collection('todos')
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      // if delete was sucessful
      console.log('Todo Deleted'); // log action
      response.json('Todo Deleted'); // sending a response back to the sender
    }) // catching errors
    .catch((error) => console.error(error));
});

// Listen HTTP requests on the PORT we are listening on our .env file or the port variable we set
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`); // logging the running PORT
});
