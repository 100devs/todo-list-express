/* import all required dependencies */
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

/* get connection string from .env file */
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

    /* connect to database */
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

/* set view engine */
app.set('view engine', 'ejs')
/* set static folder for static assets */
app.use(express.static('public'))
/* parse URL-encoded and JSON request bodies */
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

/* define route handler for '/' route  */
app.get('/',async (request, response)=>{
    /* retrieve todo items from collection and conver them to an array */
    const todoItems = await db.collection('todos').find().toArray()
    /* count all incomplete items */
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    /* render ejs template for views */
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

/* define route handler for /addTodo route, handling POST requests */
app.post('/addTodo', (request, response) => {
    /* add new todo to collection */
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

/* define route handler for handling PUT requests */
app.put('/markComplete', (request, response) => {
    /* update completed status of selected todo */
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
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

/* define route handler for marking a todo as incomplete */
app.put('/markUnComplete', (request, response) => {
    /* mark selected item as incomplete */
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

/* define route handler for deleting todos */
app.delete('/deleteItem', (request, response) => {
    /* delete selected todo from  database */
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

/* start server on dynamic port */
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})