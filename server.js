// import node modules
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

// define database connection variables.
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
// setting the connection to the mangoClient database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')// this line tells Express we are using EJS as the template engine.
app.use(express.static('public')) // this line let express listen to request for the files in the public folder and serves them back when needed without declaring a get response in server.js
app.use(express.urlencoded({ extended: true }))// express doesn't handle reading the data from the form element on it's own, the package body-parser helps to do that.
app.use(express.json())//this line make it possible for the server to receive data in json format.


app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
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

// this is the post request with the route /addTodo from the form action in the .ejs file
app.post('/addTodo', (request, response) => {
    // insert the new todo into the mongo database
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/') // this line refresh the browser
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // change the complete property
        $set: {
            completed: true
          }
    },{ // the sort order of a query result in mongoDB in the document is in a descending order.
        sort: {_id: -1},
        // if no itemFromJS exist mongoDb doesn't create one
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

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

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})
// listen to either the PORT defined in this file or the PORT given by Heroku in case of the app being hosted online.
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})