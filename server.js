const express = require("express"); //making it possible to use express in this file
const app = express(); //setting a variable and assigning it to the instance of express
const MongoClient = require("mongodb").MongoClient; //makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121; //setting a constant to define the location where our server will be listening
require("dotenv").config(); //allows us to look for variable inside of the .env file

let db, //declare a variable db but not assign a value
  dbConnectionStr = process.env.DB_STRING, //decalaring a vairable and assigning our database connection string to it
  dbName = "todo"; //declaring a variable and assigning the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to MongoDB and passing in our connection string.
  // also passing in an additional property
  .then((client) => {
    //waiting for the ocnnection and proceeding if successful, and passing in all the client information
    console.log(`Connected to ${dbName} Database`); //log to the console a template literal 'connected to todo Database'
    db = client.db(dbName); // assigning a value to a previously declared db variable that containas a db client factory method
  }); //closing our .then

//middleware
app.set("view engine", "ejs"); //sets EJS as the default render method
app.use(express.static("public")); //sets the location for static assets
app.use(express.urlencoded({ extended: true })); //tells express to decode and endcode URLs where the header matches the content
// supports arrays and objects
app.use(express.json()); //parses JSON content from incoming requests

app.get("/", async (request, response) => {
  // listening for a get request, / is the 'root' or 'main' page.
  const todoItems = await db.collection("todos").find().toArray(); //sets variable and awaits all items from hte todo collection
  // db holds the connection to our database
  // find the documents in the todos location, put them into an array that can hold the objects
  const itemsLeft = await db //sets variable and awaits a count of uncometed items to later display in EJS
    .collection("todos")
    .countDocuments({ completed: false });
  response.render("index.ejs", { items: todoItems, left: itemsLeft }); // pass the items (array of documents, put it into EJS)
  // respond with the HTML file that came with the EJS

  // db.collection('todos').find().toArray()
  // .then(data => {
  // data is referencing that array holding those objects
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
});

// API code that handles the post request
app.post("/addTodo", (request, response) => {
  // connects via route of form action /addTodo
  // todo is the collection name
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem, completed: false })
    // request.body.todoItem gets the specific item from the post
    // adds to the database, in the todos collection
    // Thing is just a placeholder for the object of the todo collection, it can be any name
    .then((result) => {
      console.log("Todo Added");
      // says it was successful
      response.redirect("/");
      // redirects to the main page, which will make a get request to refresh the page.
    })
    .catch((error) => console.error(error)); //cathcing errors
}); //ending the post

app.put("/markComplete", (request, response) => {
  //starts a PUT method when the markcomplete route is passed in
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
          completed: true, //set completed status to true
        },
      },
      {
        sort: { _id: -1 }, //moves item to the bottom of the list
        upsert: false, //prevents instertion if item does not already exist
      }
    )
    .then((result) => {
      //starts a then if update was successful
      console.log("Marked Complete"); //loggin successful completion
      response.json("Marked Complete"); //sending a response back to the sender
    }) //closing .then
    .catch((error) => console.error(error));
}); //ending put

app.put("/markUnComplete", (request, response) => {
  //starts a PUT method when the markcomplete route is passed in
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
          completed: false, //set completed status to false
        },
      },
      {
        sort: { _id: -1 }, //moves item to the bottom of the list
        upsert: false, //prevents instertion if item does not already exist
      }
    )
    .then((result) => {
      //starts a then if update was successful
      console.log("Marked Complete"); //logging successful completion
      response.json("Marked Complete"); //sending a response back to the sender
    }) //closing .then
    .catch((error) => console.error(error)); //catching errors
}); //ending put

app.delete("/deleteItem", (request, response) => {
  //starts a delete method when the delete route is passed
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS }) //look inside the todos collection for the ONE items that has a matching name from our JS file
    .then((result) => {
      //starts a then if delete was successful
      console.log("Todo Deleted"); //logging successful completion
      response.json("Todo Deleted"); //sending a response back to the sender
    }) //closing .then
    .catch((error) => console.error(error)); //catching errors
}); //ending delete

app.listen(process.env.PORT || PORT, () => {
  //set up which port we will be listening on -either the port from the .env file or the port variable we set
  console.log(`Server running on port ${PORT}`); //console.log the running port.
}); //end the listen method
