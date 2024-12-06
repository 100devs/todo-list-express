// import express
const express = require("express");
// call the express function and store it in the `app` variable
const app = express();
// create instance of the Mongo Client which represents a pool of connections to the database
const MongoClient = require("mongodb").MongoClient;
// set the port that we'll use for our application
// this is where our server is listening for requests
const PORT = 2121;
// require the dotenv package to keep environment variables secret
require("dotenv").config();

// set variables for the database
let db,
    // store connection string for database in this variable
    dbConnectionStr = process.env.DB_STRING,
    // name the database
    dbName = "todo";

// connect to the Mongo DB database, using the connection string
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
    (client) => {
        // print successful database connection to the console
        console.log(`Connected to ${dbName} Database`);
        // store the database name in the db variable
        db = client.db(dbName);
    }
);

// middleware methods used
// set the view engine to EJS
app.set("view engine", "ejs");
// serve files in the public directory as static files
app.use(express.static("public"));
// parse incoming requests with urlencoded payloads
// The “extended” syntax allows for rich objects and arrays to be encoded into the URL-encoded format, allowing for a JSON-like experience with URL-encoded.
// essentially decode URLS and arrays where the body matches the content type
app.use(express.urlencoded({ extended: true }));
// middleware to parse json data from incoming requests, replaces body-parser
app.use(express.json());

// for GET requests on the root route
app.get("/", async (request, response) => {
    // asynchronous request to go to the todos collection, find everything, and turn it into an array, store the result in todoitems variable
    const todoItems = await db.collection("todos").find().toArray();
    // return from the db all the todos that aren't completed yet, store in itemsLeft variable
    const itemsLeft = await db
        .collection("todos")
        .countDocuments({ completed: false });
    // render the response in ejs, passin the variables under items and left
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

// POST requests on the /addTodo route
app.post("/addTodo", (request, response) => {
    // to the db collection todos
    db.collection("todos")
        // insert one todo: thing comes from the request body "todoItem", and completed is set to false
        .insertOne({ thing: request.body.todoItem, completed: false })
        // after this is done
        .then((result) => {
            // log to the console
            console.log("Todo Added");
            // refresh the page to the root route
            response.redirect("/");
        })
        // throw the error if we have one
        .catch((error) => console.error(error));
});

// a PUT request on the "mark complete route"
app.put("/markComplete", (request, response) => {
    // on the todos DB collection
    db.collection("todos")
        // update one item in the databse
        .updateOne(
            // get the item from the request body in the JS (comes from the client side code)
            { thing: request.body.itemFromJS },
            {
                // set the completed field to true
                $set: {
                    completed: true,
                },
            },
            {
                // move the item to the bottom of the list
                sort: { _id: -1 },
                // if this item doesn't exist, don't insert it
                upsert: false,
            }
        )
        // upon success
        .then((result) => {
            // log to to the console
            console.log("Marked Complete");
            // send a json response to the client that it was successful
            response.json("Marked Complete");
        })
        // print the error if there is one
        .catch((error) => console.error(error));
});

// a PUT request on the mark uncomplete route
app.put("/markUnComplete", (request, response) => {
    // on the todo database
    db.collection("todos")
        // update one item in the database
        .updateOne(
            // get the thing from the request body from the client JS
            { thing: request.body.itemFromJS },
            {
                // set completed to false
                $set: {
                    completed: false,
                },
            },
            {
                // sort to the bottom of the list
                sort: { _id: -1 },
                // don't insert this if it doesn't exist already
                upsert: false,
            }
        )
        .then((result) => {
            // log to the console
            console.log("Marked Complete");
            // send a response back to the client that it's successful
            response.json("Marked Complete");
        })
        // log the error
        .catch((error) => console.error(error));
});

// DELETE request on the deleteitem route
app.delete("/deleteItem", (request, response) => {
    // on the todos database
    db.collection("todos")
        // delete one item, based on the request body we get from the client side JS
        .deleteOne({ thing: request.body.itemFromJS })
        // upon success
        .then((result) => {
            // log to the console
            console.log("Todo Deleted");
            // send a response to the client
            response.json("Todo Deleted");
        })
        // log the error if there is one
        .catch((error) => console.error(error));
});

// set the app to listen on the port set within the .env file
app.listen(process.env.PORT || PORT, () => {
    // log that the server is running
    console.log(`Server running on port ${PORT}`);
});
