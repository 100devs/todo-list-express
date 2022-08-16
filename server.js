const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        //let you test if you are connected
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

//install dependencies
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//set / as a route
app.get('/', async (request, response) => {
    //get all the todos from the database
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false })
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
//api call to create a new todo item
app.post('/addTodo', (request, response) => {
    //insert value into database
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false })
        .then(result => {
            console.log('Todo Added')
            response.redirect('/')
        })
        .catch(error => console.error(error))
})

//api call to update todo
app.put('/markComplete', (request, response) => {
    //update value in database with text(itemFromJS) completed: true
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
        //dollar sign set key value completed to true
        $set: {
            completed: true
        }
    }, {
        //Prevent from updating an item that does'nt exist
        sort: { _id: -1 },
        upsert: false
    })
        .then(result => {
            //message confirming update completed
            console.log('Marked Complete')
            //response to server.js request
            response.json('Marked Complete')
        })
        .catch(error => console.error(error))

})

//api call to update todo if it is not completed
app.put('/markUnComplete', (request, response) => {
    //update value in database
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
        $set: {
            //dollar sign set key value completed to false
            completed: false
        }
    }, {
        sort: { _id: -1 },
        upsert: false
    })
        .then(result => {
            console.log('Marked UnComplete')
            response.json('Marked UnComplete')
        })
        .catch(error => console.error(error))

})
//api call to delete todo
app.delete('/deleteItem', (request, response) => {
    //delete item from database
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS })
        .then(result => {
            console.log('Todo Deleted')
            response.json('Todo Deleted')
        })
        .catch(error => console.error(error))

})
//listen to port 
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`)
})