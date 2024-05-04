const express = require('express') //bring in express
const app = express() //shortcut for calling express
const MongoClient = require('mongodb').MongoClient //bring in mongo
const PORT = 2121 //define listening port number
require('dotenv').config() //uses .env file to hide db string


let db, //define db
    dbConnectionStr = process.env.DB_STRING, //define connection string, linking from env file
    dbName = 'todo' //define name of database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connect to mongo
    .then(client => { //setup response from mongo
        console.log(`Connected to ${dbName} Database`) //console log successful login
        db = client.db(dbName) //define db as the db name on mongo
    })
    
app.set('view engine', 'ejs') //
app.use(express.static('public')) //
app.use(express.urlencoded({ extended: true })) //
app.use(express.json()) //


app.get('/',async (request, response)=>{ //define how express will respond to read requests for root directory
    const todoItems = await db.collection('todos').find().toArray() //go to mongo, find all todo items, add to an array (async)
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //go to mongo, count all documents that have completed: false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //respond by rendering EJS template, sending items and left
    
    //below: how to do the above not using await 
            // db.collection('todos').find().toArray()
            // .then(data => {
            //     db.collection('todos').countDocuments({completed: false})
            //     .then(itemsLeft => {
            //         response.render('index.ejs', { items: data, left: itemsLeft })
            //     })
            // })
            // .catch(error => console.error(error))
}) //close read request

app.post('/addTodo', (request, response) => { //define how express will respond to post request /addTodo
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //go to mongo, insert one item from post request body
    .then(result => { //define what happens after insertone is completed
        console.log('Todo Added') //console log successful insert
        response.redirect('/') //respond by refreshing page which fires another get request
    }) //close successful add
    .catch(error => console.error(error)) //catch any errors when attempting to insertone
}) //close post request

app.put('/markComplete', (request, response) => { //define how express will respond to put request /markComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //connect to mongo, update document based on request body
        $set: { //open command for mongo - set
            completed: true //set completed to true
          } // close command for mongo - set
    },{ // next argument
        sort: {_id: -1}, //sort ID's
        upsert: false //do not insert document if not found
    }) // close update
    .then(result => { //define how express will handle successful completion
        console.log('Marked Complete') //log success
        response.json('Marked Complete') //respond with JSON
    }) //close successful completion
    .catch(error => console.error(error)) //catch error and console log error, if occurs when updating with mongo

})//close put request

app.put('/markUnComplete', (request, response) => { //define how express will handle put request /markUnComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //connect to mongo, update one document based on body of put request
        $set: { //open command for mongo - set
            completed: false //set completed to false
          } //close command for mongo - set
    },{ //next argument
        sort: {_id: -1}, //sort ID's
        upsert: false //do not insert document if not found
    })
    .then(result => { //define how express will respond after successful completion of mongo update
        console.log('Marked Complete') //log success
        response.json('Marked Complete') //respond with JSON
    }) //close successful completion operation
    .catch(error => console.error(error)) //if an error occurs with mongo, catch and log the error

}) //close put request

app.delete('/deleteItem', (request, response) => { //define how express will handle delete request /deleteItem
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //connect to mongo, delete on document based on delete request body
    .then(result => { //define what happens after successful delete
        console.log('Todo Deleted') //log success
        response.json('Todo Deleted') //respond with JSON
    }) // close successful delete operation
    .catch(error => console.error(error)) //if an error occurs with delete, catch and log the error
 
}) //close delete request

app.listen(process.env.PORT || PORT, ()=>{ //define what port express will listen. uses env file port, or previously defined port
    console.log(`Server running on port ${PORT}`) //log what port the server is running on
}) //close out listen 