const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
// for Mongo DB client credentials
require('dotenv').config()

// initialize Mongo db
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
// set renderer to use express js
app.set('view engine', 'ejs')
// tell express to use the public folder for CSS and JS files
app.use(express.static('public'))
// use URL for requests
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// homepage of app
app.get('/',async (request, response)=>{
    // get an array of all the todo items from the todos collection 
    const todoItems = await db.collection('todos').find().toArray()
    // get a count of all the todos that are not yet completed
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // render todoItems and itemsLeft to the ejs template
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

// create request to add todo
app.post('/addTodo', (request, response) => {
    // insert a new item to the todo collection, set completed flag to false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        // auto refresh to root
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// update items when completed
app.put('/markComplete', (request, response) => {
    // update the current item from the todos collection and set completed flag to true
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        // respond with complete
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// update items when uncomplete
app.put('/markUnComplete', (request, response) => {
    // update the current item from the todos collection and set completed flag to false
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

// delete item 
app.delete('/deleteItem', (request, response) => {
    // delete current item from todos collection 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        // respond with todo deleted
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// listen to the env port OR the static port of 2121
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})