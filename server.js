//require express framework stored in node modules
const express = require('express');
//create variable assigned to express function
const app = express();
//require mongodb connection
const MongoClient = require('mongodb').MongoClient;
//default port to run on local server
const PORT = 2121;
//require environment file
require('dotenv').config();

// declaring the variables for mongodb values
let db, // this will hold the database from mongodb
  dbConnectionStr = process.env.DB_STRING, // value of the mongodb connection string
  dbName = 'todo'; //the name of the mongodb database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connects to mongo client and passes our connection string
  .then((client) => {
    console.log(`Connected to ${dbName} Database`); // clode to see if we connected successfully
    db = client.db(dbName); // assigning mongodb database to variable db
  });

//This code sets the view engine of the "app" object to "ejs". It means that when the app renders views, it will use the EJS templating engine.
app.set('view engine', 'ejs');
//express uses public folder to serve static files - css & client side JS, etc.
app.use(express.static('public'));
//express uses parser to grab parts (strings) from URL. DEPRECATED, IT'S INCLUDED INTO EXPRESS BY DEFAULT FROM VERSION 4.16.0
app.use(express.urlencoded({ extended: true }));
//express passes back json. DEPRECATED, IT'S INCLUDED INTO EXPRESS BY DEFAULT FROM VERSION 4.16.0
app.use(express.json());

// code for read (get) request
//sends get request when root link submitted
app.get('/', async (request, response) => {
  const todoItems = await db.collection('todos').find().toArray(); //searches for all todo objects in db and turns it to array holding these todo objects
  const itemsLeft = await db
    .collection('todos')
    .countDocuments({ completed: false }); // counts the number of todo objects which are not completed
  response.render('index.ejs', { items: todoItems, left: itemsLeft }); // renders HTML index.ejs with variables todoItems and itemsLeft. Then sends rendered HTML to client.

  //   same code but with promise chain instead of async function.
  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })£
  // .catch(error => console.error(error))
});

//express post method (create)
//client submits form -> post is executed
//form with action addTodo, passes in a request
app.post('/addTodo', (request, response) => {
  //goes to database (db), checks db 'todos' collection of objects
  //inserts (insertOne) string taken from input
  //db creates new todos object with properties (thing, completed) and assigns values (string from input, false)
  //thing property is taken from views/index.ejs input with name of todoItem
  db.collection('todos')
    .insertOne({ thing: request.body.todoItem, completed: false })
    //if promise is successful .then method runs
    .then((result) => {
      //console logs
      console.log('Todo Added');
      //server redirects clients to root (refreshes), where client side code will do something
      response.redirect('/');
    })
    //if promise fails, an error will be logged in console
    .catch((error) => console.error(error));
});

// code for update(PUT) request
// sends put request to route /markComplete
app.put('/markComplete', (request, response) => {
  db.collection('todos') // the collection which document will be updated
    // express update method
    .updateOne(
      { thing: request.body.itemFromJS }, // Filter criteria for searching the object which needs to be updated. Searches the object where property thing has value from client side code request
      {
        // operator to set value of the document key
        $set: {
          completed: true, //sets the value of completed to 'true'
        },
      },
      {
        sort: { _id: -1 }, //sorts collection documents by id in desc order
        upsert: false, // if matching document is not found, a new document will not be inserted.
      }
    )
    .then((result) => {
      console.log('Marked Complete'); //logs the completion of response
      response.json('Marked Complete'); //sends completion response in json format
    })
    .catch((error) => console.error(error)); // logs error in case of error in update process
});

// sends put request to route /markUnComplete
app.put('/markUnComplete', (request, response) => {
  db.collection('todos') // the collection which document will be updated
    // express update method
    .updateOne(
      { thing: request.body.itemFromJS }, // Filter criteria for searching the object which needs to be updated. Searches the object where property thing has value from client side code request
      {
        // operator to set value of the document key
        $set: {
          completed: false, //sets the value of completed to 'false'
        },
      },
      {
        sort: { _id: -1 }, //sorts collection documents by id in desc order
        upsert: false, // if matching document is not found, a new document will not be inserted.
      }
    )
    .then((result) => {
      console.log('Marked Complete');
      response.json('Marked Complete');
    })
    .catch((error) => console.error(error)); // logs error in case of error in update process
});

// deletion method
// sends delete request to route /deleteItem
app.delete('/deleteItem', (request, response) => {
  db.collection('todos') // the collection which document will be deleted
    .deleteOne({ thing: request.body.itemFromJS }) // Filter criteria for searching the object which needs to be deleted. Searches the object where property thing has value from client side code request
    .then((result) => {
      console.log('Todo Deleted'); //logs success msg
      response.json('Todo Deleted'); // responds with success json
    })
    .catch((error) => console.error(error)); //logs error if it persist
});
//express listens for port from host or local port assigned to connect
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`); //if connected, logs to console
});
