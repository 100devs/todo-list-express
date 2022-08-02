const express = require('express')    // require express
const app = express()    // declare app as express object
const MongoClient = require('mongodb').MongoClient    // require mongodb
const PORT = 2121    // declare PORT as 2121
require('dotenv').config()    // require dotenv


let db,    // initialize db
    dbConnectionStr = process.env.DB_STRING,    // process.env.DB_STRING value from environment variable
    dbName = 'todo'    // declare dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })    // connect to database with dbconnection string
    .then(client => {
        console.log(`Connected to ${dbName} Database`)    // server console log `Connected to ${dbName} Database`
        db = client.db(dbName)    // declare db as client.db('todo')
    })
    
app.set('view engine', 'ejs')    // set ejs as view render engine
app.use(express.static('public'))    // make public folder accessible to the public
app.use(express.urlencoded({ extended: true }))    // express middleware to handle POST and PUT requests
app.use(express.json())    // express middleware to handle JSON objects


app.get('/',async (request, response)=>{    // GET request for fetching data from database and generating view
    const todoItems = await db.collection('todos').find().toArray()    // declare todoItems as an array with documents from todos collection database
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})    // declare itemsLeft as documents that have completed as false
    response.render('index.ejs', { items: todoItems, left: itemsLeft })    // generate index.ejs view passing in todoItems and itemsLeft
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {    // POST request for adding todo item to database
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})    // create document with todoItem and completed as false
    .then(result => {
        console.log('Todo Added')    // server console log 'Todo Added'
        response.redirect('/')    // redirect URL to '/'
    })
    .catch(error => console.error(error))    // catch error and log to console
})

app.put('/markComplete', (request, response) => {    // PUT request to mark item as complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{    // locate document to update in todos collection
        $set: {
            completed: true    // set completed to true
          }
    },{
        sort: {_id: -1},    // set sort _id to -1
        upsert: false    // upsert defines if document exists, update. else create. false means it will not create document
    })
    .then(result => {
        console.log('Marked Complete')    // server console log 'Marked Complete'
        response.json('Marked Complete')    // send JSON response 'Marked Complete'
    })
    .catch(error => console.error(error))    // catch error and log to console

})

app.put('/markUnComplete', (request, response) => {    // PUT request to mark item as not complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{    // locate document to update in todos collection
        $set: {
            completed: false    //set completed to false
          }
    },{
        sort: {_id: -1},     // set sort _id to -1
        upsert: false    // upsert defines if document exists, update. else create. false means it will not create document
    })
    .then(result => {
        console.log('Marked UnComplete')    // server console log 'Marked UnComplete'
        response.json('Marked UnComplete')    // send JSON response 'Marked UnComplete'
    })
    .catch(error => console.error(error))    // catch error and log to console

})

app.delete('/deleteItem', (request, response) => {    // DELETE request to remove todo item from database
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})    // locate todo item and delete from database
    .then(result => {
        console.log('Todo Deleted')    // server console log 'Todo Deleted'
        response.json('Todo Deleted')    // send JSON response 'Todo Deleted'
    })
    .catch(error => console.error(error))    // catch error and log to console

})

app.listen(process.env.PORT || PORT, ()=>{    // set this app to listen to process.env.PORT or PORT variable
    console.log(`Server running on port ${PORT}`)    // server console log `Server running on port ${PORT}`
})
