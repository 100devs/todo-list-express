// import express
const express = require('express')
// create express instance
const app = express()
// import mongodb and use Mongoclient class
const MongoClient = require('mongodb').MongoClient
// set port
const PORT = 2121
//  load environment variables from a .env file 
require('dotenv').config()


let db,
    dbConnectionStr = process.env.DB_STRING, // assign DB_STRING form .env file
    dbName = 'todo' // assign datebase name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connecting to database
    .then(client => {
        console.log(`Connected to ${dbName} Database`) 
        db = client.db(dbName) // assign database to db
    })
    
app.set('view engine', 'ejs') //setting ejs as template engine
app.use(express.static('public')) //allow express to use static file from public folder
app.use(express.urlencoded({ extended: true })) // middleware parsing req body encoded in url-encoded format
app.use(express.json()) // middleware parsing req body encoded in json format

// define get request on root end
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray() // an array of items
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // number of incompleted todos
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //passing data in ejs file and split out html then response with it
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//define post(create) request on addTodo endpoint
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // adding data in database
    .then(result => {
        console.log('Todo Added')
        response.redirect('/') // redirect to root route
    })
    .catch(error => console.error(error)) // catching errors
})

//defining update(put) request
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //updating data
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1}, // sorting decrease order
        upsert: false // disallow to create new data
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete') //responsing with json format
    })
    .catch(error => console.error(error)) //catching error

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

// deleting item from database
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // delete selected data item
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error)) // catching error

})
// listen for connections for specific host and port
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`) 
})
