//Imports
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

//Setting Database settings such as connection string and db name
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
//Creating the connection to database and passing in a connection string, alongside a property 'useUnifiedTopology'.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
//Promise chain to allow for successful database connection and setting db variable to said database, and notifies whether connection went through through a console.log.
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
//Middleware
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//Read request at base endpoint, setting two variables. todoItems being set to retrieve todos collection and convert to an array. itemsLeft being set to todos collection document count to allow for items left to finish
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
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
//Create request at 'addTodo' endpoint, accessing database collection and inserting request body as a new task
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //Promise chain to notify the successful addition of a task and redirecting back to base endpoint for rendering.
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})
//Update request at 'markComplete' endpoint, using updateOne method to access the database collection and update with whatever the request body is and rendering it.
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //Setting the completed property to true to allow for task to be marked completed
        $set: {
            completed: true
          }
    },{
        //Sorting by id and setting an upsert
        sort: {_id: -1},
        upsert: false
    })
    //Finalizing completion
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})
//Update request at 'markUncomplete' endpoint, using updateOne methodto access the database collection and update whatever the request body is and rendering it.
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //Setting the completed property to false to allow for task to remain incomplete
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
//Delete request at 'deleteItem' endpoint, accessing database using deleteOne method and using the request body to match the result and delete it from the collection.
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //Promise chain to notify if the Todo was deleted
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})
//Setting the port to any availabe port, and if none are available, then default to the PORT variable.
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})