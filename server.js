const express = require('express') // import express module
const app = express() // use express for our backend
const MongoClient = require('mongodb').MongoClient // use the mongodb module as our db
const PORT = 2121 // set the port
require('dotenv').config() // tell the app we can use a .env file


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo' // declare db, connection string and name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connect to mongodb
    .then(client => { // if the promise is fulfilled
        console.log(`Connected to ${dbName} Database`) // after the db connects, log that we connected
        db = client.db(dbName) // now that we connected to the db, we can set it to the db variable
    })
    
app.set('view engine', 'ejs') // tell express we're using ejs as a templating language
app.use(express.static('public')) // tell express we're storing all static files in a public directory so we dont have to define routes for each file
app.use(express.urlencoded({ extended: true })) // middleware to recognize the incoming request object as strings or arrays
app.use(express.json()) // middleware to recognize the request as JSON


app.get('/',async (request, response)=>{ // READ operation for root
    const todoItems = await db.collection('todos').find().toArray() // get all documents in todos collection and store them in an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // get the count of all unfinished todos in the collection
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // render the ejs and serve the client HTML
    db.collection('todos').find().toArray() // get every document from todos collection
    .then(data => { // if the promise is fulfilled
        db.collection('todos').countDocuments({completed: false}) // get all of the uncompleted documents
        .then(itemsLeft => { // if the promise is fulfilled
            response.render('index.ejs', { items: data, left: itemsLeft }) // render the ejs and serve the client with HTML
        })
    })
    .catch(error => console.error(error)) // log an error if the promise is rejected
})

app.post('/addTodo', (request, response) => { // CREATE operation when the addTodo API is called
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // insert the form contents from request.body as a document in the todos collection, hard code completed to false by default
    .then(result => { // if the promise is fulfilled
        console.log('Todo Added') // let the user know the item was added
        response.redirect('/') // refresh the page
    })
    .catch(error => console.error(error)) // if the promise is rejected log the error
})

app.put('/markComplete', (request, response) => { // UPDATE operation for the markComplete API
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // with the item that the user clicked on, go to the db and specify you want to update that single document
        $set: { // set operation
            completed: true // change completed to true
          }
    },{
        sort: {_id: -1}, // sort in descending order
        upsert: false // dont insert this document if none exist
    })
    .then(result => { // if the promise is fulfilled
        console.log('Marked Complete') // log that the change was successful
        response.json('Marked Complete') // respond with json that the change was successful
    })
    .catch(error => console.error(error)) // if the promise was rejected, log the error

})

app.put('/markUnComplete', (request, response) => { // UPDATE operation for the markUncomplete API
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // with the item that the user clicked on, go to the db and specify you want to update that single document
        $set: { // set operation
            completed: false // change completed to false
          }
    },{
        sort: {_id: -1}, // sort in descending order
        upsert: false // dont insert this document if none exist
    })
    .then(result => { // if the promise is fulfilled
        console.log('Marked Complete') // log that it was changed
        response.json('Marked Complete') // respond in json that it was changed
    })
    .catch(error => console.error(error)) // if the promise is rejected then log the error

})

app.delete('/deleteItem', (request, response) => { // DELETE operation for the deleteItem API
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // with the item the user wants to delete, go to the db and delete that item
    .then(result => { // if the promise was fulfilled
        console.log('Todo Deleted') // log that it was deleted
        response.json('Todo Deleted') // respond in json that it was deleted
    })
    .catch(error => console.error(error)) // if the promise was rejected, log the error

})

app.listen(process.env.PORT || PORT, ()=>{ // run the app on the PORT that was hard coded (for localhost) or the PORT from the .env supplied (for hosting platforms)
    console.log(`Server running on port ${PORT}`) // log that the server is up and running on the port
})