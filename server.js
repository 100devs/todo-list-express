const express = require("express");
// express middleware to handle most of the routes/req/responses
const app = express();
const MongoClient = require("mongodb").MongoClient;
// using mongodb module to help interaction with DB
const PORT = 2121;
// determining port used, could also add process.env.PORT if we're hosting somehwere
require("dotenv").config();
// import the .env file config, keeping secrets secure

let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo";

// declaring variables to communicate with DB (DB connection string from .env file and dbName will be todo).

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  // using mongo module to connect to DB with the connection string,
  // unifiedtopology (Set to true to opt in to using the MongoDB driver's new connection management engine.
  // You should set this option to true , except for the unlikely case that it prevents you from maintaining a stable connection.)
  .then((client) => {
    // promise, now could be async/await - so wait until connectiong happens and
    // then use the client connection info to connect to the db;
    // once connected, print to console
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
    // assign db to the object allowing connection.
    // Create a new Db instance sharing the current socket connections.
    // db(dbName)
    // Arguments:
    // dbName (string) – the name of the database we want to use.
    // Returns:
    // A db instance using the new database.
    /* example of said db instance:
    db = Db {
            _events: [Object: null prototype] {},
            _eventsCount: 0,
            _maxListeners: undefined,
            s: {
                dbCache: {},
                children: [],
                topology: NativeTopology {
                _events: [Object: null prototype],
                _eventsCount: 35,
                _maxListeners: Infinity,
                s: [Object],
                serverApi: undefined,
                [Symbol(kCapture)]: false,
                [Symbol(waitQueue)]: [Denque]
                },
                options: {
                authSource: 'admin',
                retryWrites: true,
                readPreference: [ReadPreference],
                promiseLibrary: [Function: Promise]
                },
                logger: Logger { className: 'Db' },
                bson: BSON {},
                readPreference: ReadPreference {
                mode: 'primary',
                tags: undefined,
                hedge: undefined
                },
                bufferMaxEntries: -1,
                parentDb: null,
                pkFactory: undefined,
                nativeParser: undefined,
                promiseLibrary: [Function: Promise],
                noListener: false,
                readConcern: undefined,
                writeConcern: undefined,
                namespace: MongoDBNamespace { db: 'todo', collection: undefined }
            },
            serverConfig: [Getter],
            bufferMaxEntries: [Getter],
            databaseName: [Getter],
            [Symbol(kCapture)]: false
            }

*/
  });

app.set("view engine", "ejs");
// use ejs as the view/render engine
app.use(express.static("public"));
// let every file dropped in public be servable by express with no question asked
app.use(express.urlencoded({ extended: true }));
// parse submitted form information
app.use(express.json());
// parse json to read requests body

app.get("/", async (request, response) => {
  // when GET request to "/" (landing page, usually index.html)
  const todoItems = await db.collection("todos").find().toArray();
  // create promise, get all items that are in todos collection and put them in an array
  const itemsLeft = await db.collection("todos").countDocuments({ completed: false });
  // count the documents in the db that have completed: false.  all items are in todoItems array, itemsLeft is a number with the amount of uncompleted todos.
  response.render("index.ejs", { items: todoItems, left: itemsLeft });
  // render index.ejs using the array of todo items, and the number of items uncompleted.

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
  // when POST request made to /addTodo
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem, completed: false })
    // go into the collection todos and insert one item based on the name given and set its completed property to false
    .then((result) => {
      // promise here again, so only once the insert promise settles we execute the next few lines
      // if it resolves (success), log it and redirect to index/landing page.
      console.log("Todo Added");
      response.redirect("/");
    })
    // if error, catch and log it.
    .catch((error) => console.error(error));
});

app.put("/markComplete", (request, response) => {
  // when PUT to /markComplete is made
  db.collection("todos")
    // go into the collection todos and update one of the items (the one where thing is = to what was selected)
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        //change its completed property to true
        $set: {
          completed: true,
        },
      },
      {
        // sort the list in decreasing _id and do not create the todo if it doesn't exist
        sort: { _id: -1 },
        upsert: false,
      }
    )
    .then((result) => {
      // promise, mark it complete if no error and return json to user with completed.
      // client side JS receives the "success" response and reloads the page
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    // catch and console the error
    .catch((error) => console.error(error));
});

app.put("/markUnComplete", (request, response) => {
  // when PUT to /markUnComplete is made
  db.collection("todos")
    // go into the collection todos and update one of the items (the one where thing is = to what was selected)
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        //change its completed property to false
        $set: {
          completed: false,
        },
      },
      {
        // sort the list in decreasing _id and do not create the todo if it doesn't exist
        sort: { _id: -1 },
        upsert: false,
      }
    )
    .then((result) => {
      // promise, mark it complete if no error and return json to user with completed.
      // client side JS receives the "success" response and reloads the page
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    // catch and console the error
    .catch((error) => console.error(error));
});

app.delete("/deleteItem", (request, response) => {
  //DELETE request made to /deleteItem
  db.collection("todos")
    // go into the db and delete the one where the item = thing property
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      // return the success of the promise so client-side can refresh the page
      console.log("Todo Deleted");
      response.json("Todo Deleted");
    })
    // log the error
    .catch((error) => console.error(error));
});

app.listen(process.env.PORT || PORT, () => {
  //"start" the server on port chose in .env - if no port in env, use the PORT variable
  // console log the server start
  console.log(`Server running on port ${PORT}`);
});
