//Modules
const express = require("express"); //setting a variable, making it possible to use express in this file
const app = express(); //setting a variable to create an Express application
const MongoClient = require("mongodb").MongoClient; //Requires that mongoClient library be imported
const PORT = 2121; // setting a variable that establishes a (local) port on 2121 / location where our server will be listening
require("dotenv").config(); // Allows you to bring in hidden environment variables (should be included in your gitignore file)

let db, // declare a variable called db but not assign a value
  dbConnectionStr = process.env.DB_STRING, // declaring a variable Sets dbConnectionStr equal to address provided by MongoDB (DB_string is in the .env file in line 5)
  dbName = "todo"; //declaring a variable and assigning the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to mongoDB, and passing in our connection string. Also passing in an additional property
  .then((client) => {
    //
    //responding on the client side and saying...
    console.log(`Connected to ${dbName} Database`); // will produce a message in the console if the client connected properly
    db = client.db(dbName); //assigning a value to the previously declared that contains a db client factory method
  }); // closing our .then

// MIDDLEWEAR
app.set("view engine", "ejs"); // sets ejs as the default render method
app.use(express.static("public")); //sets the location for the static assets
app.use(express.urlencoded({ extended: true })); // tells express to decode and encode URLs where the header maches the content, supports arrays and objects
app.use(express.json()); // tells the app to use Express's json method to take the object and turn it into a JSON string

//METHODS
app.get("/", async (request, response) => {
  //starts a GET method when the root route is passed in, sets up req and res params
  const todoItems = await db.collection("todos").find().toArray();
  //sets a variable and awaits ALL items from the todos collection
  const itemsLeft = await db //sets variable and awaits
    .collection("todos") // looks at documents in the collection
    .countDocuments({ completed: false }); //the .countDocuments method counts the number of documents that have a completed status equal to 'false' (you are going and counting how many to-do list items havent been completed yet. "what is still left on the agenda?")
  response.render("index.ejs", { items: todoItems, left: itemsLeft });
  //sends response that renders the number of documents in our collection and teh number of items left  (items that don't have 'true' for 'completed') in index.ejs (sending back a response of the to-do items we still have to do in index.ejs)

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
  //adds item to our database via route /addTodo
  db.collection("todos") // server will go into our collection called 'todos'
    .insertOne({ thing: request.body.todoItem, completed: false })
    //Insert one 'thing' named todoItem with a status of "completed" set to "false" (i.e. it puts some stuff in there)
    .then((result) => {
      //assuming everything went okay..
      console.log("Todo Added"); // print "todo added" to the console in the repl for VS code
      response.redirect("/"); //refreshes index.ejs to show that new thing we added to the database on the page
    })
    .catch((error) => console.error(error)); // if we weren't able to add anything to the database, we will see an error message in the console
});

app.put("/markComplete", (request, response) => {
  //UPDATE when we click something on the frontend
  db.collection("todos") //going thru our 'todos' collection
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: true, //add status of "completed" equal to 'true' to item in our collection
        },
      },
      {
        sort: { _id: -1 }, //once a thing has been marked as completed, this sorts the array by descending order by id
        upsert: false, //doesnt create a document for the todo if the item isnt found
      }
    )
    .then((result) => {
      //assuming that everything went okay and we got a result
      console.log("Marked Complete"); //console log "marked completed"
      response.json("Marked Complete"); //returns response of "marked completed" to the fetch in main.js
    })
    .catch((error) => console.error(error)); //if something broke, an error is logged to the console
});

app.put("/markUnComplete", (request, response) => {
  //this route unclicks a thing that you have marked as complete - will take away complete status
  db.collection("todos") // go into todos collection
    .updateOne(
      { thing: request.body.itemFromJS }, //look for item from itemFromJS
      {
        $set: {
          completed: false, //Undoes what we did with markComplete. It changes "completed" status to false
        },
      },
      {
        sort: { _id: -1 }, //once a thing has been marked as UnCompleted, this sorts the array by descening order by id
        upsert: false, // doesnt create a doc for the todo if the item isnt found
      }
    )
    .then((result) => {
      //assuming that everything went okat and we got a result.
      console.log("Marked Complete"); //console log "marked completed"
      response.json("Marked Complete"); //returns response of "marked ocmpleted" to the fetch in the main.js
    })
    .catch((error) => console.error(error)); //if something broke, an error is logged to the console
});

app.delete("/deleteItem", (request, response) => {
  //DELETE
  db.collection("todos") //goes into your collection
    .deleteOne({ thing: request.body.itemFromJS }) //uses deleteOne method and find a thing that matches the name of the thing you clicked on
    .then((result) => {
      //assuming everything went okay
      console.log("Todo Deleted"); //console log "todo deleted"
      response.json("Todo Deleted"); //returns response to the fetch in main.js
    })
    .catch((error) => console.error(error)); //if something broke, an error is logges to the console
});

app.listen(process.env.PORT || PORT, () => {
  //tells our server to listen for connections on the PORT we defined as a cont earlier OR process.env.PORT will tell the server to listen on the port of the app ( port used by heroku)
  console.log(`Server running on port ${PORT}`); //console logs port number or server its running on
});
