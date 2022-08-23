const express = require("express"); //makes it possible to use express in this file
const app = express(); //instantiating a new instance of an express app, allows you to use easy to use variable name - app
const MongoClient = require("mongodb").MongoClient; //importing mongodb in order to connect to a mongo database - instantiates a new MongoClient instance which allows you to communicate w/, manipulate, create, and connect to a mongodb
const PORT = 2121; //assigning variable to define the location where our server will be listening
require("dotenv").config(); //allows us to access variables inside of the .env file

let db, //db - database
  dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our database connection string to it from the .env file
  //dbConnectionStr - allows us to connect to mongodb
  dbName = "todo"; //declaring a variable and assigning the name of the database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connects this app to mongodb and passes in our connection string and useUnifiedTopology, an additional property that allows us to format connection string into a promise so that we can use handlers
  .then((client) => {
    //MongoClient.connect establishes a promise so we are waiting for the connection to mongodb and proceeding if successful and passing in all of the client info
    console.log(`Connected to ${dbName} Database`); //logs the template literal 'Connected to todo Database'
    db = client.db(dbName); //assigns a value to previously declared db variable that contains a db client factory method
  });

//Middleware - allows us to communicate b/w client and db
app.set("view engine", "ejs"); //sets your view engine to ejs - allows us to use ejs
app.use(express.static("public")); //sets the location of the public folder that will serve static assets to client
app.use(express.urlencoded({ extended: true })); //parses incoming requests with urlencoded payloads
//tells express to decode and encode URLs where the header matches the content - supports arrays and objects
app.use(express.json()); //parses incoming JSON requests and puts the parsed data into req/request

app.get("/", async (request, response) => {
  //GET method at default endpoint '/' the root route and sets up req and res parameters
  const todoItems = await db.collection("todos").find().toArray(); //sets a variable and awaits the mongodb collection called 'todos', and finds ALL of the documents and stores the data in an array
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false }); //sets a variable and awaits the documents in database collection that have false as a value for key 'completed' and adds them to the count
  response.render("index.ejs", { items: todoItems, left: itemsLeft }); //pass todoItems and itemsList in an object to index.ejs file in order to be rendered

  // Promise version
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
  //defines a POST method (create) at /addTodo endpoint
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem, completed: false }) //adds new document to todos collection and gives it a completed value of false by default

    .then((result) => {
      //if insert is successful, do something
      console.log("Todo Added"); //console log action
      response.redirect("/"); //redirects to base endpoint (root) after the document is added to refresh the page
    })
    .catch((error) => console.error(error)); //catching errors
});

app.put("/markComplete", (request, response) => {
  //defines a PUT method (update) at /markComplete endpoint
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        //updates a document from the todo collection - looks in the db for item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
          //sets the completed key to true (in ejs, which will add the class 'completed')
          completed: true,
        },
      },
      {
        sort: { _id: -1 }, //moves item to the bottom of the list
        upsert: false, //prevents insertion if item does not already exist
      }
    )

    .then((result) => {
      //starts then if update was successful
      console.log("Marked Complete"); //console logs the action
      response.json("Marked Complete"); //sends response back to the sender
    })
    .catch((error) => console.error(error)); //catches errors
});

app.put("/markUnComplete", (request, response) => {
  //defines a PUT method (update) at /markUnComplete endpoint
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        //looks in the db for item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
          //sets the completed key to false
          completed: false,
        },
      },
      {
        sort: { _id: -1 }, //moves item to the bottom of the list
        upsert: false, //prevents insertion if item does not already exist
      }
    )

    .then((result) => {
      //starts then if update was successful
      console.log("Marked Complete"); //console logs the action
      response.json("Marked Complete"); //sends response back to the sender
    })
    .catch((error) => console.error(error)); //catching errors
});

app.delete("/deleteItem", (request, response) => {
  //starts a delete method when the delete route is passed in
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS }) //looks inside the todos colelction for the item that has a matching name from our main.js file

    .then((result) => {
      //starts a then if delete was successful
      console.log("Todo Deleted"); //logs action
      response.json("Todo Deleted"); //sends response back to teh server
    })
    .catch((error) => console.error(error)); //catches errors
});

app.listen(process.env.PORT || PORT, () => {
  //sets up the port we will be listening on - either from the .env file or global variable
  console.log(`Server running on port ${PORT}`); //logs action
});
