const express = require('express') //this uses node module "express" to help us handle API requests
const app = express() //creates an instance of the express module
const MongoClient = require('mongodb').MongoClient //uses module "mongodb"
const PORT = 2121 //assigning a port for our server to communicate through
require('dotenv').config() //use node module dotenv which allows you to load in environment variable that yo uset up in a .env file: https://www.npmjs.com/package/dotenv

/* 
    Parse .env config file
    --> returns object based on parsed keys/values 
*/
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

/*
    Connect to MongoDB
*/
MongoClient.connect(dbConnectionStr, {
        useUnifiedTopology: true
    })
    .then(client => { //once client info is returned from initial connection, we will log to console that we are connected and assign db to this specific db/collection
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

/*
    Handle requests to / (usually homepage)
*/
app.get('/', async (request, response) => {
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({
        completed: false
    })
    response.render('index.ejs', {
        items: todoItems,
        left: itemsLeft
    })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({
            thing: request.body.todoItem,
            completed: false
        })
        .then(result => {
            console.log('Todo Added')
            response.redirect('/')
        })
        .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({
            thing: request.body.itemFromJS
        }, {
            $set: {
                completed: true
            }
        }, {
            sort: {
                _id: -1
            },
            upsert: false
        })
        .then(result => {
            console.log('Marked Complete')
            response.json('Marked Complete')
        })
        .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({
            thing: request.body.itemFromJS
        }, {
            $set: {
                completed: false
            }
        }, {
            sort: {
                _id: -1
            },
            upsert: false
        })
        .then(result => {
            console.log('Marked Complete')
            response.json('Marked Complete')
        })
        .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({
            thing: request.body.itemFromJS
        })
        .then(result => {
            console.log('Todo Deleted')
            response.json('Todo Deleted')
        })
        .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}: http://localhost:${PORT}`)
})