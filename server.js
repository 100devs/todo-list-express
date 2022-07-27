// required dependicies
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
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
 
// this sets up the middleware
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
 
// root route
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray() // finds to do items and turns it to an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // checks to see how mnay items are left in the to do
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // shows the to do on the page using ejs
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})
 
app.post('/addTodo', (request, response) => { // adding a todo to the page
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // going in the collection, inserting the to do into the body and has a completed of false since it is not checked off
    .then(result => {
        console.log('Todo Added')
        response.redirect('/') // refreshes the page with new to do
    })
    .catch(error => console.error(error))
})
 
app.put('/markComplete', (request, response) => { // update the to do when completed
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // updating the item in the body
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1}, // sorting the to dos from highest to lowest
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))
 
})
 
app.put('/markUnComplete', (request, response) => { // update the to do when uncompleted
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // updating the item in the body
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1}, // sorting the to dos from highest to lowest
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))
 
})
 
app.delete('/deleteItem', (request, response) => { // updating the to do when it gets deleted
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // removing the item in the body
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))
 
})
 
app.listen(process.env.PORT || PORT, ()=>{ // the port the server is running on
    console.log(`Server running on port ${PORT}`)
})
