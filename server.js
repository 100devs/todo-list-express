// These first two lines are the standard way to set up Express.  First we import it using the CJS module method.
const express = require("express");
// Here we assign a variable name to the function express(), which will make things easier to write.
const app = express();
// We import MongoClient.
const MongoClient = require("mongodb").MongoClient;
// This sets the default value for PORT, which we will use later when telling the server where to listen.
const PORT = 2121;
// This takes the dotenv module into use, which allows us to access the environmental variables stored in the .env file
require("dotenv").config();

// Here we declare the variable "db" but do not assign it a value yet.  We assign our MongoDB connection string (found in the .env file) to the variable dbConnectionStr, and assign the name of the database we'll be connecting to (in this case, "todo") to the variable dbName
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo";

// This is the standard way of connecting to the MongoDB database, using our connection string.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  // On a successful connection, a message will be printed to the server console, and the db variable will be bound to the client.
  .then((client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  });

app.set("view engine", "ejs"); // This lets Express know that we're using ejs as a templating engine and tells it to look for ejs files in the /views folder
app.use(express.static("public")); //  This is telling the server that when the index (or any other HTML/EJS file) tries to access any other file, it should start looking from the /public directory.  Thanks to this line, we don't have to write custom routes to serve static files (Express will serve them automatically)
app.use(express.urlencoded({ extended: true })); // This line takes into use the built-in Express middleware that allows us to parse URL-encoded data (e.g., form data).  The data will be stored on the request.body object.
app.use(express.json()); // Similar to the above, but this allows for the parsing of JSON-encoded data.

// Here's the point where we start writing the handlers, which indicate to the server what to listen for (e.g., the method), where to listen (the endpoint) and what to do when a request comes through (the controller function)

// Here we are defining what will happen when a GET request comes through on the root path. (e.g., when a user tries to access the index page of our website)
app.get("/", async (request, response) => {
  // The server will query the database for all items found in the "todos" collection in the "todo" database, convert the list of documents into an array and assign it to a variable.
  const todoItems = await db.collection("todos").find().toArray();
  // The server makes a second query to the database, in this case requesting a count of all documents in which the value of the "completed" field is "false", and binds the number to the variable todoItems
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false });
  // Next the data is sent to the renderer and the rendered page will be sent to the client.
  response.render("index.ejs", { items: todoItems, left: itemsLeft });
  // The code below performs identically to the code above, only using chained .then()s rather than async/await.
  // One big difference is that the code below includes a .catch() to deal with errors, while the code above does not include error handling.  That could be easily solved by wrapping the database query in a try {} and following with a catch {}
  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
});

// This tells the server how to handle a POST request made to the "/addToDo" endpoint.
app.post("/addTodo", (request, response) => {
  // The server accesses the "todos" collection on the database...
  db.collection("todos")
    // ... and inserts a new document using the value sent from the client (stored in request.body.todoItem).  The value of the "completed" field is initially set to false.
    .insertOne({ thing: request.body.todoItem, completed: false })
    // On a successful request, the server logs "ToDo Added" and redirects the client to the root page.  (Forcing a GET request to the root)
    .then((result) => {
      console.log("Todo Added");
      response.redirect("/");
    })
    // On an error, the server logs the error to the console.
    .catch((error) => console.error(error));
});

// This tells the server how to handle PUT request made to the /markComplete endpoint.
app.put("/markComplete", (request, response) => {
  // Once again, "todos" is accessed.
  db.collection("todos")
    // And the database performs an updateOne operation
    .updateOne(
      // It searches the collection for a document that matches the query; in this case, a document where the value assigned to "thing" === the value that was sent from the client
      { thing: request.body.itemFromJS },
      // It performs the $set operation on the first matching document, which sets the value of the given field to the specified value.  In this case, it sets the value of "completed" to "true."
      {
        $set: {
          completed: true,
        },
      },
      // We have also included some options.  The documents in the collection will then be sorted in descending order by their _id value (so from the oldest to the most recent)
      {
        sort: { _id: -1 },
        // This indicates that if no document is found that matches the query string, MongoDB will NOT create a new one.  (MongoDB tends to be very "helpful" and is eager to create new documents, collections, and even databases.)
        upsert: false,
      }
    )

    // On success, the server logs the message "Marked Complete" and sends the same message to the client as a JSON string.
    .then((result) => {
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    // Any errors end up here, where they are logged to the server console
    .catch((error) => console.error(error));
});

// This route is almost identical to the above, so I am not going to bother commenting every line.
// It applies to a different endpoint: "/markUnComplete"
app.put("/markUnComplete", (request, response) => {
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      // And does the opposite to the one before:  this time the value of "completed" is set to "false"
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
      // Even these responses have been copied, which is unfortunate as they are terribly misleading.
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    .catch((error) => console.error(error));
});

// This tells the server how to handle delete requests that are made to the "/deleteItem" endpoint
app.delete("/deleteItem", (request, response) => {
  // The server once again accesses the database
  db.collection("todos")
    // And carries out a delete operation on the matching item.
    .deleteOne({ thing: request.body.itemFromJS })
    // On success, the message "Todo Deleted" is logged to the console, and the same message sent as a json to the client.
    .then((result) => {
      console.log("Todo Deleted");
      response.json("Todo Deleted");
    })
    // On error, the error message is sent to the server console.
    .catch((error) => console.error(error));
});

// This creates the server and tells it to listen for requests arriving at the specified port number:  either a number provided by our host (e.g., Heroku) as an environmental variable, or (if that doesn't exist) the number we assigned to PORT earlier.
app.listen(process.env.PORT || PORT, () => {
  // Once the server is listening, a message is logged to the server console
  console.log(`Server running on port ${PORT}`);
});
