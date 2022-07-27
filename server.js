// declaring the variable express, setting it equal to the return value from the
// NodeJS function require(), which returns the modules export object
const express = require('express')
// declaring the variable app and setting it equal to the express function
// which returns a new express application
const app = express()
// declaring the MongoClient class, setting it equal to the NodeJS function
// require() then calls the mongodb module export object itself .MongoClient
const MongoClient = require('mongodb').MongoClient
// declaring the PORT variable to set the port the server needs to listen for
// requests on.
const PORT = 2121
// calling the NodeJS function require to access the dotenv module, and calling
// the config() function to make sure your .env file is seen by the dotenv module
require('dotenv').config()

// declaring 3 variables at once:


// db - initialized but undefined, to be set by MongoClient.connect() later
let db,
// dbConnectionStr - set to the variable DB_STRING present in the .env file
    dbConnectionStr = process.env.DB_STRING,
// dbName - set to a string value, the name of the db in my mongodb account I'm
// going to access
    dbName = 'todo'

// Calling the mongodb function connect(), creating a connection to my db. This
// returns a Promise, a reference to an instance of my database 'todo'
// passing in my connection string, and opting in to Mongodb driver connection
// management engine with the setting useUnifiedTopology. No callback argument
// passed in, so this will eventually return the fulfilled or rejected Promise.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
// connect() returns the reference, so calling .then() and passing in only one
// callback function for the fullfilled case, intentionally not providing a
// rejected case callback function. Client is the parameter name I provide for
// the returned mongoclient object.
    .then(client => {
// logging that I've connected to the db once the promise if fulfilled.
        console.log(`Connected to ${dbName} Database`)
// setting the previously undefined but declared db var to the return value of
// the db() method, passing in the name of my database as the argument.
        db = client.db(dbName)
    })

// Middleware calls to the express application methods

// Calling the express application method set to set the rendering engine to ejs
app.set('view engine', 'ejs')
// Calling the express application method use to set the output directory for
// rendered static files to 'public'
app.use(express.static('public'))
// Calling the express application method use to set express to have the added
// ability to parse strings, arrays, and nested objects as well -- using
// {extended: true}
app.use(express.urlencoded({ extended: true }))
// Calling the express app method use to set express to be able to parse json
// objects as well.
app.use(express.json())

