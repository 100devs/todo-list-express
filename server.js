// dependencies 
//declare express
const express = require('express')
//assign express to variable app
const app = express()
//declare mongodb
const MongoClient = require('mongodb').MongoClient
//declare port
const PORT = 2121
//declare dotenv 
require('dotenv').config()

//link DB and declare db name 'todo'
let db,
    // mongodb connection string
    dbConnectionStr = process.env.DB_STRING,
    //link to db name 
    dbName = 'todo'
//connect to db
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // async: once connected to mongo db
    .then(client => {
        //console log that connection was succesful
        console.log(`Connected to ${dbName} Database`)
        //declare db variable equal to db name in Mongo
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//get request
app.get('/',async (request, response)=>{
    //create variable that waits & holds todo items
    const todoItems = await db.collection('todos').find().toArray()
    //
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
//post request
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})
//update request
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
//update request
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
//delete request
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})
// returns server port running 
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})