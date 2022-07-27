const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
//declaring port variable
const PORT = 2121;
//required dotenv
require("dotenv").config();

let db, //Declaring an empty 'db' variable
  dbConnectionStr = process.env.DB_STRING, // a connection string variable that gets the  string from  .env or heroku's variables
  dbName = "todo"; // Declaring the name of the datababse to the 'dbName variable
//Connecting to the database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);
//Setting up EJS
app.set("view engine", "ejs"); //Setting up EJS

app.use(express.static("public")); //setting up public folder
app.use(express.urlencoded({ extended: true })); ////tells express to decode and encode urls automatically
app.use(express.json()); //tells express to use JSON

//Respondong to a get request to the  '// route
app.get("/", async (request, response) => {
  const todoItems = await db.collection("todos").find().toArray(); //Getting to-do items from the database
  const itemsLeft = await db // getting items lwith a 'completed' value of 'false
    .collection("todos")
    .countDocuments({ completed: false });
  response.render("index.ejs", { items: todoItems, left: itemsLeft }); // sending over the variables todoitems and items =left in ejs
  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
});

//Responding to a post request to the '/addtodo" route
app.post("/addTodo", (request, response) => {
  //Inserting a new todo item into the list
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem, completed: false })
    //console logging that the todo list was added, then telling client to refresh the page
    .then((result) => {
      console.log("Todo Added");
      response.redirect("/"); //refresh page
    })
    .catch((error) => console.error(error));
});

//respondong to an update reqquest to make an item complete
app.put("/markComplete", (request, response) => {
  //going into database. collection 'todos', and finding a document that mactches request. body.itemFromJS
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: true,
        },
      },
      {
        sort: { _id: -1 }, // sort in decending order oldest first
        upsert: false, // if the document doesnt already exist dont create a new one
      }
    )
    //console loggin that its been marked complet and also respondng back to theclient  in JSON saying  its bee marked complet
    .then((result) => {
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    .catch((error) => console.error(error));
});
//Respondong to an update request to mark an item uncomplete
app.put("/markUnComplete", (request, response) => {
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: false,
        },
      },
      {
        sort: { _id: -1 }, //sorting by oldest first
        upsert: false,
      }
    )
    .then((result) => {
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    .catch((error) => console.error(error));
});

//Responding to a request to delte an item fom the list
app.delete("/deleteItem", (request, response) => {
  //going into the database and deleting the item that matches request.bosy.itemfromJS
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS })

    .then((result) => {
      console.log("Todo Deleted");
      response.json("Todo Deleted");
    })
    .catch((error) => console.error(error));
});
//Setting the server to listen to requests
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
