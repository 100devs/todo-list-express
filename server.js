const express = require("express"); //require express
const app = express(); //making it easier to call express()
const MongoClient = require("mongodb").MongoClient; //require Mongodb
const PORT = 2121; //declaring the PORT
require("dotenv").config(); //requiring dotenv or env implementation

let db, //declaring variable db
    dbConnectionStr = process.env.DB_STRING, //declaring dbConnectionStr that gets the connection string from the .env file. DB_STRING is the environment variable to connect to Mongodb
    dbName = "todo"; // declaring dbName that will be used to name the database in mongodb ('todo' in this case)

//* connecting to mongo
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //setting up the connection to Mongodb
    .then((client) => {
        //promise that resolves to connected to dbname database if successful
        console.log(`Connected to ${dbName} Database`);
        db = client.db(dbName);
    });

//* middlware
app.set("view engine", "ejs"); //setting up ejs as the templating engine
app.use(express.static("public")); //setting up the public folder - fun fact/reminder: makes it so that you don't need to add the public folder to reference folders and files within public folder
app.use(express.urlencoded({ extended: true })); //tells express to parse incoming requests. this has taken over since BodyParser as deprecated
app.use(express.json()); // tells json to use JSON

//* sets up response to GET requests on the root path ('/')
app.get("/", async (request, response) => {
    const todoItems = await db.collection("todos").find().toArray(); //async function to find all todos and set them up in an array
    const itemsLeft = await db
        .collection("todos")
        .countDocuments({ completed: false }); //async function to get items with completed: false
    response.render("index.ejs", { items: todoItems, left: itemsLeft }); //rendering the ejs using variables "toDoItems", "itemsLeft".  the keys will be used in the EJS

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
});

//* setting up response to POST requests on '/addTodo' path
app.post("/addTodo", (request, response) => {
    db.collection("todos")
        .insertOne({ thing: request.body.todoItem, completed: false }) //inserts a todo item into the list. sets the item to the todoItem value and completed setting to false
        .then((result) => {
            console.log("Todo Added"); //logs to terminal that a todo has been added
            response.redirect("/"); // refreshes the page to the root - so that it will run a GET request again
        })
        .catch((error) => console.error(error)); // catch error handling
});

//* setting up server response to PUT/update reqs on 'markComplete' path
app.put("/markComplete", (request, response) => {
    db.collection("todos")
        .updateOne(
            //going into the database collection 'todos', and finding the document that matches request.body.itemFromJS
            { thing: request.body.itemFromJS },
            {
                $set: {
                    // sets the completed key status to true
                    completed: true,
                },
            },
            {
                sort: { _id: -1 }, //sorts by oldest to most recent
                upsert: false, // if set to true, upsert will check and match documents. if match, then it will update but if false, it will actually insert a document
            }
        )
        .then((result) => {
            //just a promise that if resolved will return console log and json to the client
            console.log("Marked Complete");
            response.json("Marked Complete");
        })
        .catch((error) => console.error(error)); // catching errors
});

//* setting up server response to PUT/update reqs on 'markUnComplete' path
app.put("/markUnComplete", (request, response) => {
    db.collection("todos")
        .updateOne(
            // goes into the db and finding the document that matches request.body.itemFromJS
            { thing: request.body.itemFromJS },
            {
                $set: {
                    // sets the completed key status to false
                    completed: false,
                },
            },
            {
                sort: { _id: -1 }, //sorts from oldest to most recent
                upsert: false, // if set to true, upsert will check and match documents. if match, then it will update but if false, it will actually insert a document
            }
        )
        .then((result) => {
            //on resolve, will log that the todo item has been marked complete and will return json of 'marked complete' to the client
            console.log("Marked Complete");
            response.json("Marked Complete");
        })
        .catch((error) => console.error(error)); //catching errors
});

//* setting up response to DELETE requests. (Deleting an item from the list)
app.delete("/deleteItem", (request, response) => {
    db.collection("todos")
        .deleteOne({ thing: request.body.itemFromJS }) //going into db to delete a document matching request.body.itemFromJS
        .then((result) => {
            // on success, will log "todo Deleted" and respond to the server that the todo was deleted
            console.log("Todo Deleted");
            response.json("Todo Deleted");
        })
        .catch((error) => console.error(error)); //error handling
});

//* Setting the server up to listen to requests on either hardcoded or the PORT within .env file
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`); //logs that the server is running on said PORT
});
