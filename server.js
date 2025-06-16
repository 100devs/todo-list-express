// Load modules
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

// initialize db related variables
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todos'
// MongoDB client setup 
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
app.set('view engine', 'ejs')       // set EJS as template engine 
app.use(express.static('public'))       //  server static from public folder
app.use(express.urlencoded({ extended: true }))     //  Parse incoming requests with URL-encoded payloads
app.use(express.json())     // Parse incoming requests with JSON payloads 


// CRUD - Read 
// 1. GET data from MongoDB
// 2. Render the data in HTML with a template engine (ejs)
app.get('/',async (request, response)=>{
    // find all documents under the collection and return promise with the data 
    const todoItems = await db.collection('todos').find().toArray()  // find all docs and put them in an array `data`
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})  // count documents with completed:false 
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // data array passed to template as key-value pair(named 'items') 
    // db.collection('todos').find().toArray() 
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft }) 
    //     })
    // })
    // .catch(error => console.error(error))
})
// CRUD - Create
// 1. form submission triggers POST request to server
// 2. refresh/get('/') with updated data from MongoDB
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})  // find 'todos' collection and insert the object to database. toDoItem is the body of input from the forms.
    .then(result => {
        console.log('Todo Added')   // console log so we know this happened
        response.redirect('/')      // response to refresh the page -> trigger get('/') req
    })
    .catch(error => console.error(error))   // catch and log error 
})
// CRUD - Update
// 1. Update `completed` to true.
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true         // notice set `true`
          }
    },{
        sort: {_id: -1},     // descending order
        upsert: false        // upsert: insert a document if no documents can be found
    })
    .then(result => {
        console.log('Marked Complete')      // console log so we know this happened
        response.json('Marked Complete')    // response to json
    })
    .catch(error => console.error(error))  // catch and log error  

})
// CRUD - Update
// 1. Update `completed` to false
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false    // notice set `false`
          }
    },{
        sort: {_id: -1},    // descending order
        upsert: false       // upsert: insert a document if no documents can be found
    })
    .then(result => {
        console.log('Marked Complete')      // console log so we know this happened
        response.json('Marked Complete')    // response to json
    })
    .catch(error => console.error(error))   // catch and log error 

})

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')     // console log so we know this happened
        response.json('Todo Deleted')   // response to json
    })
    .catch(error => console.error(error))   // catch and log error 

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)   // so we know which server is running
})