// Gives server access to Express and appoints it to the app
const express = require('express');
const app = express();
// Gives server access to MOngoDB collection
const MongoClient = require('mongodb').MongoClient;
// Appoints a specific port channel for page to be run on locally
const PORT = 2121;
// Allows for data to be secretly stored in .env file
// Able to access and use .env file contents
require('dotenv').config();

// Declares database and its name. Also declares connection string which is be stored in .env
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = 'todo';

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);
// Middleware
// tell app to render ejs
app.set('view engine', 'ejs');
// render static files from public folder
app.use(express.static('public'));
// Parses incoming requests and returns an object
app.use(express.urlencoded({ extended: true }));
// Recognizes incoming url request and accepts as an object
app.use(express.json());

// GET request to the server from loading home page using promises
app.get('/', async (request, response) => {
  // Stores items in two different consts, first being to do items and the second being items marked 'left to do'
  const todoItems = await db.collection('todos').find().toArray();
  const itemsLeft = await db
    .collection('todos')
    .countDocuments({ completed: false });
  // Data from mongo db under todoItems will be rendered into EJS file to show data
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
// add item to database
app.post('/addTodo', (request, response) => {
  db.collection('todos')
    // Request to create new data in collection
    .insertOne({ thing: request.body.todoItem, completed: false })
    .then((result) => {
      console.log('Todo Added');
      // Sends user back to home page (root) after create request is successful
      response.redirect('/');
    })
    .catch((error) => console.error(error));
});
// update with pur request. Sets completed to false
app.put('/markComplete', (request, response) => {
  db.collection('todos')
    //   update one item in database
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        // this is MongoDB specific syntax to change data
        $set: {
          completed: true,
        },
      },
      {
        // If server cannot locate the item in MongoDB, this will instead create a new piece of data and add to the collection like a POST request
        sort: { _id: -1 },
        upsert: false,
      }
    )
    // after promise is returned log 'Marked Complete' and set response to 'Marked Complete'
    .then((result) => {
      console.log('Marked Complete');
      response.json('Marked Complete');
    })
    .catch((error) => console.error(error));
});

// Sends a request to server to edit a completed item in database to uncompleted. Carries chosen item from main.js and locates it in database and assigns it new value of uncompleted
app.put('/markUnComplete', (request, response) => {
  db.collection('todos')
    .updateOne(
      // Carries info of selected data property
      { thing: request.body.itemFromJS },
      {
        // this is MongoDB specific syntax to change data
        $set: {
          completed: false,
        },
      },
      {
        // If server cannot locate the item in MongoDB, this will instead create a new piece of data and add to the collection like a POST request
        sort: { _id: -1 },
        upsert: false,
      }
    )
    // item has been successfully changed and server will display these messages in console
    .then((result) => {
      console.log('Marked Complete');
      response.json('Marked Complete');
    })
    // item has failed to change and server will throw this error message in the console
    .catch((error) => console.error(error));
});

// Sends a request to server to take selected item from main.js and delete it from MongoDB
app.delete('/deleteItem', (request, response) => {
  db.collection('todos')
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      console.log('Todo Deleted');
      response.json('Todo Deleted');
    })
    .catch((error) => console.error(error));
});

// App is able to be displayed on a hosting site and will also display on the assigned port if local
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});