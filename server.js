const express = require('express') // import express module
const app = express() // stores the express module in the app constant
const MongoClient = require('mongodb').MongoClient //import mongodb module's MongoClient method, which allows to connect to the db
const PORT = 2121 // Sets the port where the server will listen
require('dotenv').config() // Allows access to the variables defined in the .env file

// MongoDB Configuration. Connects to a cluster
    let db, // db variable will store the mongodb object
        dbConnectionStr = process.env.DB_STRING, // the connection string given by mongo is stored in the .env file
        dbName = 'todo' // the name of the database to connect to. If it doesn't exist, it is created.
 
    MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connect method given by mongodb. Async.
        .then(client => {
            console.log(`Connected to ${dbName} Database`) // When connection is succesful, console logs.
            db = client.db(dbName) // the database is stored in the db global variable.
        })
// End of MongoDB Configuration
    
app.set('view engine', 'ejs') // Tells express that the html template to be used is ejs.
// Middleware
    app.use(express.static('public')) // Tells express that whenever a request is made for a static file in the public folder, just respond with it.
    app.use(express.urlencoded({ extended: true })) // Allows to parse the body of a request and makes it available as an object in req.body
    app.use(express.json()) // Allows express to read json and put the json requests in req.body
// End of Middleware


app.get('/',async (request, response)=>{ // The server listens to the root route get request. Async because grabbing data from the remote database is async.
    const todoItems = await db.collection('todos').find().toArray() // Grabs the 'todos' collection in the db and put every document in an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // Counts the documents in the db that complies with the condition given.
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // Renders the ejs with the document (object) and the count, responding with html to the client.
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // Our API is set up to hear a post at a particular form's action
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // Inserts a new document in the todos collection of the database
    .then(result => { //That's an async function because requires going to the remote database.
        console.log('Todo Added') // When the promise is fulfilled, console logs that the todo has been added to the database
        response.redirect('/') // Responds telling the client to redirect to '/', making  a new get request to get the updated information.
    })
    .catch(error => console.error(error)) // If the promise is rejected, the error is console logged.
})

app.put('/markComplete', (request, response) => { // The server listens for a put request. On client-side JS, a put fetch request is made with the /markComplete route, and the name and  completed status in the body
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Updates  an object with the thing: name of the to do
        $set: {
            completed: true // changes the completed status in the database, since now the todo has been completed.
          }
    },{ // These are the options of the updateOne method.
        sort: {_id: -1}, // This sorts the documents in the array by their _id, which is their identifier in the database.
        upsert: false // Won't create a new document if it doesn't exist.
    })
    .then(result => { // When the promise is fulfilled, the then handler is called.
        console.log('Marked Complete') // Console logs, telling that the operation was successful
        response.json('Marked Complete') // Responds to the client with a json file. The client can refresh with the client-side JS.
    })
    .catch(error => console.error(error)) // if the promise is rejected, console logs the error
})

app.put('/markUnComplete', (request, response) => { // The server listens for a put request in the /markUnComplete route. Client-side JS makes a put fetch request with /markUnComplete action and completed status and name of the todo list in the body.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //updates the document of the todo in the database, findingit through its name
        $set: { // change the completed status of the todo, since it was marked before and now it isn't
            completed: false // false means it's not completed. The database is updated.
          }
    },{ // Options of the updateOne method
        sort: {_id: -1}, // sorts the documents by their id.
        upsert: false // won't add a new document if it doesn't exist
    })
    .then(result => { // When the promise is fulfilled, the then handler is called
        console.log('unMarked Complete') // console logs that the element has been unmarked in the database. I ACTUALLY CHANGED THIS SINCE IT SAID MARKED 
        response.json('unMarked Complete') // responds to the client that the todo was succesfully unmarked  I ACTUALLY CHANGED THIS SINCE IT SAID MARKED
    })
    .catch(error => console.error(error)) // if the promise is rejected, the error is console logged

})

app.delete('/deleteItem', (request, response) => { // The server hears a delete request in the deleteItem route
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // looks for a document with a certain name to be deleted
    .then(result => { // since the database is remote, it returns a promise, and then handler will handle it if successful
        console.log('Todo Deleted') // when successful,, console logs that it was deletedd
        response.json('Todo Deleted') // responds to the client a json
    })
    .catch(error => console.error(error)) // console logs the error if the promise was rejected

})

app.listen(process.env.PORT || PORT, ()=>{ //the app will listen to the specified port of the server if exists. otherwise it will listen on the port assigned  
    console.log(`Server running on port ${PORT}`) //when the server is running, it console logs that information.
})