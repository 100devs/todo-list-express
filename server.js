//initialize express package
const express = require('express')
//set var app to alias express()
const app = express()
//set var and initialize mongodb module
const MongoClient = require('mongodb').MongoClient
//set server's listening port
const PORT = 2121
//allow access to .env file
require('dotenv').config()

//initialize db var, set db string, and name db used in mongo
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//establish mongodb connection
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

//middleware

//set rendering engine to ejs    
app.set('view engine', 'ejs')
//set directory for static files to the public folder
app.use(express.static('public'))
//add ability to parse strings, arrays, and nested objects
app.use(express.urlencoded({ extended: true }))
//enable parsing of json
app.use(express.json())

//set root route
app.get('/',async (request, response)=>{
    //set var and awaits all items from todos collection
    const todoItems = await db.collection('todos').find().toArray()
    //set var and awaits uncompleted count
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //render ejs and pass through db (commented below as callback)
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

//routes addTodo to post method
app.post('/addTodo', (request, response) => {
    //insert a new item into todos collection
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //if successfull ...
    .then(result => {
        //console log 'added'
        console.log('Todo Added')
        //reload page
        response.redirect('/')
    })
    //catch errors
    .catch(error => console.error(error))
})

//when marked completed, activate this put method
app.put('/markComplete', (request, response) => {
    //search db for matching item from main.js eventlistner
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            //set completed
            completed: true
          }
    },{
        //move to bottom of list
        sort: {_id: -1},
        //prevent insertion if item already exists
        upsert: false
    })
    //if successful, activate this then method
    .then(result => {
        //log complete
        console.log('Marked Complete')
        //send response
        response.json('Marked Complete')
    })
    //catch errors
    .catch(error => console.error(error))

})

//when marked uncomplete, activate this put method
app.put('/markUnComplete', (request, response) => {
        //search db for matching item from main.js eventlistener
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            //set uncompleted
            completed: false
          }
    },{
        //move to bottom of list
        sort: {_id: -1},
        //prevent insertion of item if already exists
        upsert: false
    })
    .then(result => {
        //log complete
        console.log('Marked Complete')
        //send response back to sender
        response.json('Marked Complete')
    })
    //catch errors
    .catch(error => console.error(error))

})

//when deleting an item, activate this delete method
app.delete('/deleteItem', (request, response) => {
    //use deleteOne method to find item in db matching main.js eventlistener
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //if successful, start then method
    .then(result => {
        //console log delete
        console.log('Todo Deleted')
        //send response to sender
        response.json('Todo Deleted')
    })
    //catch errors
    .catch(error => console.error(error))

})

//specify listening port or default to hosting server
app.listen(process.env.PORT || PORT, ()=>{
    //console log port
    console.log(`Server running on port ${PORT}`)
})