const express = require('express') // import express
const app = express() // create an instance of express, store in app
const MongoClient = require('mongodb').MongoClient // import mongodb, store in MongoClient
const PORT = 2121 // port to listen on
require('dotenv').config() // import dotenv


let db, // store the database in db
    dbConnectionStr = process.env.DB_STRING, // get the db connection string from the .env file
    dbName = 'todo' // name of the database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connect to the database
    .then(client => { // if successful, store the client in db
        console.log(`Connected to ${dbName} Database`) // log that we are connected to the database
        db = client.db(dbName) // store the client in db
    })
    
app.set('view engine', 'ejs') // set the view engine to ejs
app.use(express.static('public')) // use the public folder for static files
app.use(express.urlencoded({ extended: true })) // use express to parse form data
app.use(express.json()) // use express to parse json data


app.get('/',async (request, response)=>{ // get the home page
    const todoItems = await db.collection('todos').find().toArray() // get all the todo items from the database
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // get the number of todo items left
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //  render the index page with the todo items and the number of items left
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) // end get /

app.post('/addTodo', (request, response) => { // post request to add a todo item
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // insert the todo item into the database
    .then(result => { // start of promise chain
        console.log('Todo Added') // log that the todo item was added
        response.redirect('/') // redirect to the home page
    }) // end of promise chain
    .catch(error => console.error(error)) // catch any errors
}) // end of post request to add a todo item

app.put('/markComplete', (request, response) => { // put request to mark a todo item as complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // update the todo item in the database
        $set: { // set the completed field to true
            completed: true // set the completed field to true
          } // end of set
    },{ // end of updateOne
        sort: {_id: -1}, // sort the results by the _id field in descending order
        upsert: false // do not create a new document if one does not exist
    })
    .then(result => { // start of promise chain
        console.log('Marked Complete') // log that the todo item was marked complete
        response.json('Marked Complete') // send a response to the client
    }) // end of promise chain
    .catch(error => console.error(error)) // catch any errors
}) // end of put request to mark a todo item as complete

app.put('/markUnComplete', (request, response) => { // put request to mark a todo item as uncomplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // update the todo item in the database
        $set: { // set the completed field to false
            completed: false // set the completed field to false
          } // end of set
    },{ // end of updateOne
        sort: {_id: -1}, // sort the results by the _id field in descending order
        upsert: false // do not create a new document if one does not exist
    }) // end of updateOne
    .then(result => { // start of promise chain
        console.log('Marked Complete') //   log that the todo item was marked complete
        response.json('Marked Complete') // send a response to the client
    }) // end of promise chain
    .catch(error => console.error(error)) // catch any errors

}) // end of put request to mark a todo item as uncomplete

app.delete('/deleteItem', (request, response) => { // delete request to delete a todo item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // delete the todo item from the database
    .then(result => { // start of promise chain
        console.log('Todo Deleted') // log that the todo item was deleted
        response.json('Todo Deleted') // send a response to the client
    })  // end of promise chain
    .catch(error => console.error(error)) // catch any errors
}) // end of delete request to delete a todo item

app.listen(process.env.PORT || PORT, ()=>{ // listen on the port
    console.log(`Server running on port ${PORT}`) // log that the server is running on the port
}) // end of listen on the port