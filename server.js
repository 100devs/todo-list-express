// import express modules
const express = require('express')
// initializes express
const app = express()
// import MongoClient from mongodb module
const MongoClient = require('mongodb').MongoClient
//set the listener port 
const PORT = 2121
// import config function from dotenv package 
require('dotenv').config()

// declare database var, the connection string, and the database name 
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
//set up mongodb connection (useUnifiedTopology is deprecated)
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // wait for the promise to resolve
    .then(client => {
        // console.log if promise resolves and connection works
        console.log(`Connected to ${dbName} Database`)
        // set up database name
        db = client.db(dbName)
    })
// tell server which template to respond with   
app.set('view engine', 'ejs')
// tell express to send all the public files on request
app.use(express.static('public'))
// tell express to handle the urlencoded data
app.use(express.urlencoded({ extended: true }))
// tell express to handle json requests
app.use(express.json())

// handle a get request on the root route
app.get('/',async (request, response)=>{
    // grab the todos collection and put it into an array 
    const todoItems = await db.collection('todos').find().toArray()
    // count the documents in the todos collection with the property value completed: false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // render the ejs file with the data in todoItems and itemsLeft
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
// handle a post request on the addTodo route
app.post('/addTodo', (request, response) => {
    // insert the posted information into the todos collection on the database
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // wait for the promise to resolve
    .then(result => {
        //console.log if it resolves and redirect to the root route
        console.log('Todo Added')
        response.redirect('/')
    })
    //catch errors
    .catch(error => console.error(error))
})
// handle a put request on the markComplete route
app.put('/markComplete', (request, response) => {
    // update the targeted item into the todos collection on the database
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // update the targeted item's completed property to true
        $set: {
            completed: true
          }
    },{
        // sort the items by descending order
        sort: {_id: -1},
        // dont create a new document if it doesnt exist 
        upsert: false
    })
    // wait for the promise to resolve
    .then(result => {
        //console.log and respond with json if resolves
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //catch any errors
    .catch(error => console.error(error))

})
// handle the put request on the markUnComplete route
app.put('/markUnComplete', (request, response) => {
    // update the targeted item into the todos collection on the database
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
         // update the targeted item's completed property to false
        $set: {
            completed: false
          }
    },{
        // sort the items by descending order
        sort: {_id: -1},
        // dont create a new document if it doesnt exist 
        upsert: false
    })
    // wait for the promise to resolve
    .then(result => {
        //console.log and respond with json if resolves
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //catch any errors
    .catch(error => console.error(error))

})
// handle a delete request on the deleteItem route
app.delete('/deleteItem', (request, response) => {
    // delete the targeted item from the todos collection in the database
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // wait for the promise to resolve
    .then(result => {
         //console.log and respond with json if resolves
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    //catch any errors
    .catch(error => console.error(error))

})
// set up the server to listen to a particular port
app.listen(process.env.PORT || PORT, ()=>{
    //console.log if the server is on
    console.log(`Server running on port ${PORT}`)
})
