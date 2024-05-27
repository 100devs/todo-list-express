// add packages to be used, and define port + linking .env file 
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

// provides the connection to the specific MongoDB collection
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

// connect ejs and expose the files in the public folder    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// listen for get request on root
app.get('/',async (request, response)=>{
    // get list of todos from MongoDB collection titled todos
    const todoItems = await db.collection('todos').find().toArray()
    //tally up todos to determine how many are completed and how many are not completed based on completed property from MongoDB being true/false
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

// when form submitted, posts a request to DB with that item and completed flag as false then reloads the page
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//listen for click on span to complete task 
app.put('/markComplete', (request, response) => {
    //update task in db to completed: true flag
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        //sort from completed to incomplete
        sort: {_id: -1},
        upsert: false
    })
    //then respond with marked complete which will trigger a reload from client side listener. 
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//listen for click on span to uncomplete task 
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        //sort from completed to incomplete
        sort: {_id: -1},
        upsert: false
    })
    //then respond with marked uncomplete which will trigger a reload from client side listener. 
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//listens for click on trash can, and then sends a delete request for that item to DB
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //then triggers reload client side with event listener and the following response.json
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//notifies you when server is running in a console log
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})