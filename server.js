const express = require('express') // import express
const app = express() // create express app
const MongoClient = require('mongodb').MongoClient // import mongo client
const PORT = 2121 // set port
require('dotenv').config() // import dotenv


let db, // create db variable
    dbConnectionStr = process.env.DB_STRING, // get db connection string from .env file
    dbName = 'todo' // set db name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connect to db
    .then(client => { // if connection is successful
        console.log(`Connected to ${dbName} Database`) // log success
        db = client.db(dbName) // set db variable
    })
    
app.set('view engine', 'ejs') // set view engine to ejs
app.use(express.static('public')) // set public folder as static folder
app.use(express.urlencoded({ extended: true })) // set urlencoded to true
app.use(express.json()) // set json to true


app.get('/',async (request, response)=>{ // get request to root
    const todoItems = await db.collection('todos').find().toArray() // get all todos from db
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})  // get all incomplete todos from db
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // render index.ejs and pass todoItems and itemsLeft to it
    // db.collection('todos').find().toArray() // get all todos from db
    // .then(data => { // if successful
    //     db.collection('todos').countDocuments({completed: false}) // get all incomplete todos from db
    //     .then(itemsLeft => {     // if successful
    //         response.render('index.ejs', { items: data, left: itemsLeft }) // render index.ejs and pass data and itemsLeft to it
    //     }) 
    // })
    // .catch(error => console.error(error)) // if error log error
})

app.post('/addTodo', (request, response) => { // post request to addTodo
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // insert todo into db
    .then(result => { // if successful
        console.log('Todo Added') // log success
        response.redirect('/') // redirect to root
    })
    .catch(error => console.error(error)) // if error log error
})

app.put('/markComplete', (request, response) => { // put request to markComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // update todo in db
        $set: { // set completed to true
            completed: true // set completed to true
          } // set completed to true
    },{ // update todo in db
        sort: {_id: -1}, // sort by id
        upsert: false // upsert false
    }) // update todo in db
    .then(result => { // if successful
        console.log('Marked Complete') // log success
        response.json('Marked Complete') // send response
    }) // if successful
    .catch(error => console.error(error))   // if error log error

}) // put request to markComplete

app.put('/markUnComplete', (request, response) => { // put request to markUnComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // update todo in db
        $set: { // set completed to false
            completed: false // set completed to false
          } // set completed to false
    },{ // update todo in db
        sort: {_id: -1}, // sort by id
        upsert: false // upsert false
    }) // update todo in db
    .then(result => { // if successful
        console.log('Marked Complete') // log success
        response.json('Marked Complete') // send response
    }) // if successful
    .catch(error => console.error(error))  // if error log error
 
}) // put request to markUnComplete

app.delete('/deleteItem', (request, response) => { // delete request to deleteItem
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // delete todo from db
    .then(result => { // if successful
        console.log('Todo Deleted') // log success
        response.json('Todo Deleted') // send response
    }) // close then
    .catch(error => console.error(error)) // if error log error

} ) // delete request to deleteItem

app.listen(process.env.PORT || PORT, ()=>{ // listen on port
    console.log(`Server running on port ${PORT}`) // log success
}) // listen on port