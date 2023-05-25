const express = require('express') // set up use of Express in this file
const app = express() // create constant and assign Express instance to it
const MongoClient = require('mongodb').MongoClient // set up use of MongoDB in this file
const PORT = 2121 // set constant with location for where server will be listening 
require('dotenv').config() // set up use of .env file for environment variables


let db, // declare variable without a value
    dbConnectionStr = process.env.DB_STRING, // create variable that pulls in the DB_STRING (database connection string) environment variable from .env file
    dbName = 'todo' // create variable for database name of 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connect to MongoDB with database connection string and opt in to using MongoDB driver's connection management engine
    .then(client => { // once succesfully connected, then:
        console.log(`Connected to ${dbName} Database`) // print to console message with database name ('todo')
        db = client.db(dbName) // assign db client factory method to existing db variable
    }) // close .then block
    
app.set('view engine', 'ejs') // set templating language to EJS
app.use(express.static('public')) // tell Express that public folder holds all static files (css, client-side js)
app.use(express.urlencoded({ extended: true })) // tell Express to decode and encode URLs to pull data from requests
app.use(express.json()) // tell Express to parse JSON content from requests


app.get('/',async (request, response)=>{ // start GET (read) method when root page is loaded
    const todoItems = await db.collection('todos').find().toArray() // create constant that waits for the todos collection in the database, finds all items in the collection, and places them in an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // create constant that waits for the todos collection in the database and counts how many documents have the value of false for the completed property
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // render EJS template with array of items found in collection and count of uncompleted items
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) // close GET method

app.post('/addTodo', (request, response) => { // start POST (create) method when /addTodo route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // in the todos collection in the database, insert one document with the request body's todoItem property value passed in for the document's thing property and the value of false for the document's completed property
    .then(result => { // once successfully inserted, then:
        console.log('Todo Added') // print to console
        response.redirect('/') // respond by reloading the root page
    }) // close .then block
    .catch(error => console.error(error)) // if there is an error, print the error message to console
}) // close POST method

app.put('/markComplete', (request, response) => { // start PUT (update) method when /markComplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // in the todos collection in the database, update a document with the thing property value that matches the request body's itemFromJS property value 
        $set: { // prepare to change something about the document
            completed: true // change the completed property value to true
          } 
    },{ // prepare to do more things to the document
        sort: {_id: -1}, // move document to last in collection 
        upsert: false // do not insert a new document if an existing document cannot be found
    })
    .then(result => { // once successfully updated, then:
        console.log('Marked Complete') // print message to console
        response.json('Marked Complete') // respond with message
    }) // close .then block
    .catch(error => console.error(error)) // if there is an error, print the error message to console

}) // close PUT method

app.put('/markUnComplete', (request, response) => { // start PUT (update) method when /markUnComplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // in the todos collection in the database, update a document with the thing property value that matches the request body's itemFromJS property value 
        $set: { // prepare to change something about the document
            completed: false // change the completed property value to false
          }
    },{ // prepare to do more things to the document
        sort: {_id: -1}, // move document to last in collection 
        upsert: false // do not insert a new document if an existing document cannot be found
    })
    .then(result => { // once successfully updated, then:
        console.log('Marked Complete') // print message to console
        response.json('Marked Complete') // respond with message
    }) // close .then block
    .catch(error => console.error(error)) // if there is an error, print the error message to console

}) // close PUT method

app.delete('/deleteItem', (request, response) => { // start DELETE method when /deleteItem route is passed in 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // in the todos collection in the database, delete a document with the thing property value that matches the request body's itemFromJS property value 
    .then(result => { // once successfully deleted, then:
        console.log('Todo Deleted') // print message to console
        response.json('Todo Deleted') // respond with message
    }) // close .then block
    .catch(error => console.error(error)) // if there is an error, print the error message to console

}) // close DELETE method

app.listen(process.env.PORT || PORT, ()=>{ // listen at either the host environment's port or the port set above in line 4
    console.log(`Server running on port ${PORT}`) // console message with port
}) // close listen method