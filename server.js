// simplifies server creation
const express = require("express");
// instance of express
const app = express();
// able to connect to mongodb
const MongoClient = require("mongodb").MongoClient;
// sever port
const PORT = 2121;
// lets us use the .env file where our database password is.
require("dotenv").config();

// our connection string to the database
let db, // declare a variable of db but no a value
  // assigning our database connection string to variable
  dbConnectionStr = process.env.DB_STRING,
  // name of the database we will be using
  dbName = "todo";

//  the connection to our database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    // a connection that lets us access MongoDB
    db = client.db(dbName);
  }
);

// tells express what template engine we are using
app.set("view engine", "ejs");
// tells express to make public folder accessible to the public by using this middleware
app.use(express.static("public"));
// for post req.
// recognize incoming req obj as string or arrays // works on payloads
app.use(express.urlencoded({ extended: true }));
// for incoming request object to become JSON obj
app.use(express.json());

// root route
app.get("/", async (request, response) => {
  // collection lets us store our data
  // gather all data from database
  const todoItems = await db.collection("todos").find().toArray();
  //   return the count of documents that match the query for a colleciton or view
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false });

  // renders data to ejs that then renders on the web page
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

// POST route
app.post("/addTodo", (request, response) => {
  db.collection("todos")
    // insert new data to todo collection and giving completed false by default
    .insertOne({ thing: request.body.todoItem, completed: false })
    // if insert is successful
    .then((result) => {
      // prints todo added
      console.log("Todo Added");
      //   redirects to the homepage
      response.redirect("/");
    })
    // if err, sends err
    .catch((error) => console.error(error));
});

// updates complete to true
app.put("/markComplete", (request, response) => {
  db.collection("todos")
    // selects one to update
    .updateOne(
      // what we what to update
      { thing: request.body.itemFromJS },
      {
        // update data
        $set: {
          completed: true,
        },
      },
      {
        // additional options for updata req
        // changes the order in which read ops return documents. sort tells mongo to order return docu. by the values of one or more fields in a certain direction. using -1 sorts in descending order (greates first)
        sort: { _id: -1 },
        // insert a document if no documents can be updataed
        upsert: false,
      }
    )
    .then((result) => {
      // prints complete
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    // prints error
    .catch((error) => console.error(error));
});

// updates completed to false
app.put("/markUnComplete", (request, response) => {
  db.collection("todos")
    // looks for the item that match the name of the item passed in from the main js file that was clicked on
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        // update the selecting data
        $set: {
          completed: false,
        },
      },
      {
        // changes the order in which read ops return documents.
        // moves item to the bottom of the list
        sort: { _id: -1 },
        // insert a document if no documents can be updataed
        upsert: false,
      }
    )
    .then((result) => {
      // prints complete
      console.log("Marked Complete");
      // sending a reponse back to the sender
      response.json("Marked Complete");
    })
    // prints error
    .catch((error) => console.error(error));
});

// deletes a todo
app.delete("/deleteItem", (request, response) => {
  db.collection("todos")
    //   removes a document from the database
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      console.log("Todo Deleted");
      // sending a reponse back to the sender
      response.json("Todo Deleted");
    })
    // prints error
    .catch((error) => console.error(error));
});

// app.listen connects to the server
// listen on port either the port from the .env or the port variable we set
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
