// lets the server know express is being used
const express = require("express");

// holds the instance of express being run, indicated by anonymous function
const app = express();

// lets the server know mongo db is being used
const MongoClient = require("mongodb").MongoClient;

// what port the server will listen for
const PORT = 2121;

// lets the server know that we have a .env file
require("dotenv").config();

// db is declared
// dbConnectionStr is the DB_STRING inside the .env file
// create variable for database name
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo";

// lets server connect to mongodb
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })

  // promise after the connection is made
  .then((client) => {
    // log 'connected...'
    console.log(`Connected to ${dbName} Database`);

    // create the databse after the promise has been made using the dbName as the name of the database
    db = client.db(dbName);
  });

// lets the server know to expect to output ejs and not html
app.set("view engine", "ejs");

// lets the server know we have documents in the public file that can be accessed anytime
app.use(express.static("public"));

// allows us to get data from forms
app.use(express.urlencoded({ extended: true }));

// allows the server to work with json data
app.use(express.json());

// root directory of the server its an asychronous function expects two parameters
app.get("/", async (request, response) => {
  // todoItems selects the collection todos gets every document from the collection and makes it into an array
  const todoItems = await db.collection("todos").find().toArray();

  //   itemsLeft selects the collection todos and gets the number of documents that meet the condition completed: false then calls response.render which will display the result select index.ejs and pass an object with to two objects
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false });
  response.render("index.ejs", { items: todoItems, left: itemsLeft });
  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
});

// listening for a post request from the form in index.ejs
app.post("/addTodo", (request, response) => {
  // selects the collection of documents
  db.collection("todos")
    // creates a document using the input from the ejs and another field set to false
    .insertOne({ thing: request.body.todoItem, completed: false })
    // runs after the document is added to the collection redirects the server back to root
    .then((result) => {
      console.log("Todo Added");
      response.redirect("/");
    })
    // if the request fails shows an error message
    .catch((error) => console.error(error));
});

// put request
app.put("/markComplete", (request, response) => {
  // selects the collection of todos
  db.collection("todos")
    // finds looks for a document whose property of thing is equal to what was passed from the client
    // uses $set to change the property of completed to true
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: true,
        },
      },
      // tells mongo to sort the collection in reverse order
      {
        sort: { _id: -1 },
        upsert: false,
      }
    )
    // after the request is completed resonds with a json
    .then((result) => {
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    .catch((error) => console.error(error));
});

// listens for a request from the client
app.put("/markUnComplete", (request, response) => {
  // selects the collection of todos
  db.collection("todos")
    // updates one document in the collection whose thing property matches what was passed from the client
    // uses $set to make the property of completed equal to false
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: false,
        },
      },
      // sorts the array in reverse order
      {
        sort: { _id: -1 },
        upsert: false,
      }
    )
    // runs after the request is complete and relays a message
    .then((result) => {
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    // if the request fails gives us an error message
    .catch((error) => console.error(error));
});

// delete request from the client side
app.delete("/deleteItem", (request, response) => {
  // selects the collection of todos
  db.collection("todos")
    // looks to see what document matches the property of thing with the data recieved from the client then deletes it
    .deleteOne({ thing: request.body.itemFromJS })
    // runs after the request is complete and relays a message
    .then((result) => {
      console.log("Todo Deleted");
      response.json("Todo Deleted");
    })
    // gives an error message if the request is not complete
    .catch((error) => console.error(error));
});

// lets the server know to listen for the port specified by the .env file or a port that we defined in the variable PORT
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
