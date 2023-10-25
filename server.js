//import 'express' module and assign it to the 'express' variable
const express = require('express')
//create an instance of the 'express' application and assign it to the 'app' variable
const app = express()
//Import mongoDB module and assign to the MongoClient variabel
const MongoClient = require('mongodb').MongoClient
//Define listen port
const PORT = 2121
//Import .env file that contains sensitive information
require('dotenv').config()

// declare db variable to store database
let db,
// Initialise dbConnetionStr with the value from .env file that contains the mongodb uri
    dbConnectionStr = process.env.DB_STRING,
    // initialise dbName with a string of todo
    dbName = 'todo'

// an object provided by the MongoDB Node.js driver that allows you to connect to and interact with MongoDB databases. 
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    
    // .then() is a method commonly used with Promises in JavaScript. It is used to specify what should happen once a Promise is resolved or fulfilled. When a Promise is resolved successfully, the code within the .then() block is executed. 'client' is a variable that represents the result or value that is passed when the Promise is fulfilled. Here, client represents the MongoDB client that is successfully connected to the database.
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        // establish a connection to the MongoDB database and make it accessible for your Express application. This allows you to perform operations on the database using the db variable, such as inserting, updating, and retrieving data from the 'todo' database within your Express routes and handlers.
        db = client.db(dbName)
    })
// configure Express app to use EJS template engine for rendering views   
app.set('view engine', 'ejs')``
// serves static files form the 'public' folder
app.use(express.static('public'))
//configures middleware to handle incoming data from HTML forms
app.use(express.urlencoded({ extended: true }))
//configures middleware to handle incoming JSON data
app.use(express.json())

//set up route for handling HTTP GET requests to the root path ('/')
app.get('/',async (request, response)=>{
    //inside root handler, it retrieves data from a MondoDB collection called 'todos'
    //'.find()' with no arguments provided, this searches for all documents in the 'todos' collection. 'toArray' converts the result of the 'find' operation into an array of JS objects. Each object represents a document from the collection
    const todoItems = await db.collection('todos').find().toArray()
    //queries the 'todos' collection to count the number of documents that have the 'completed' field set to 'false' 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //generate an HTML response using an EJS template (index.ejs). Sends the retrieved data 'todoItems' and 'itemsLeft' to the template to be rendered dynamically.
    //Note: items and left are keys in an object that is passed as the second argument to the response.render function. So, when your EJS template is rendered, you can access these variables as 'items' and 'left' within the template to dynamically populate content. For example, you might use <%= items %> and <%= left %> in your EJS template to display the to-do items and the number of items left to complete.
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
  
})

//sets up a route for handling POST requests to the '/addTodo' URL path
app.post('/addTodo', (request, response) => {
    //interacting with a MongoDB database specifically with the 'todos' collection. It inserts a new document into the collection. 'thing': The value of this field is taken from the request.body.todoItem
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        //redirects the user to the root URL ('/')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//set up route to handle HTTP PUT requests to the 'markComplete' URL path
app.put('/markComplete', (request, response) => {
    //This line interacts with a MongoDB database collection named 'todos.' It performs an update operation using the updateOne method. 'thing...' this query identifies the document to be updated: in this example it looks for the document where the 'thing' field matches the value received in the HTTP request body as 'itemFormJS' 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //sets the 'completed' field of the matched document to true, indicating that the to-do item is marked as complete.
        $set: {
            completed: true
          }
    },{ //specify that the documents should be sorted by the '_id' field in descending order (-1), and upsert is set to 'false,' which means a new document won't be created if no match is found.
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    //accessing the 'todos' collection within the MongoDB database. Then, it calls updateOne() on that collection.Inside the updateOne() method, there's a filter object {thing: request.body.itemFromJS} that specifies which document(s) to update. It looks for a document where the 'thing' field matches the value received in the HTTP request body as 'itemFromJS'. 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //$set is used in MongoDB to update or add fields within a document. Here it updates the 'completed' field of the matched document to 'false'
        $set: {
            completed: false
          }
    },{//sort docs in descending order
        sort: {_id: -1},
        upsert: false
    }) // after update operation is completed, '.then()' block to handle result
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})
//code sets up a route for handling HTTP DELETE requests to the path '/deleteItem'.
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})
// responsible for starting your Express server and listening on a specific port, which can be dynamically determined from the process.env.PORT environment variable or fallback to the default port (2121 in this case). 
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})