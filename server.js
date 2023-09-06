const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()
// setting/importing express and MongoDB our .env file and making our default port


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

// Using the DB_String within our .env folder to connect to the DB

app.set('view engine', 'ejs')
// setting EJS as our html templating language
app.use(express.static('public'))
// make express automatically return all files within the public folder when requested (does a lot of back-lifting work / removes an immeasurable amount of manually get requests)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// grabs the information out of a request body


app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    // grab all documents
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // grab number of documents with a false completed property
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // pass all documents as well as the number of documents with "completed": false, property:value pair

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
    // create a new document within the db
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    // tell the client to refresh, sending another get request
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
// both put requests update the first value in the db that has the task into with a logical NOT

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})
// we use the value from the req body to search our db, find the first match, then remove it from our db, then communicate back to the client.

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
// listens for requests to the specified/provided port.