// REQUIREMENTS
// commonjs way of "importing" express module.. aka using it
const express = require("express");
// assign the express module to the variable "app"
const app = express();
// import mongodb and create a new mongoclitent
const MongoClient = require("mongodb").MongoClient;
// create PORT variable, set to listen on port 2121
const PORT = 2121;
// load dotenv module..an npm package that automatically loads environment variables from a .env file into the process.env object..(such as server connection string)
require("dotenv").config();

//Create the variables to access the mongoDB database.
// db will be the variable for the database
let db,
    // dbConnection string is the connection string to our mongo database
    dbConnectionStr = process.env.DB_STRING,
    // the database name is dbName
    dbName = "todo";

// connect to the database using the MongoClient’s connect method and our connection string variable
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
    (client) => {
        // using a promise, if connection to db is successful console log
        console.log(`Connected to ${dbName} Database`);
        // assign the dbname of the client to db variavle
        db = client.db(dbName);
    }
);

// tell express we are using ejs as the template engine.. must go before use/get/post
app.set("view engine", "ejs");
// To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express... now all files/images in that directory are loaded
app.use(express.static("public"));

// body parser is a middleware now built in with express. it cleans up the incoming request object body before we use our CRUD operations on them
// The urlencoded method extract data from the <form> element and adds them to the body property in the request object
app.use(express.urlencoded({ extended: true }));
//Converts the sent object to JSON for the server to read.
app.use(express.json());

app.get("/", async (request, response) => {
    // make an array out of  documents in the "todos" collection
    const todoItems = await db.collection("todos").find().toArray();
    
    // number of iitems left = number of documents that are not completed
    const itemsLeft = await db
        .collection("todos")
        .countDocuments({ completed: false });
    
    // render the results
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

app.post("/addTodo", (request, response) => {
    db.collection("todos")
        .insertOne({ thing: request.body.todoItem, completed: false })
        .then((result) => {
            console.log("Todo Added");
            response.redirect("/");
        })
        .catch((error) => console.error(error));
});

app.put("/markComplete", (request, response) => {
    db.collection("todos")
        .updateOne(
            { thing: request.body.itemFromJS },
            {
                $set: {
                    completed: true,
                },
            },
            {
                sort: { _id: -1 },
                upsert: false,
            }
        )
        .then((result) => {
            console.log("Marked Complete");
            response.json("Marked Complete");
        })
        .catch((error) => console.error(error));
});

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
                sort: { _id: -1 },
                upsert: false,
            }
        )
        .then((result) => {
            console.log("Marked Complete");
            response.json("Marked Complete");
        })
        .catch((error) => console.error(error));
});

app.delete("/deleteItem", (request, response) => {
    db.collection("todos")
        .deleteOne({ thing: request.body.itemFromJS })
        .then((result) => {
            console.log("Todo Deleted");
            response.json("Todo Deleted");
        })
        .catch((error) => console.error(error));
});
// We need to create a server that browsers can connect to. We do this by using the Express’s listen method... set to listen to environments port, or defaults to our hardcoded variable PORT

app.listen(process.env.PORT || PORT, () => {
    // when server starts, console logs this message
    console.log(`Server running on port ${PORT}`);
});
