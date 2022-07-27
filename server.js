// enables use of express.js
const express = require('express') 

// creates instance of express (shortcut)
const app = express() 

//enables use of MongoDB client
const MongoClient = require('mongodb').MongoClient

//tells express which port to listen for by default
const PORT = 2121

//first importing env and then loading it using .config()
require('dotenv').config()

//giving db a name so we don't have to retype it; 'quality of life' variables
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//initialize MongoDB connection -- returns a promise if you don't have a string (.then is indicator)
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })

//handling a successfully resolved promise and printing to the console
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
//assigning the connected client instance attached to the 'todo' collection to the 'db' variable
        db = client.db(dbName)
    })
//missed a catch
    .catch(env => console.log(err))

// telling express that we're using ejs whenever we're using a render method
app.set('view engine', 'ejs');

// telling the app to serve everything in the public folder as is
app.use(express.static('public')); 

// middleware that puts itself in between requests and responses; allows data to be passed to server through a request
// (https://localhost/route?variable=value&othervariable=othervalue)
app.use(express.urlencoded({ extended: true }));

// teaching the app how to "read" JSON through express
app.use(express.json());

// start defining end points of server
// defines a 'get' method to root directory of server 
app.get('/', async (request, response)=>{
// telling server to find all documents inside of db collection (we're waiting) and define an array ("give me everything")
    const todoItems = await db.collection('todos').find().toArray()
// telling collection to go through all the documents and return the number of matches for the specific condition (false completion, not done yet)
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
// Once everything has been completed, we're creating a new variable called todoItems and itemsLeft and feeding it into index.ejs, rendered for the client and sees HTML, EJS is just a template of HTML
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
// making a post request that will fire when the user adds a to-do item
app.post('/addTodo', (request, response) => {  
// server takes request and bundles it into an object; will set every new item created by the user as false so it will trigger the promise from before 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) 
// handles returned promise by displaying a message to Heroku instance (server) and refreshing the page
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
// logs an error to the console if there is one
    .catch(error => console.error(error))
})

// defining an endpoint to handle a put request (what happens when the user marks a to-do item as complete) 
app.put('/markComplete', (request, response) => {
// updates a record using the value received from 'itemFromJS" in the body of the subject
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
// resorts the items and puts anything new to the end of the list; if no matches don't create a new record 
        sort: {_id: -1},
        upsert: false
    })
// if successful, log and send the response. if not, log the error
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// opposite of markComplete section -- same setup but for marking an item not complete
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
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// handles a delete request at the defined endpoint
app.delete('/deleteItem', (request, response) => {
// mongoDB function to delete a single todo line
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
// if successful, log and send response
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
// if not, log the error 
    .catch(error => console.error(error))

})

// starts the server and waits for requests
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})