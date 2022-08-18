const express = require("express"); // allows us to use express
const app = express(); // creates a instance of express called app
const MongoClient = require("mongodb").MongoClient; // allows us to talk to MongoDB
const PORT = 2121; // port of where our server will listen
require("dotenv").config(); // store private values in a .env file

let db, // will store our database connection
  dbConnectionStr = process.env.DB_STRING, // mongodb connection string found in env files
  dbName = "Todo"; //mongdodb database to use for this

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating out connection to mongodb and passing in connection string
  .then((client) => {
    // waiting for successful connection
    console.log(`Connected to ${dbName} Database`); // console logs that we are connected
    db = client.db(dbName); // assign db client
  });

app.set("view engine", "ejs"); // sets ejs as our template engine
app.use(express.static("public")); // sets where our static assests will be placed
app.use(express.urlencoded({ extended: true })); // encodes and decodes url
app.use(express.json()); // parses json content from incoming requests

app.get("/", async (request, response) => {
  // root route using GET method
  const todoItems = await db.collection("todos").find().toArray(); // asynchronous database call to get all todo items
  const itemsLeft = await db // asynchronous database call to get all todo items that are completed and counts thems
    .collection("todos")
    .countDocuments({ completed: false });
  response.render("index.ejs", { items: todoItems, left: itemsLeft }); // renders index.ejs template using database call data
  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
});

app.post("/addTodo", (request, response) => {
  // addTodo route using POST method to add a new todo item
  db.collection("todos") // asynchronous database call to inset new to do item
    .insertOne({ thing: request.body.todoItem, completed: false })
    .then((result) => {
      // waits for database response
      console.log("Todo Added"); // console logs that todo has been added
      response.redirect("/"); // redirect page to root
    })
    .catch((error) => console.error(error)); // conole logs any erros
});

app.put("/markComplete", (request, response) => {
  // markComplete route using PUT method to update todo item
  db.collection("todos") // asynchronous database call to update todo item
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: true, // sets complete to true
        },
      },
      {
        sort: { _id: -1 }, // sorts data by id
        upsert: false, // if no record is found, a new record is NOT created
      }
    )
    .then((result) => {
      // waits for database response
      console.log("Marked Complete"); // console logs that todo has been marked complete
      response.json("Marked Complete"); // express responds with json stating that Marked complete
    })
    .catch((error) => console.error(error)); // console logs any errors
});

app.put("/markUnComplete", (request, response) => {
  // markunComplete route using PUT method to update todo item
  db.collection("todos") // asynchronous database call to update todo item
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: false, // sets complete to false
        },
      },
      {
        sort: { _id: -1 }, // sorts data by id
        upsert: false, //if no record is found, a new record is NOT created
      }
    )
    .then((result) => {
      // waits for database response
      console.log("Marked Complete"); // console logs that todo has been marked complete
      response.json("Marked Complete"); // express responds with json stating that Marked complete
    })
    .catch((error) => console.error(error)); // console logs any errors
});

app.delete("/deleteItem", (request, response) => {
  // markunComplete route using DELETE method to delete todo item
  db.collection("todos") // asynchronous database call to delete todo item
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      // waits for database response
      console.log("Todo Deleted"); // console log that todo has been deleted
      response.json("Todo Deleted"); // express responds with json stating that todo deleted
    })
    .catch((error) => console.error(error)); // console logs any errors
});

app.listen(process.env.PORT || PORT, () => {
  // tells express server to listen on PORT variable found in .env file
  console.log(`Server running on  http://localhost:${PORT}`); // console logs that we express server is running on port
});
