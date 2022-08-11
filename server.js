//dependencies: express, mongodb
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
//server will run on port 2121
const PORT = 2121
//necessary to use env values
require('dotenv').config()

//database variables: connection string and database name
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

//using ejs to generate pages
app.set('view engine', 'ejs')
//needed to use css, js, etc files; located in public directory
app.use(express.static('public'))
//need urlencoded to send requests to database
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//navigating to root triggers this function
app.get('/', async (request, response)=>{
    try {
        //store collection todos to todoItems as an array
    const todoItems = await db.collection('todos').find().toArray()
    //store number of items not completed to itemsLeft
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //render the webpage passing in an object with the list of items and number of items left
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    } catch (error) {
        console.error(error)
    }
    
    // .catch(error => console.error(error))
})

//adds an item to the todo list
app.post('/addTodo', async (request, response) => {
    //gets item from request body and adds it to database as not completed
    // try {
        
    // } catch (error) {
    //     console.error(error)
    // }
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//marks an item as completed
app.put('/markComplete', (request, response) => {
    //gets item from request body and sets it as complete in the database
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        //sort by id in ascending order?
        sort: {_id: -1},
        //prevents a new or duplicate instance to be created - update/insert
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//marks completed items as uncomplete
app.put('/markUnComplete', (request, response) => {
    //gets item from request body and sets completed to false
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Uncomplete')
        response.json('Marked Uncomplete')
    })
    .catch(error => console.error(error))

})


//removes item from database
app.delete('/deleteItem', (request, response) => {
    //get item from request body and remove it from the database
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//logs message to console when starting server
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})