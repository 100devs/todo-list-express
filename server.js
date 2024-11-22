const express = require('express') // allows us to use express methods in this file
const app = express() // executes an instance of express in app variable
const MongoClient = require('mongodb').MongoClient // provides access to database methods (within MongoClient class) and to interact with MongoDB items
const PORT = 2121 // saves the port location where our server is listening
require('dotenv').config() // connects the .env file so we can use the database key/link without exposing our password. 

let db, /* set up a variable for the database in the glocal scope */
    dbConnectionStr = process.env.DB_STRING, /* store connection string from .env file in a variable */
    dbName = 'todo' /* save the name of our database to pass along to MongoClient */

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) /* connect to the MongoDB with the connection string & an additional property (using MongoDB driver's new connection management engine set to false by default). We are establishing a promise here */
    .then(client => { /* pass in client information back to the server once we get a promise response (which confirms a connection) */
        console.log(`Connected to ${dbName} Database`) /* use a template literal to print a confirmation message to console with the specific database name we created */
        db = client.db(dbName) /* store the database information we are getting in an instance of the client factory method in a previously declared variable */
    }) /* closing the .then */
    
/* Middleware methods we are using: Express */    
app.set('view engine', 'ejs') /* setting the ejs format as the default render to view our page */
app.use(express.static('public')) /* sets the default location folder for static assets like style.css and main.js */
app.use(express.urlencoded({ extended: true })) /* tells express to decode and encode url's where the header matched the content. Supports arrays and objects as well (extended) */
app.use(express.json()) /* replaces bodyparser; parses json content from incoming requests */


app.get('/',async (request, response)=>{ /* starts an asynchronous GET method when the root route is passed in, sets up request and response parameters */
    const todoItems = await db.collection('todos').find().toArray() /* awaits and stores all items in the database todos collection in an array */
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) /* awaits the number of uncompleted tasks and stores it */
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) /* send the items and the count in an object to the ejs file so it can be rendered correctly, and render the EJS file */

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {  /* uses an express POST method to create a new item using the route we are passing in from our EJS form */
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) /* finds the todos collection in the database and inserts a new todo item with a completed property of false */
    .then(result => { /* execute a response once we have confirmation that the item has been added */
        console.log('Todo Added') /* print a confirmation message to the console */
        response.redirect('/') /* respond by getting rid of the /addTodo route and then redirects to the root route, refreshing the page */
    }) /* closing the then response actions */
    .catch(error => console.error(error)) /* print errors to the console */
}) /* close the post action */

app.put('/markComplete', (request, response) => { /* starts an express PUT method to change the completion property of a todo item in the database using the /markComplete route */
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ /* look in the database to find the todo passed in from main.js and then start a new object */
        $set: { /* setting a property value */
            completed: true /* change the completion status to true */
          } /* close set block */
    },{ /* start another object */
        sort: {_id: -1}, /* moves item to the bottom of the list */
        upsert: false /* says if item does not already exist then do not insert this one */
    }) /* closes this collection of properties */
    .then(result => { /* if the update was successful then execute this arrow function */
        console.log('Marked Complete') /* print a confirmation message to the console that the update was successful */
        response.json('Marked Complete') /* send a JSON message to the client side (main.js) that change was successful */
    }) /*  */
    .catch(error => console.error(error)) /* an arrow function to print any errors to the console */
}) /* closes the PUT method block */

app.put('/markUnComplete', (request, response) => { /* start a PUT method to update a todo item as an uncompleted task through the /markUnComplete route and then manage the request and response with an arrow function */
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ /* find the todo item in the database and update it with the properties inside an object we are passing in here */
        $set: { /* set a property */
            completed: false /* set the completed property to a false value */
          } /* close the set block */
    },{ /* start an object with further properties to pass in */
        sort: {_id: -1}, /* sort the todo item to be at the bottom of the list */
        upsert: false /* if the item is not there, do not insert it */
    }) /* close this set of properties */
    .then(result => { /* attempt this arrow function if the update is suceessful */
        console.log('Marked Uncomplete') /* print a completion message to the console */
        response.json('Marked Uncomplete') /* send a JSON message back to the client indicating the update was successful */
    }) /* close the then block */
    .catch(error => console.error(error)) /* save and print any errors to our console */
}) /* close the PUT method */

app.delete('/deleteItem', (request, response) => { /* start a DELETE method to handle the request and response triggered by the /deleteItem route */
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) /* find the specific todo item in the database to delete */
    .then(result => { /* if the delete is successful complete the actions in this arrow function */
        console.log('Todo Deleted') /* print a confirmation message to the console that the delete was successful */
        response.json('Todo Deleted') /* send a JSON message back to the client side confirming the delete was successful */
    }) /* close the then block */
    .catch(error => console.error(error)) /* save any errors and print them to the console */
}) /* close the DELETE method */

app.listen(process.env.PORT || PORT, ()=>{ /* listen for a connection to the database at this saved port or the port of the .env file or deployment engine and then run an anonymous function */
    console.log(`Server running on port ${PORT}`) /* print confirmation message to the console indicating the port used */
}) /* close listen block */