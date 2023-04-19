// import express module
const express = require('express')
// Creates an express application
const app = express()
// imports the mongoDB client, then create a new MongoClient instance
const MongoClient = require('mongodb').MongoClient
// Defines what port our server will run on and stores in a variable
const PORT = 2121
// imports dotenv module and allows us to laod enivronmental variables from a .env file into our application
require('dotenv').config()

// Defines 3 variables, dbName = what db we want to connect to, dbConnectionStr = str to connect to our db, db = just define it
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// This is connecting to our db, Running the connect method, the first parameter is our dbStr as the url, second parameter is an options object
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
//It then returns a promise, and once fulfilled we run what is below
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        // dbName variable is passed as an argument to the db() method, and specifies the name of the database that you want to connect to.
        //Client is a return value from the promise
        db = client.db(dbName)
    })
    
/* 
MIDDLEWARE FUNCTIONS 
*/

// set templating/views engine to ejs
app.set('view engine', 'ejs')
// allows express to serve up our static files in the public directory
app.use(express.static('public'))
// Used for handling form submissions
app.use(express.urlencoded({ extended: true }))
// parses all the incoming requests into JSON object for us to work with and maks the request data available in the req.body property
app.use(express.json())


// route handler that will handle GET requests on '/' path.  , second paramter is a async callback function that is run when a get request is made
app.get('/',async (request, response)=>{
    // finds all the items in the todo collections and turns them into an array. Does this asynchronously,
    const todoItems = await db.collection('todos').find().toArray()
    // counts all the documents in the todos collection that have the property completed set to false. Does this asynchronously
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Renders the index.ejs file as the response, while passing in an object that hold properties that we can use in the ejs syntax
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
// sets up a route handler on the server that will handle POST requests sent to the /addTodo path, and defines a callback function that will be called when a POST request is received.
app.post('/addTodo', (request, response) => {
    // inserts a document into the todos collection. The propertiy thing of the object come from the request body, and  completed is hardcoded
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // once the promise has resolved. eg: document inserted into collection the following is run:
    .then(result => {
        console.log('Todo Added')
        // redirect user back to the root/index. Makes a get request to get updated 'root'
        response.redirect('/')
    })// used to log any errors in the promise chain, Called after the promise is rejected.
    .catch(error => console.error(error))
})

// route handler that handle PUT request to 'markComplete' path. Defines a callback function that will be called when a put request is received.
app.put('/markComplete', (request, response) => {
    // updates a document in the todo's collection. The document will be one that matches the thing property with value from request.body
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // sets the completed property of the document to true
        $set: {
            completed: true
          }
    },{//options parameter for updateOne method
        sort: {_id: -1},
        upsert: false
    }) 
    .then(result => {
        console.log('Marked Complete') // log in the node console
        response.json('Marked Complete') // send response 'marked complete' back to the client in json()
    })// if promise is rejected then catch will run
    .catch(error => console.error(error))

})

// route handler for any put requests to mark incomplete, Defines callback function that will be called when a put request is recieved
app.put('/markUnComplete', (request, response) => {
     // updates a document in the todo's collection. The document will be one that matches the thing property with value from request.body
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // sets the completed property of the document to false
        $set: {
            completed: false
          }
    },{//options parameter for updateOne method
        sort: {_id: -1},
        upsert: false
    })// once promise(ie update successful)has be resolved run the then method
    .then(result => {
        console.log('Marked Complete') // log in the node console
        response.json('Marked UnComplete')// send response 'marked complete' back to the client in json
    })// if promise is rejected then catch will run
    .catch(error => console.error(error))

})


// route handler dor delete requests to /deleteItem path, route handler also takes in a callback function
app.delete('/deleteItem', (request, response) => {
    // deleting a document in the 'todos collection. The document  deleted is the one that matches the query
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //once promise has resolved (ie deleted) run the then method.
    .then(result => {
        console.log('Todo Deleted') // log in node console
        response.json('Todo Deleted')// send response 'ToDo deleted' back to the client in JSON
    })// if promise is rejected then catch will run
    .catch(error => console.error(error))

})

//starts the server and listens for incoming HTTP requests on the specified ports.
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})

