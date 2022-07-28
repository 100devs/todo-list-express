const express = require('express')
// brings express into the app
const app = express()
// shortens the usage of express
const MongoClient = require('mongodb').MongoClient
// brings in the db using mongo as middleware
const PORT = 2121
// defines port for db
require('dotenv').config()
// runs the configuration for database

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
// helps with shortcut

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
// Method on mongoClient called connect, takes two args
    .then(client => {
// MongoClient returns a promise, so .then is needed
        console.log(`Connected to ${dbName} Database`)
        // alerts us that db is connected
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')
// EJS is not stock in express, so we must set it as view engine
app.use(express.static('public'))
// sets the static folder
app.use(express.urlencoded({ extended: true }))
// needed to use express without issue
app.use(express.json())
// we are using express

app.get('/',async (request, response)=>{
// go and get the databases
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

app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
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

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})