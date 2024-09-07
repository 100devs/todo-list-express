//Import the Express library and assign it to a constant variable which then can be used to create an Express application
const express = require('express');
//Create an Express application instance and store it in the app constant, which will be used to configure and run web server
const app = express();
//Import MongoClient class from the MongoDB library and store it in a variable
const MongoClient = require('mongodb').MongoClient;
//Store the port we would like to use in a constant
const PORT = 2121;
//Loads and configures environment variables from a .env file
require('dotenv').config();

//Create variables for the database, the database string and the database name
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = 'todo';
//Connect to the MongoDB database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);
//Set the templating engine to ejs
app.set('view engine', 'ejs');
//Make sure that express serves all the static files from the public directory
app.use(express.static('public'));
//Make sure that we can access the body of the request when sending a form
app.use(express.urlencoded({ extended: true }));
//Parses incoming requests with JSON payloads.
app.use(express.json());

//API to listen for a GET request in the root folder
app.get('/', async (request, response) => {
  //Connect to database, find the todos collection and arrange them into an array and store them in a variable
  const todoItems = await db.collection('todos').find().toArray();
  //Connect to db, find the todos collection and count the documents which have a completed property set to false and store it in a constant
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
//API To listen for a post request in the /addTodo route
app.post('/addTodo', (request, response) => {
  //Connect to db todos, insert a new document with a thing property which is coming from the request body, and set the completed property to false
  db.collection('todos')
    .insertOne({ thing: request.body.todoItem, completed: false })
    //after it is done console log Todo Added and redirect to the root folder, initiate a new get requets so the site reloads and the new items appear in the list
    .then((result) => {
      console.log('Todo Added');
      response.redirect('/');
    })
    //Console log the errors
    .catch((error) => console.error(error));
});
//API to listen for a PUT request in the /markComplete route
app.put('/markComplete', (request, response) => {
  //Connect to db, and update the document which has the thing property from the request.body.intemFromJs and set the completed key to true
  db.collection('todos')
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: true,
        },
      },
      {
        //Sort in a descending order
        sort: { _id: -1 },
        //If there is no document with this name to update then it is not going to create one
        upsert: false,
      }
    )
    .then((result) => {
      //Console log and send back a response
      console.log('Marked Complete');
      response.json('Marked Complete');
    }) //Console log errors
    .catch((error) => console.error(error));
});
//Listen for a PUT request in /markUnComplete route
app.put('/markUnComplete', (request, response) => {
  //connect to db and find the document
  db.collection('todos')
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          //set the completed key to false
          completed: false,
        },
      },
      {
        //sort descending
        sort: { _id: -1 },
        upsert: false,
      }
    )
    .then((result) => {
      //console log with status and respond back
      console.log('Marked Complete');
      response.json('Marked Complete');
    })
    //console log errors
    .catch((error) => console.error(error));
});
//Listen for a DELETE request in the /deleteItem route
app.delete('/deleteItem', (request, response) => {
  //Connect to db todos collection and delete the specific document
  db.collection('todos')
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      //Console log the success message and respond to the client side
      console.log('Todo Deleted');
      response.json('Todo Deleted');
    })
    //Console log errors
    .catch((error) => console.error(error));
});
//Make sure the application either listens for the port by heroku or the port we defined earlier
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
