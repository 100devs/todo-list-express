// setting up express, putting express into app variable, setting up the mongo client, setting port 2121 and dotenv
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

// setting up db with url set to dbConnectionStr and the name of database as dbName 
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// connecting to mongoDb and writing in the console if connection succeeds
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
  
// runs index.ejs
app.set('view engine', 'ejs')
// lets the browser use files in public folder (css and main.js)
app.use(express.static('public'))
// chop of headers and request.body will contain values beyond string values
app.use(express.urlencoded({ extended: true }))
// sets information from above into json
app.use(express.json())


app.get('/',async (request, response)=>{
    // grabbing the db information and organizing it into an array and setting any new files as false
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // renders the todos onto the ejs and sets up the db content for the ejs list
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

// post request, inserts the item from request.body.todoItem, defaulting to false with completed variable, then let's us know and refreshes if it works
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// put request to mark as complete, takes the specific item and marks complete, then sorts the items by completion status.
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

// put request to mark as uncomplete, takes the specific item and marks uncomplete, then sorts the items by completion status.
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

// deletes tedo item
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
