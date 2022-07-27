// Import Express package and assign to variable
const express = require('express')
//Create Express application
const app = express()

//Import MongoDB library 
const MongoClient = require('mongodb').MongoClient
//Assign local port number
const PORT = 2121

//Configure .env file, so that you can import secrets 
require('dotenv').config()

//Declare database, connection string, database name
let db,  
    dbConnectionStr = process.env.DB_STRING,    //get db connection string from .env
    dbName = 'todo'

//Connect to MongoDB database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`) //once successfully connected, log message in console
        db = client.db(dbName)  //assign the 'todo' database to db variable
    })

app.set('view engine', 'ejs')  //Set up app to use EJS as the HTML templating language
app.use(express.static('public'))  //Set up public folder to serve CSS, JS, and image files
app.use(express.urlencoded({ extended: true })) // Use Express' built-in middleware to parse incoming requests with urlencoded payloads 
app.use(express.json()) //Use Express' json parser middleware

//Handle GET (READ) requests to the main route
app.get('/', async (request, response)=>{
    //query the database to find all the todo documents, and put them into an array
    const todoItems = await db.collection('todos').find().toArray()  

    //find all the todos that are NOT completed, count them, and assign that number to itemsLeft
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})

    //render the index.ejs file, passing in todoItems and itemsLeft as variables 
    response.render('index.ejs', { items: todoItems, left: itemsLeft })

    //Alternate Promise-based version of the refactored async/await code
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//Handle POST (CREATE) requests on the addTodo route 
app.post('/addTodo', (request, response) => {
    //Add new a document to the 'todos' collection in the db. The 'thing' value is the todoItem text passed from the front end in the body of the request, and 'completed' is set to false. 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        //If successful, log to the console and make a new GET request to reload the main route 
        console.log('Todo Added') 
        response.redirect('/')
    })
    .catch(error => console.error(error))  //If there's an error, log it
})

//Handle PUT (UPDATE) requests to the /markComplete route 
//Triggered when a todo list item is clicked on the front end
app.put('/markComplete', (request, response) => {
    // In the db 'todos' collection, find the document where the 'thing' value matches the item text passed in the request body and update it
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //set the value of 'completed' to 'true'
        $set: {
            completed: true
        }
    },{
        sort: {_id: -1},   // If more than one matching document is returned, sort them in descending order by _id (so that we update the one with the lower _id value)
        upsert: false  // Doesn't create a new document if the query doesn't find a matching document
    })
    .then(result => {
        //If successful, log to the console and send 'Marked Complete' response to the front end
        console.log('Marked Complete')
        //I think .json() also automatically sets the HTTP status code to 200 and the content-type to application/json, which is handy
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))
})

//Handle PUT (UPDATE) requests to the /markUnComplete route
//Do the opposite of the /markComplete route
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

//Handle DELETE (DELETE) requests to the /deleteItem route
app.delete('/deleteItem', (request, response) => {
    //Find the item in the 'todos' collection where 'thing' matches request.body and delete it
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//Set up the server to listen on our port (if it's defined in .env), or whatever the port is
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})