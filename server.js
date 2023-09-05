//import express and store it into a variable
const express = require('express');
//initializes express and stores express into a variable that can be used to create a server along with handling HTTP requests and responses
const app = express();
// imports mongodb and stores it into a variable to connect to a database and use operations on it
const MongoClient = require('mongodb').MongoClient;
//assigned a specific port that the server will listen on into a variable
const PORT = 2121;

//imports doenv which allows loading in a .env file. config() reads the .env file and sets up the variables inside of it.
require('dotenv').config();
// db declared without value, the connection string with an env variable, and the db name in a string value
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = 'todo';

//connecting to the mongodb client, using the db connection string and useUnifiedTopology is an option which helps with performance and stability with the network

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  // uses then promise to console log that connecting to the database was successful and assigning todo database name to db
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);

//sets the view engine to ejs so that express will use EJS as its template for dynamic HTML
app.set('view engine', 'ejs');
//allows static files to be used from the public folder for the client-side
app.use(express.static('public'));
//allows the app to handle form data parsing it into the request.body object and the extended true allows for complex objects to be in URL-encoded format.
app.use(express.urlencoded({ extended: true }));
//allows parsing of JSON data from clients into the the request.body to be readily used
app.use(express.json());

// get request handler function for the root url. async so that it can use await to wait for a promise. Takes a request and response variable for a incoming HTTP request and outgoing HTTP response
app.get('/', async (request, response) => {
  // retrieves data from the db todos collection and does not proceed until it is stored in the todoItems do to the await keyword
  const todoItems = await db.collection('todos').find().toArray();
  // retrieves data from the db todos collection that is not completed and then renders the index.ejs template passing in both the todoItems and itemsLeft as variables
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
// sets up a route handler for a HTTP POST request to the /addTodo with two parameter one requesting and responding with HTTP
app.post('/addTodo', (request, response) => {
  // inserts a new document to the todo collection in the database. the thing with its value and completed is set to false. after it is inserted there is a console log and a redirect to the root url
  db.collection('todos')
    .insertOne({ thing: request.body.todoItem, completed: false })
    .then((result) => {
      console.log('Todo Added');
      response.redirect('/');
    })
    //catches error and displays to console if one occurs
    .catch((error) => console.error(error));
});
// put/update request for the /markComplete route, includes a request and response variable
app.put('/markComplete', (request, response) => {
  // finds the thing value in the todo db and sets the completed value to true. it is then sorted in descending order based on id, upsert false means if no matching document is found it will not create a new one
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
    //console logs and responses with json as well marked complete
    .then((result) => {
      console.log('Marked Complete');
      response.json('Marked Complete');
    })
    //catches an error if it occurs
    .catch((error) => console.error(error));
});
// put/update request for the /markUnComplete route, includes a request and response variable
app.put('/markUnComplete', (request, response) => {
  // finds the thing value in the todo db and sets the completed value to false. it is then sorted in descending order based on id, upsert false means if no matching document is found it will not create a new one
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
    //console logs and responses with json as well marked complete
    .then((result) => {
      console.log('Marked Complete');
      response.json('Marked Complete');
    })
    //console logs an error if one occurs
    .catch((error) => console.error(error));
});
// sets up a a delete request handler for the /deleteitem endpoint with a req and res variable
app.delete('/deleteItem', (request, response) => {
  // accesses the db todos to find the thing value in the request body and deletes it. it then console log and sends JSON data that the todo was deleted
  db.collection('todos')
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      console.log('Todo Deleted');
      response.json('Todo Deleted');
    })
    //console logs error if there is one
    .catch((error) => console.error(error));
});
// server is set to listen for app object to start the server. Port number is either the environment variable PORT or the PORT set as the default. A console.log logs what port is used once ran
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
