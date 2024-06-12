const express = require('express');
//brings in express to be used
const app = express();
//sets express to an app variable
const MongoClient = require('mongodb').MongoClient;
//brings in the mongo client to be used
const PORT = 2121;
//sets the port to 2121
require('dotenv').config();
//allows dotenv to be used in the config file

let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = 'todo';
//sets the db, dbConnectionStr to process the env db_string, and sets the dbName to todo

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then((client) => {
  //connects to the dbConnectionStr and uses the unified topology (which is new i guess)
  console.log(`Connected to ${dbName} Database`);
  //console log to let us know we are connectd to the database
  db = client.db(dbName);
  //establishes a connection to a speacific database and assigns it as the db variable
});

app.set('view engine', 'ejs');
//sets the view engine to ejs
app.use(express.static('public'));
//allows the use of the public folder
app.use(express.urlencoded({ extended: true }));
//allows the use of urlencoded data which is useful because it allows us to send data to the server
app.use(express.json());
//allows the use of json data

app.get('/', async (request, response) => {
  const todoItems = await db.collection('todos').find().toArray();
  const itemsLeft = await db.collection('todos').countDocuments({ completed: false });
  response.render('index.ejs', { items: todoItems, left: itemsLeft });
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
