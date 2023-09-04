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

app.get('/', async (request, response) => {
  const todoItems = await db.collection('todos').find().toArray();
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

app.put('/markUnComplete', (request, response) => {
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

app.delete('/deleteItem', (request, response) => {
  db.collection('todos')
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      console.log('Todo Deleted');
      response.json('Todo Deleted');
    })
    .catch((error) => console.error(error));
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
