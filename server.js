// importing express
const express = require('express')
const app = express()
// importing MongoClient
const MongoClient = require('mongodb').MongoClient
// the port where the app will be listening
const PORT = 2121
// access the .env file
require('dotenv').config()

// global database variables
let db,
// get the connection string from the .env file
    dbConnectionStr = process.env.DB_STRING, 
    // name of the database
    dbName = 'todo'

    // connecting the database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
// accessing the views directory
app.set('view engine', 'ejs')
// accessing the public directory
app.use(express.static('public'))
// creates the request body. based on body parser
app.use(express.urlencoded({ extended: true })) // the value can be any data type
app.use(express.json())

// the default route
app.get('/',async (request, response)=>{
    // get all the tasks
    const todoItems = await db.collection('todos').find().toArray()
    // get the number of tasks that are not completed
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // rendering the template
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

// creating items
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        // refresh the page
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// update the tasks to mark them complete
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

// marking the tasks incomplete
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
// deleting a task
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})
// process.env.PORT helps us get the port from Heroku
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})