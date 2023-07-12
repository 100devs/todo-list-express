//imports the express module
const express = require('express')
//creates the express application object by calling express() function and naming it 'app'
const app = express()
//imports MongoDB
const MongoClient = require('mongodb').MongoClient
//declares PORT variable and assigns value 2121
const PORT = 2121
//imports dotenv to store environment variables
require('dotenv').config()


let db, //declares empty db variable
    dbConnectionStr = process.env.DB_STRING, //declares db connection string variable that stores the value from dotenv or the hosting environment
    dbName = 'todo' //declaring dbName variable to store the database name

//function connects to the MongoDB and creates a console log to confirm connection to the db was successful.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
//setting up EJS    
app.set('view engine', 'ejs')
//configuring the public folder
app.use(express.static('public'))
//calling express to use body parser
app.use(express.urlencoded({ extended: true }))
//calling express to accept JSON data
app.use(express.json())

//method that listens and responds to a GET (READ) request on the root branch ('/')
app.get('/',async (request, response)=>{
    //pulls all documents from the 'todos' collection and puts them in to an array variable todoItems
    const todoItems = await db.collection('todos').find().toArray()
    //counts all the documents in the 'todos' collection with completed value 'false', and assigns the value to the variable itemsLeft
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //responds to the client with a rendered index.ejs file passing todoItems as 'items' and itemsLeft as 'left'
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

//method that listens for and responds to a POST (CREATE) request 'addTodo' from the client
app.post('/addTodo', (request, response) => {
    //creates a new document in the 'todos' collection using 'todoItem' value from the request body to populate 'thing'
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //responds to the client with a console log confirming document was added to the db and redirects the client to the root triggering a GET request
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    //catches any errors and logs them to the console
    .catch(error => console.error(error))
})

//method that listens for and responds to PUT (UPDATE) request '/markComplete' from the client 
app.put('/markComplete', (request, response) => {
    //searches for a document in the 'todos' collection to update where the key 'thing' equals the value taken from the request body 'itemFromJS'
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //sets completed to 'true' in the document
        $set: {
            completed: true
          }
    },{
        //sorts documents by id in descending order
        sort: {_id: -1},
        //new document not to be created if the document doesn't already exist
        upsert: false
    })
    //respond to the client with a console log confirming the update is complete and respond with JSON 'Marked Complete'
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //catches any errors and logs to the console
    .catch(error => console.error(error))

})

//method that listens for and responds to PUT (UPDATE) request '/markUncomplete' from the client
app.put('/markUnComplete', (request, response) => {
    //searches for a document in the 'todos' collection to update where the key 'thing' equals the value taken from the request body 'itemFromJS'
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //sets complete to 'false' in the document
        $set: {
            completed: false
          }
    },{
        //sorts documents by ID in descending order
        sort: {_id: -1},
        //new document not to be created of the document doesn't already exist
        upsert: false
    })
    //respond to the client with a console log confirming the update is complete and respond with JSON 'Marked Complete'
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //catches any errors and logs to the console
    .catch(error => console.error(error))

})

//method that listens for and responds to DLETE request '/deleteItem' from the client
app.delete('/deleteItem', (request, response) => {
    //searches for a document in the 'todos' collection where the key 'thing' equals the value taken from the request body 'itemFromJS'. 
    //If document found it's deleted
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        //respond to the client with a console log confirming the delete is complete and respond with JSON 'Todo Deleted'
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    //catches any errors and logs to the console
    .catch(error => console.error(error))

})

//configures the server to listen to requests on the port defined by the environment or the hard coded port
app.listen(process.env.PORT || PORT, ()=>{
    //console logs confirmation of the port the server is running on
    console.log(`Server running on port ${PORT}`)
})