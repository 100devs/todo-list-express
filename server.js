// load and access express module
const express = require('express')
const app = express()
// load and access mongodb 
const MongoClient = require('mongodb').MongoClient
// assign port to 2121
const PORT = 2121
// access dotenv to load env variables from .env 
require('dotenv').config()

// returns and store DB into variable
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// connect to mongodb thru connect method
// connect method is async
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
    // when connect return a value do this 
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
// using ejs as view engine
app.set('view engine', 'ejs')
// making public folder accessible
app.use(express.static('public'))
// parse request 
app.use(express.urlencoded({ extended: true }))
// parse request as json
app.use(express.json())

// route to fetch resource on db
app.get('/',async (request, response)=>{
//     query db
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
//     render returned value on page
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

// route to add item to db 
app.post('/addTodo', (request, response) => {
//     call method to add item
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
//         notify and redirect when successful since adding is async
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// route to update db
app.put('/markComplete', (request, response) => {
//    query db
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
//         item to update on db
        $set: {
            completed: true 
          }
    },{
//         sort ids in ascending order
        sort: {_id: -1},
//        dont insert document when empty
        upsert: false
    })
    .then(result => {
//         run this block when update succeeds
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// another route to update db 
app.put('/markUnComplete', (request, response) => {
//     pass request object to update db
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
//         item to update on db
        $set: {
            completed: false
          }
    },{
//         sort ids in ascending order 
        sort: {_id: -1},
//         dont insert document, when none is found
        upsert: false
    })
    .then(result => {
//         run block when update succeeds
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// route to delete item on db
app.delete('/deleteItem', (request, response) => {
//     query db to delete
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
//         run block when deletion succeeds 
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// listen and notify for connection on the specified PORT 
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
