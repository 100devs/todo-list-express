//declarations
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

//More db declarations
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
//Connect to the DB declared above
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        //Log when connected
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
//Set the view engine as EJS    
app.set('view engine', 'ejs')
//To avoid having to write files in full?
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//API called on page load
app.get('/',async (request, response)=>{
    //Get all todo items from the DB
    const todoItems = await db.collection('todos').find().toArray()
    //Count items
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //return Items to be rendered by EJS
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

//API request to add todo item
app.post('/addTodo', (request, response) => {
    //Insert the Item in the DB
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        //Log 
        console.log('Todo Added')
        //redirect to home page
        response.redirect('/')
    })
    //catch and log error
    .catch(error => console.error(error))
})

//API request to mark an item as complete
app.put('/markComplete', (request, response) => {
    //Update the DB entry to mark the item as complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        //Log and return Marked Complete
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //catch and log error
    .catch(error => console.error(error))

})

//API request to mark an item as not complete
app.put('/markUnComplete', (request, response) => {
     //Update the DB entry to mark the item as not complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
         //Log and return Marked Complete
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //catch and log error
    .catch(error => console.error(error))

})

//API request todelete an item
app.delete('/deleteItem', (request, response) => {
    //Delete the item from the DB
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        //Log and return Todo Deleted
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    //catch and log error
    .catch(error => console.error(error))

})

//tell express which port to use
app.listen(process.env.PORT || PORT, ()=>{
    //log that the server is running
    console.log(`Server running on port ${PORT}`)
})