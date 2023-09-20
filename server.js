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
  const itemsLeft = await db.collection('todos').countDocuments({ completed: false }); // create variable and awaits for an integer for the number of documents in 'todos' collection (mongodb method)
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

app.post('/addTodo', (request, response) => {
  db.collection('todos')
    .insertOne({ thing: request.body.todoItem, completed: false })
    .then((result) => {
      console.log('Todo Added');
      response.redirect('/');
    })
    .catch((error) => console.error(error));
});

app.put('/markComplete', (request, response) => {
  db.collection('todos')
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: true
        }
      },
      {
        sort: { _id: -1 },
        upsert: false
      }
    )
    .then((result) => {
      console.log('Marked Complete');
      response.json('Marked Complete');
    })
    .catch((error) => console.error(error));
});

app.put('/markUnComplete', (request, response) => {
  db.collection('todos')
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: false
        }
      },
      {
        sort: { _id: -1 },
        upsert: false
      }
    )
    .then((result) => {
      console.log('Marked Complete');
      response.json('Marked Complete');
    })
    .catch((error) => console.error(error));
});

app.delete('/deleteItem', (request, response) => {
  db.collection('todos')
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      console.log('Todo Deleted');
      response.json('Todo Deleted');
    })
    .catch((error) => console.error(error));
});

// Listen HTTP requests on the PORT assigned
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
