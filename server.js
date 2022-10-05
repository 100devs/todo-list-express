const express = require('express'); //use Node’s require function to use the express module.
const app = express(); // require the Express module and and puts it in a variable.
const MongoClient = require('mongodb').MongoClient; // to use mongoClient
const PORT = 2121; //define server port
require('dotenv').config(); // to use dotenv file

let db, //decalre db varible
  dbConnectionStr = process.env.DB_STRING, // delcare db variable from .env and assign it to db connection string
  dbName = 'todo'; //name db

//connet to MongoDB with connection string and engine monitoring package
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  //wait for connection and if true, lg dbname to console.
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName); // update db name
  }
);
//middleware that runs between req and res
app.set('view engine', 'ejs'); // set ejs to use as render views
app.use(express.static('public')); // where to look for static files
app.use(express.urlencoded({ extended: true })); // tells express deocde and encode URLS where the header mathces the content.supports arraysa dn objects
app.use(express.json()); // express to parse json data

//Express to Read home route, and response
app.get('/', async (request, response) => {
  const todoItems = await db.collection('todos').find().toArray(); // todoItems is waiting for todo collections in db to locate all data and put it into an array
  const itemsLeft = await db //itemsLeft is wating for todo collection in db to count uncompleted items to later display in EJS
    .collection('todos')
    .countDocuments({ completed: false });
  response.render('index.ejs', { items: todoItems, left: itemsLeft }); // render the response and inside the render method, index.ejs file and db item items and left are passed in
  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
});

//express to start a POST request when add route is passed in
app.post('/addTodo', (request, response) => {
  db.collection('todos') //the todos collection in db
    .insertOne({ thing: request.body.todoItem, completed: false }) // add the user entered todoItem text and set completed property to false
    .then((result) => {
      // wait for the ok, if ok log 'todo added' msg to console
      console.log('Todo Added');
      response.redirect('/'); // go back to home route
    })
    .catch((error) => console.error(error)); //if there is error, catch it in catch method and log the error to console.
});

app.put('/markComplete', (request, response) => {
  //express to start PUT request when '/markComplete' route is passed in
  db.collection('todos') // the todos collectin in db
    .updateOne(
      // use the updateOne method of mongoDB to look for the item matching the name of the item passed in from main.js that was cliked on
      { thing: request.body.itemFromJS }, //1st parameter passed in is the todo inner text
      {
        $set: {
          //
          completed: true, //set completed status to true
        },
      },
      {
        sort: { _id: -1 }, //moves item to bottom of the list
        upsert: false, // prevent insertion of the item does not already exist
      }
    )
    .then((result) => {
      //starts then if udpate is ok
      console.log('Marked Complete'); //log 'completed' msg
      response.json('Marked Complete'); // response with json message 'marked completed' msg
    })
    .catch((error) => console.error(error)); //if there is error, catch it in catch method and log the error to console.
});

//express to start PUT request when '/markUnComplete' route is passed in
app.put('/markUnComplete', (request, response) => {
  db.collection('todos') //select the todos collection in the db
    .updateOne(
      // use the updateOne method of mongoDB

      { thing: request.body.itemFromJS }, //to look for the item matching the name of the item passed in from main.js that was clicked on
      {
        $set: {
          completed: false, //set completed status to true
        },
      },
      {
        sort: { _id: -1 }, //moves item to bottom of the list
        upsert: false, // prevent insertion of the item does not already exist
      }
    )
    .then((result) => {
      //starts then if udpate is ok
      console.log('Marked Complete'); //log 'completed' msg
      response.json('Marked Complete'); // response with json message 'marked completed' msg  to the sender
    })
    .catch((error) => console.error(error)); //if there is error, catch it in catch method and log the error to console.
});

//express to start DELETE request when '/deleteItem' route is passed in
app.delete('/deleteItem', (request, response) => {
  db.collection('todos') //select the todos collection in the db
    // use the deleteOne method of mongoDB to to look for the item matching the name of the item passed in from main.js that was clicked on
    .deleteOne({ thing: request.body.itemFromJS })
    //starts then if udpate is ok
    .then((result) => {
      console.log('Todo Deleted'); //log 'Deleted' msg
      response.json('Todo Deleted'); //response 'Deleted' msg to the sender
    })
    .catch((error) => console.error(error)); //if there is error, catch it in catch method and log the error to console.
});

app.listen(process.env.PORT || PORT, () => {
  //tell the express to run server on which port, from .env file or port declared on the top of this file
  console.log(`Server running on port ${PORT}`); //log message in console
});
