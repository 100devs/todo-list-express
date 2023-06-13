const express = require('express'); // brings in the express npm package
const app = express(); // calls the express function and stores it in the app variable
const MongoClient = require('mongodb').MongoClient; // creates a new MongoClient instance for a database Will be used to connect to a cluster. Represents a thread safe pool of connections to a database
const PORT = 2121; // port and the server will be listening on
require('dotenv').config(); // brings in the dotenv package and allows you use variables in .env Allows you to keep certain variables secret

let db, // declare db for database
  dbConnectionStr = process.env.DB_STRING, // stores the connection string to the MongoClient in a var Comes from an env variable in the .env file
  dbName = 'todo'; // stores name of db

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // creates a connection to a MongoDB instance and returns the reference to the database. useUnifiedTopology opt in to using the MongoDB driver's new connection management engine.
  .then((client) => {
    // client instance aka db object is returned
    console.log(`Connected to ${dbName} Database`); // logs message

    db = client.db(dbName); // sets which db is being used in the cluster 'todo' is being used
  });

app.set('view engine', 'ejs'); // sets static template files view engine to ejs

app.use(express.static('public')); // serves static files such as css files, images, js files The files can be found in the public dir

app.use(express.urlencoded({ extended: true })); // middleware that parses requests with urlencoded payloads Creates a new body object on the request with holds the data in the request req.body

app.use(express.json()); // middleware body parser parses incoming requests with JSON payloads

app.get('/', async (request, response) => {
  // read route/endpoint for '/'
  const todoItems = await db.collection('todos').find().toArray(); // waits for a promise to return Data is retrieved from the todos collection The find method retrieves all  the todos and the toArrays places the documents into an array

  const itemsLeft = await db.collection('todos').countDocuments({ completed: false }); // returns the count of documents that match the query for a collection or view.

  response.render('index.ejs', { items: todoItems, left: itemsLeft }); // returns the rendered HTML of a view Sends the data to the ejs file to be plugged in and rendered

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
  // route handler for post aka create requests sent to .addTodo endpoint

  db.collection('todos') // connects to todos collection
    .insertOne({ thing: request.body.todoItem, completed: false }) // creates a new document which is a new todo
    .then((result) => {
      // promise returned from the db after adding todo
      console.log('Todo Added'); // logs a message
      response.redirect('/'); //after todo is successfully added to the db app redirects/refreshes the page which triggers a new get request and brings back the todos again including the newly created todo
    })
    .catch((error) => console.error(error)); // catch possible errors
});

app.put('/markComplete', (request, response) => {
  // route handler for put/update requests for the /markComplete endpoint
  db.collection('todos') // connects to todos collection
    .updateOne(
      // method to find document to update
      { thing: request.body.itemFromJS }, // filter the data and find correct document to update
      {
        $set: {
          // sets the document
          completed: true, // marks completed property on document obj to true
        },
      },
      {
        sort: { _id: -1 }, // sorts the documents by id in descending order
        upsert: false, // if no documents match a new document is not created
      }
    )
    .then((result) => {
      // promise returned from the db after updating a document
      console.log('Marked Complete'); // logs message
      response.json('Marked Complete'); // sends response back to client as json
    })
    .catch((error) => console.error(error)); // catch possible errors
});

app.put('/markUnComplete', (request, response) => {
  // route handler for put/update requests for the /markUnComplete endpoint
  db.collection('todos') // connects to todos collection
    .updateOne(
      // method to find document to update
      { thing: request.body.itemFromJS }, // filter the data and find correct document to update
      {
        $set: {
          // sets the document
          completed: false, // marks completed property on document obj to false
        },
      },
      {
        sort: { _id: -1 }, // sorts the documents by id in descending order
        upsert: false, // if no documents match a new document is not created
      }
    )
    .then((result) => {
      // promise returned from the db after updating a document
      console.log('Marked Complete'); // logs message
      response.json('Marked Complete'); // sends response back to client as json
    })
    .catch((error) => console.error(error)); // catch possible errors
});

app.delete('/deleteItem', (request, response) => {
  // route handler for delete requests for the /deleteItem endpoint
  db.collection('todos') // connects to todos collection
    .deleteOne({ thing: request.body.itemFromJS }) // method to delete document Obj inside is the filter to signify which doc to delete
    .then((result) => {
      // promise returned from the db after updating a document
      console.log('Todo Deleted'); // logs message
      response.json('Todo Deleted'); // sends response back to client as json
    })
    .catch((error) => console.error(error)); // catch possible errors
});

app.listen(process.env.PORT || PORT, () => {
  // sets up the server to listen on env variable port declared in /env file or port 2121
  console.log(`Server running on port ${PORT}`); // logs message to show server is running
});
