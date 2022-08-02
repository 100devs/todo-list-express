const express = require('express')
// telling server express is required
const app = express()
// telling server express is used
const MongoClient = require('mongodb').MongoClient
// setting mongodb
const PORT = 2121
// setting port
require('dotenv').config()


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
    // setting variables for the database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    // connecting with mongodb
    
app.set('view engine', 'ejs')
// setting ejs as view
app.use(express.static('public'))
// connection with the folder
app.use(express.urlencoded({ extended: true }))
// teeling express to use urls
app.use(express.json())
// telling express to use json


app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    // read request; will wait for the db collection to find items and arrange them array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // wait until the left over documents are counted
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // responding with the ejs

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
// creating the list, then refresh and new get (read) request

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
// updating the list for completition, then refresh and new get (read) request

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
// updating the list for uncplete items, then refresh and new get (read) request

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})
// delete request

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
// telling the server to listen to a specific port set by the variables