// This is for when someone visits the main site address.
// Calling the express app method get to set up the api route for the main site
// address, i.e. the root '/', and passing in a callback function as the second
// argument, containing two parameters request and response.
app.get('/', async (request, response)=>{
    // declaring the constant todoItems to store the return value coming from
    // calling the find() method on my collection. This returns a pointer to all
    // documents in the collection, and calling toArray() converts it to an array
    const todoItems = await db.collection('todos').find().toArray()
    // declaring the constant itemsLeft as the return value coming from calling
    // the countDocuments() method, passing in a filter for only those documents
    // where the completed field is set to false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // after receiving the response from express - which should be an ejs file -
    // use the express view engine to render the ejs to HTML - passing in the
    // ejs file name, and then the variables 'items' and 'left' wrapped in a
    // locals object
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// This is for whenever someone wants to add an item to the collection.
// Setting up the api route for requests to the site at /addTodo , passing in a
// callback function with parameters named request and response.
app.post('/addTodo', (request, response) => {
    // calling the .insertOne() method on the collection, passing in what I want
    // the document properties to have. This request has the values from the input
    // element in the form section of the site wrapped in the body, and completed
    // is automatically set to false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // the response calls this method and will pass in the result argument
    .then(result => {
        // console log that the todo item was added on the server side
        console.log('Todo Added')
        // redirect the browser to the root '/' page to call from the database 
        // and load it fresh
        response.redirect('/')
    })
    // if the insertOne() fails, it will pass in the error, and console log
    // that error on the server side
    .catch(error => console.error(error))
})

// Setting up the api route for making updates to the todo list. When the event
// listeners set up in /public/js/main.js call to this route, it passes the
// todo list text in the request body, and I use that to search the collection
// for the document.
app.put('/markComplete', (request, response) => {
    // calling the updateOne() method which takes three params:
    // the document property and value I'd like to match with(search for),
    // the document property and value I want to change on that document when I
    // find it,
    // and finally any other options
    db.collection('todos').updateOne({
      // The document I'm looking for has the 'thing' property set to what's in
      // request.body.itemFromJS
      thing: request.body.itemFromJS
    },
    {
      // I want it to change/$set whatever is in the completed property to true
      $set: {
          completed: true
          }
    },
    {
      // The options for this updateOne request
      // use sort with -1 on the objectID to only update the most recently added
      // document
        sort: {_id: -1},
      // use upsert as false to make sure that if the search fails to match, no
      // new documents are created with the properties of request.body.itemFromJS
        upsert: false
    })
    // Setting the .then() to receive the fulfilled or rejected promise
    // with only the fulfilled callback, and providing the parameter 'result'
    // even though I don't use it for anything ;)
    .then(result => {
        // console.logging on the server side
        console.log('Marked Complete')
        // console.logging on the client side. This is done by passing this
        // back to the client where you can see it used in main.js by the
        // markedComplete() function in const data = await response.json()
        response.json('Marked Complete')
    })
    // if it fails to update, console log the error
    .catch(error => console.error(error))

})

// This is to 'unmark' a task as completed, initiated by the client side through
// main.js. The event listeners pass the innerText of the todo task element, and
// that's used here to search for the matching collection document, and update the
// completed property to be false. Returns a json back to be console logged on
// the client side browser main.js.
app.put('/markUnComplete', (request, response) => {
    // calling the updateOne() method just like in the route above, only instead
    // of setting completed to true, set it to false.
    db.collection('todos').updateOne(
    {
      // Search for the doc using the request body property itemFromJS
      thing: request.body.itemFromJS},
    {
      // use the $set operator to change the completed property value to false
      $set: {
        completed: false
      }
    },
    {
      // Same options as in the route /markComplete
      // sort by object id to update the most recently added document
      sort: {_id: -1},
      // set upsert to false so it doesn't create a new doc if the search fails
      upsert: false
    })
    // Using .then() and passing the success callback function with the parameter
    // 'result' even though I don't use it for anything. ;)
    .then(result => {
        // console log on the server side
        console.log('Marked Complete')
        // pass a response back to the client to be console logged in the browser
        response.json('Marked Complete')
    })
    // set up the catch in case there's an error, so it console logs the error
    .catch(error => console.error(error))

})

// This is to delete a todo task from the database. This request originates from the
// clientside main.js, which will pass inside the request body an 'itemFromJS'
// property containing the innerText of the todotask element. Going to use that
// value to search for the document in the db collection using the function
// deleteOne()
app.delete('/deleteItem', (request, response) => {
    // using the deleteOne() method, passing in the field and value I want to
    // search for in the collection. If I find that document, it gets deleted.
    db.collection('todos').deleteOne(
      // using the field 'thing' and passing in what I got from the clientside
      // request body as the value to search for.
      {thing: request.body.itemFromJS})
      // calling the .then() method and naming the resulting parameter 'result',
      // even though I don't use it for anything.
    .then(result => {
        // console logging on the server side to confirm
        console.log('Todo Deleted')
        // passing back a response to be console logged on the client side browser
        response.json('Todo Deleted')
    })
    // if the promise is rejected, console log the error on the server side.
    .catch(error => console.error(error))

})

// Calling the express application method app.listen() to set up what port the
// server needs to listen for requests on. Using OR operator so that it prioritizes
// what's in my .env file for the variable PORT, and if it's not there use the local
// variable PORT instead.
app.listen(process.env.PORT || PORT, ()=>{
    // Once the server is set to listen to the right port, console log to confirm
    console.log(`Server running on port ${PORT}`)
})
