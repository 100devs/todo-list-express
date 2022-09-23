// Imports express..
const express = require('express')
// ..Using a function that creates an express application stored in the app variable.
const app = express()
// Imports MongoDB then connects to MongoDB through MongoClient.
const MongoClient = require('mongodb').MongoClient
// The (hard-coded) port stored in the PORT variable. Use process.env.PORT when deploying.
const PORT = 2121 || process.env.PORT
// Imports the dotenv (.env) module & the config() method takes a .env file path as an argument, it parses it and sets environment vars defined in that file in process.env.
require('dotenv').config()
// (I added this line) Imports the .env directory to access the config.js file. The config.js file exports the secret key using a DB_STRING variable.
const mongoAtlasLogin = require('./.env/config.js');

/* 
Three variable declarations: 
db is reassigned in the MongoClient.connect() method.
dbConnectionStr contains the database secret key within the DB_STRING variable within the .env directory.
dbName contains the database name located within Mongo Atlas.
*/
let db,
    dbConnectionStr = process.env.DB_STRING || mongoAtlasLogin.DB_STRING,
    dbName = 'todo';

/* Connects to MongoDB through MongoClient connect() method. 
The connect() method contains takes in two parameters.
The first parameter is the database secret key which is stored in the variable dbConnectionStr.
Th second parameter is an object with a key of useUnifiedTopology & a boolean value. 
The second parameter handles monitoring all the servers in a replica set or sharded cluster by opting in to use the new topology engine. */
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        // A template literal that uses a placeholder to print "Connected to todo Database".
        console.log(`Connected to ${dbName} Database`)
        // Reassigns the db variable and contains the database name stored in the dbName variable.
        db = client.db(dbName)
    })

// Tells Express to use EJS as the template engine.
app.set('view engine', 'ejs')
// Tells Express to make this public folder accessible to the public by using a built-in middleware.
app.use(express.static('public'))
// An express built-in method that recognizes the incoming Request Object as strings or arrays. Needed for POST & PUT requests.
app.use(express.urlencoded({ extended: true }))
// An express built-in method that recognizes the incoming Request Object as a JSON object. Needed for POST & PUT requests.
app.use(express.json())

// A route that is used to handle HTTP GET requests made to the application's / root.
app.get('/', async (request, response) => {
    // db.collection specifies the todos collection, finds the collection, stores documents into an array, and stores the result into the todoItems variable.
    const todoItems = await db.collection('todos').find().toArray()
    // db.collection specifies the todos collection, counts the documents with a completed property that contains a value of false and stores the number into the itemsLeft variable.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    /* Renders an object with the items & left property with values contained within the todoItems & itemsLeft variables. 
    The todoItems variable contains an array of documents within the todos collection.
    The itemsLeft variable contains a number. */
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // Lines 57~64 are commented out from the original repo, will not comment through.
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
});
// A route that is used to handle HTTP POST requests made to the address /addTodo.
app.post('/addTodo', (request, response) => {
    /* db.collection specifies the todos collection, adds an object into the document with a thing & completed property 
    The thing property receives its value from the form input located within the index.ejs file 
    The completed property has a boolean value, when it evaluates as true, it applies a class of completed onto span elements within the index.ejs */
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        // Prints a string
        console.log('Todo Added')
        // Refreshes the page after the POST request & displays the newly-added document in the collection.
        response.redirect('/')
    })
    // then/catch error handling
    .catch(error => console.error(error))
})
// A route that is used to handle HTTP PUT requests made to the address /markComplete.
app.put('/markComplete', (request, response) => {
    /* db.collection specifies the todos collection, updates the thing object and changes the completed property value to true 
    It also sorts the thing object so that c*/
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        // If there are multiple matches in the database, sort the matches in descending order and pick that one
        sort: {_id: -1},
        // If true, if the match doesn't exist, it can be created 
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Uncomplete')
        response.json('Marked Uncomplete')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemsFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})