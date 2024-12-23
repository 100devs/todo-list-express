// import express into file
const express = require('express')
// create app using express function
const app = express()
// store mongodb client in variable
const MongoClient = require('mongodb').MongoClient
// define a PORT for server listen on
const PORT = 2121
// use dotenv module so we can use variables from our .env file
require('dotenv').config()

// create db variable, db connection string variable, and name of database
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// connect to databse
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // once db is connected/fulfills promise, log connected to database
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        // assign client.db('todo') to db
        db = client.db(dbName)
    })

// tell express we're using EJS
app.set('view engine', 'ejs')
// middlware so express can automatically render anything in public folder
app.use(express.static('public'))
// middleware so we can get data out of the req.body
app.use(express.urlencoded({ extended: true }))
// middleware to send json back and forth
app.use(express.json())

// when client makes get request at '/' route
app.get('/',async (request, response)=>{
    // find collection called 'todos' in the database, turn into array, assign to variable
    const todoItems = await db.collection('todos').find().toArray()
    // variable that stores the number of todos that are incomplete
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // render the EJS file using the variables just created
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

// define behavior when POST request made at '/addTodo' route
app.post('/addTodo', (request, response) => {
    // insert new document into todos collection with a thing and completed property
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        // reload page once this is successful
        response.redirect('/')
    })
    // catch error and console.error() it
    .catch(error => console.error(error))
})

// define what happens when one makes a PUT request to the '/markComplete' route
app.put('/markComplete', (request, response) => {
    // go into collection, update the document that has the same thing as was taken from the request body
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // set the completed property to true
        $set: {
            completed: true
          }
    },{
        // sort the collection in descending order
        sort: {_id: -1},
        // don't upsert (default value)
        upsert: false
    })
    .then(result => {
        // log in console that its complete
        console.log('Marked Complete')
        // respond to client with json that it was complete
        response.json('Marked Complete')
    })
    // catch error
    .catch(error => console.error(error))

})

// define what happens when one makes a PUT/update request to this route
app.put('/markUnComplete', (request, response) => {
    // find the to do that was in the request body, set completed to false
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        // sort in descending order
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// define behavior when one makes a DELETE request to this route
app.delete('/deleteItem', (request, response) => {
    // delete document that matches thing property from request body
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        // log and respond to client with to do deleted
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// have server listen for the app on the port either from the .env file or as defined at the top of this file
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})