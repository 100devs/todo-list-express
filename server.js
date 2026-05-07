const express = require('express')
//creates Express app
const app = express()
//gets MongoClient
const MongoClient = require('mongodb').MongoClient
//port of our server
const PORT = 2121
//this line allows us to use .env
require('dotenv').config()

//mongoDB connection URI  
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
//connect us to the DB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
//allows us to use .ejs    
app.set('view engine', 'ejs')
//allow our server acces to all folders and files in Public folder
app.use(express.static('public'))
//registers Express middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }))
//allow use to use json
app.use(express.json())

//this function fires when someone goes to the main page and it goes to todos DB and get all data then send it to the index.ejs as an array 
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    //counts how many data have complated false and return it a number
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
//this function fired with a post fetch with rout /addTodo and it add a task from request.body.todoItem text and give it propriety of complated false 
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        //logs todo added in terminal
        console.log('Todo Added')
        //reload page after task added
        response.redirect('/')
    })
    .catch(error => console.error(error))
})
//this function fired with a put fetch with rout /markComplete and it change a task with request.body.itemFromJS complated proriety to true
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
//this function fired with a put fetch with rout /markUnComplete and it change a task with request.body.itemFromJS complated proriety to false
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        //sort tasks from first one added to last
        sort: {_id: -1},
        //if there is no task with request.body.itemFromJS it doesnt create new one
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})
//this function fired with a delete fetch with route /deleteItem and it delete the task with request.body.itemFromJS 
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})
//making a server
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})