const express = require('express')
// add express
const app = express()
// add the express app
const MongoClient = require('mongodb').MongoClient
// add mongodb telling server.js that we will be using mongdb and naming the variable MongoClient
const PORT = 2121
// declaring/establishing the port to listen to 
require('dotenv').config()
// .env file are files belonging to the productions environment that will not be listened to. env is also hidden??
// git ignore, it is ignored when your files are pushed up to production

let db,
// with comma is declared but undefined, connecting to  mongoClient with connection string
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
// declare three variables: the first is 'undefined', the other two are defined
// use mongo to connect to the database todo-list-express usint th cariable dbConnectionStr
// {useUnifiedTopologu : true} --> setting this to true opts in to using the mongodb driver's "new connection engine"
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
// we try to connect to the database, if successful console.log(string)   
.then(client => {
        console.log(`Connected to ${dbName} Database`)
        // message is sent in console if connection is properly established
        db = client.db(dbName)
        // deecho "# todo-list-work" >> README.md

// mainfines the database that it will work with
    })
    
app.set('view engine', 'ejs')
// middlewear that handles the engine **determines how we're going to use a view (template) engine to render ejs (embedded JavaScript) commands for our app
app.use(express.static('public'))
// directing the app to use the public folder where it will use the css and js folder. **Tells our app to use a folder named "public" for all our static files (e.g. images and css file)
app.use(express.urlencoded({ extended: true }))
// validates the information being passed through it to make sure that it true **call to middleware that cleans up how things are displayed and how our server communicates with our client (Similar to useUnifiedTopology above.)
app.use(express.json())
// use express libarary on JSON file **Tells the app to use Express's JSON method to take the object and turn it into a JSON string

// this is the route that handles what happens when the user visits the homepage.
// the code runs and it gets this information
// ROUTES
app.get('/',async (request, response)=>{
    // GET stuff to display to users on the client side (in this case, index.ejs) using asynchronous function
    const todoItems = await db.collection('todos').find().toArray()
    // go to 'todo' database and converts to an array of objects called 'toDo'
    // create a variable 'todoItems' it waits for server to get the information ** Create a constant called "todo items" that goes into our database, create a collection called "todos", find anything in that database, and turn it into an array of objects
    const itemsLeft = await db
    // Creates a constant in our todos collection
    .collection('todos')
    // Looks at documents in the collection
    .countDocuments({completed: false})
// these are all items still waiting to be done.  The .countDocuments method counts the number of documents that have a completed status equal to "false" (You're going and counting how many to-do list items haven't been completed yet. "what is still left on the agenda?") 
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
//    rendering items left on the 'todo' list after you have iterated through the items
   
    db.collection('todos').find().toArray()
    // goes to database inn the collection of 'todo's, then asks the get to find the item and return it as an array
        .then(data => {
        // then  once that data has been grabbed
            db.collection('todos').countDocuments({ completed: false })
            // go to the database collection of 'todo's. count the number of documents and it the items are showing as false
                .then(itemsLeft => {
            // with the items that are left
                    response.render('index.ejs', { items: data, left: itemsLeft })
                    // render the response into index.ejs, responding witht eh items left qhich are now called data and left wich are now called itemsLeft
                })
            // close then block
        })
        // close first then block
        .catch(error => console.error(error))
    // if nothing can be returned then return an error
})
// close full block

app.post('/addTodo', (request, response) => {
    // post request, posting to the todo route. tells what request and response to return
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false })
        // go to database, look at the collection called 'todos' onsert one thin. that thing will come from request body under rhee todo items but the complteted status will be false
        .then(result => {
        // then witht the results
            console.log('Todo Added')
            // console log todo added
            response.redirect('/')
            // server is then refreshed
        })
        // close the then block
        .catch(error => console.error(error))
    // catch any errors and console log them
})
// close post block

app.put('/markComplete', (request, response) => {
    // this is the update function posting to the markcomplete route. request and response 
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
        // go to database collection todo, update one item in the items marked things. request the body in the items from JS section
        $set: {
            // set
            completed: true
            // complete items to true. once it is marked as complete it now becomes true, this triggers css which turns the line gray and strikes a line through it.
        }
        // block this code
    }, {
        // closes completed block and opens new closure
        sort: {_id: -1},
        // Once a thing has been marked as completed this sorts the aray by descening order by ID
        upsert: false
        // Doesn't create a document for the todo if the item isn't found
    })
    .then(result => {
        // Assuming that evrything went okay and we got a result
        console.log('Marked Complete')
        // console log "mark completed"
        response.json('Marked Complete')
        // return response of "marked complete" to the fetch main.js
    })
    .catch(error => console.error(error));
    // something has been broken, an error is logged to the console

})

app.put('/markUnComplete', (request, response) => {
    // This route unclicks a thing that you've marked as complete - will take away complete status
    db.collection('todos')
    // Go into todos collection
    .updateOne({thing: request.body.itemFromJS},{
        // look for items from itemFromJS
        $set: {
            completed: false
            // Undos what was done with markComplete. It changes "completed" status to "false"
          }
    },{
        sort: {_id: -1},
        // Once a thing has been markd Uncomplete, this sorts the array be descending order by ID
        upsert: false
        // if "todo" item is not found, document is not created
    })
    .then(result => {
        // Assuming that everything went okay and we got a result...
        console.log('Marked Complete')
        // "console.logs complete if is complete"
        response.json('Marked Complete')
        // returns "mark complete" to the fetch in main
    })
    .catch(error => console.error(error))
// an error is logged to console as something has broken
})

app.delete('/deleteItem', (request, response) => {
    // delete
    db.collection('todos')
    // Goes into your collection
    .deleteOne({thing: request.body.itemFromJS})
    // Uses deleteOne Method and find a thing that matches the name of the thing you click on
    .then(result => {
        // assuming everything went okay
        console.log('Todo Deleted')
        // console.log Todo deleted
        response.json('Todo Deleted')
        // Returns response of "Todo Deleted" to the fetch in main.js
    })
    .catch(error => console.error(error))
// (something is broken, and error is logged to the console)
})

app.listen(process.env.PORT || PORT, ()=>{
    // Tells our server to listen for connections on the PORT we defined as a constant earlier OR eearlier process.env.PORt will tell the server to listen on the port of the app (e.g., the PORT used by Heroku)
    console.log(`Server running on port ${PORT}`)
    // log the port number or server is running on
})