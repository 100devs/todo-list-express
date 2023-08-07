const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const PORT = 2121;
require("dotenv").config();

// Defina vars for database
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = "todo";

// open connection to the db
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
    (client) => {
        console.log(`Connected to ${dbName} Database`);
        db = client.db(dbName);
    }
);

// configuration of the express app, with template render, public folder, url and json
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// requests for the index page
app.get("/", async (request, response) => {
    const todoItems = await db.collection("todos").find().toArray();
    const itemsLeft = await db
        .collection("todos")
        .countDocuments({ completed: false });
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

// request for the form adding TODOs
app.post("/addTodo", (request, response) => {
    db.collection("todos")
        .insertOne({ thing: request.body.todoItem, completed: false })
        .then((result) => {
            console.log("Todo Added");
            response.redirect("/");
        })
        .catch((error) => console.error(error));
});

// request from the event of client main.js to change to complete
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

// request from the event of client main.js to change to uncomplete
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

// request from the event of client main.js deleting a element
app.delete("/deleteItem", (request, response) => {
    db.collection("todos")
        .deleteOne({ thing: request.body.itemFromJS })
        .then((result) => {
            console.log("Todo Deleted");
            response.json("Todo Deleted");
        })
        .catch((error) => console.error(error));
});

// run the server in the port
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
