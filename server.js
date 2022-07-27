// Importing ExpressJS and MongoDB as well as set up the ExpressJS server.
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

// declaring and intializing default port number if no ENV/invalid ENV
const PORT = 2121;

// dotenv module nodejs - imports .env file 
require('dotenv').config();

// Setting the database variables
let db,
    dbConnectionStr = process.env.DB_STRING, //reads .env file for DB_STRING to connect to MongoDB
    dbName = 'todo';


MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
//actually connecting to the DB using DB_STRING
   .then(client => { 
        //after connecting, logs that it is connected
        console.log(`Connected to ${dbName} Database`);
        //assign the db from mongo to db variable
        db = client.db(dbName);
    });
    
// set express's view engine to ejs
app.set('view engine', 'ejs');
// public folder as freely available static files, and the root static directory is "/"
// /css/styles.css
app.use(express.static('public'));
// Converts raw POST data from simple HTML forms into an object and assign it to req.body
app.use(express.urlencoded({ extended: true }));
// parse req.body as json
app.use(express.json());

//READ - responds to the "/" route - mytodolist.herokuapp.com/
//req is from the browser, response what we're sending back to the client
app.get('/', async (request, response) => {
    //with array of items from the databases
    const todoItems = await db.collection('todos').find().toArray();
    // How many objects that have the property of completed to false.
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false });
    //responds using ejs template - passes todoItems and itemsLeft to the browser
    response.render('index.ejs', { items: todoItems, left: itemsLeft });

    //callback method example:
   
    /* db.collection('todos').find().toArray()
        .then(data => {
            db.collection('todos').countDocuments({completed: false})
            .then(itemsLeft => {
                response.render('index.ejs', { items: data, left: itemsLeft })
            })
        })
        .catch(error => console.error(error)) */
});

//CREATE - add document to collection=>db; handles /addTodo request
//hands the HTML form to /addTodo == POST request
app.post('/addTodo', (request, response) => {
    //insert request.body.todoItem into the todos collection, set completed to false on that item
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        //logs that we added
        console.log('Todo Added');
        //sends us back to the root (main page)
        response.redirect('/');
    })
    //if this db write action fails, log the error from mongoDB to the console
    .catch(error => console.error(error))
});

//UPDATE - handles the /markComplete request: toDoList item that got clicked sends req.body
app.put('/markComplete', (request, response) => {
    //find the document that matches thing = req.body.itemFromJS, then:
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //set completed to true
        $set: {
            completed: true
          }
    },{
        //find the first in reverse order
        sort: {_id: -1},
        //dont insert if its not there
        upsert: false
    })
    //what do we send back? result
    .then(result => {
        //log that we marked it to console
        console.log('Marked Complete')
        //send json of 'marked complete' back to the browser
        response.json('Marked Complete')
    })
    //if our DB update fails:
    .catch(error => console.error(error))

})
//update when marked uncomplete, handle /markUncomplete request
app.put('/markUnComplete', (request, response) => {
    //find the document in todos collection that matches thing from req.body.itemFromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //set completed to false on the document
        $set: {
            completed: false
          }
    },{
        //find the first in reverse order
        sort: {_id: -1},
        //dont add a new one if nothing matches thing
        upsert: false
    })
    // responds with marked complete JSON and console logs it as well
    .then(result => {
        //marked...uncomplete?
        console.log('Marked Complete')
        response.json('Marked Complete')
    })

    // logs error in to the console if we cant update the db
    .catch(error => console.error(error))

})
//DELETE - handling the req to /deleteItem from main.js
app.delete('/deleteItem', (request, response) => {
    //find a document that matches thing and delete it
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS })
    //console log todo deleted and respond with a json object stating the deletion
    .then(result => {
        console.log('Todo Deleted')
        //pass what we did back to the browser
        response.json('Todo Deleted')
    })
    //logs error if unable to find in the DB
    .catch(error => console.error(error))

})

//listening to env variable port OR PORT if no .env available
app.listen(process.env.PORT || PORT, () => {
    //log that we're running!
    console.log(`Server running on port ${PORT}`)
});