// imports the express framework
const express = require('express')
// initializes the express framework
const app = express()
// imports MongoDB and assigns the MongoClient property to a variable MongoClient
const MongoClient = require('mongodb').MongoClient
// sets the port to 2121
const PORT = 2121
// requires dot env package so that you can make a dot env file with environment variables to hide sensitive information, like the mongoDB connection string
require('dotenv').config()

// runs the app on the port defined in the environment variables, if one is defined in the environment variables.


// declaring three variables, and also assigning:
//1.  the environment variable DB_STRINg to the dbConnectionStr variable
//2. the db name (todo) to the variable dbName
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// connecting to MongoDB with the dbConnectionStr, then console.log()ing the name of the db, and setting the db variable equal to the db represented by dbName.
// Errors connecting to MongoDB will not be logged in this scenario.
// MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
//     .then(client => {
//         console.log(`Connected to ${dbName} Database`)
//         db = client.db(dbName)
//     })
    
//  These are four Express middleware functions:
// sets EJS as the templating engine, so that we can make EJS views:
app.set('view engine', 'ejs')
// sets the public directory as the location for static files (like css files, front-end js files, and images)
app.use(express.static('public'))
// express.urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays
app.use(express.urlencoded({ extended: true }))
// To handle HTTP POST requests in Express.js version 4 and above, you need to install the middleware module called body-parser.
// body-parser extracts the entire body portion of an incoming request stream and exposes it on req.body.
app.use(express.json())

// else, it runs on the port # assigned to the variable PORT.
app.listen(process.env.PORT || PORT, ()=>{
    // once the app is up and running, log the port number.
    console.log(`Server running on port ${PORT}`)
})


// this is the route used to get the index.html file at the root of the application. It's an async function so that we can use
// await on the DB operations. Those need to be called asynchronously since they take time. We need to call the parent function with async to await in the body.
app.get('/',async (request, response)=>{
    // get all the todoItems from the todos collection in the database, and then turn the cursor that is returned from find() into an array so we can use it.
    const todoItems = await db.collection('todos').find().toArray()
    // get the count of todo items that are not yet completed (where the value of completed is false)
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // renders the index.ejs page, and passes the results of the last two lines to the template so we can use those values on the front end.
    response.render('index.ejs', { items: todoItems, left: itemsLeft })


    // this code does the same thing as the code above, but it is written with promises rather than async/await.

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// this is the route used to handle post (create) requests to /addToDo It is not an asynchronous function, so we can't use await in the body.
app.post('/addTodo', (request, response) => {
    // this takes the todoItem inputted from the front end (and attached to request.body), and set completed to false for the new todoitem document.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        // after the server is finished adding the todo item, the application console.log()s 'Todo added', and then redirects the browser to the '/' get request route.
        console.log('Todo Added')
        response.redirect('/')
    })
    // if there is an error in adding the todo to the db, it is logged to the console as an error.
    .catch(error => console.error(error))
})

// this is the put (edit) route to edit a todo item and mark it complete
app.put('/markComplete', (request, response) => {
    // updateOne finds the todo item with the value 'itemFromJS' (which has been attached to the body of the request) for the key 'thing'
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // once it finds it, it sets the completed key of the document to true.
        $set: {
            completed: true
          }
    },{
        // sorts them in descending order by ID, which will also sort them in reverse chronological order by added date.
        sort: {_id: -1},
        // does not add a document to the db if mongodb doesn't find a match
        upsert: false
    })
    .then(result => {
        // once this finishes, it console.log()s 'Marked complete' 
        console.log('Marked Complete')
        // and sends 'Marked complete' back to the front end as a JSON string
        response.json('Marked Complete')
    })
    // If there is an error, it is logged to the console as an error.
    .catch(error => console.error(error))

})

// this is the put (edit) route to edit a todo item and mark it incomplete
app.put('/markUnComplete', (request, response) => {
    // updateOne finds the todo item with the value 'itemFromJS' (which has been attached to the body of the request) for the key 'thing'
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // once it finds it, it sets the completed key of the document to false.
        $set: {
            completed: false
          }
    },{
        // sorts them in descending order by ID, which will also sort them in reverse chronological order by added date.
        sort: {_id: -1},
        // does not add a document to the db if mongodb doesn't find a match
        upsert: false
    })
    .then(result => {
        // once this is done, console.log() 'Marked Complete'
        console.log('Marked Complete')
        // respond to the front end with the json string 'Marked complete'
        response.json('Marked Complete')
    })
    // if there's an error, log it to the console
    .catch(error => console.error(error))

})


// this is the delete (delete) route to edit a todo item and mark it complete
app.delete('/deleteItem', (request, response) => {
    // finds the document with the request.body.itemFromJS value (which has been attached to the req.body object by the front end) for the thing key.
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        // once it is deleted, console.log() 'Todo deleted' and responds to the front end with 'Todo deleted' as a JSON string
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    // if there is an error at any point in this process, log it to the console as an error.
    .catch(error => console.error(error))

})

