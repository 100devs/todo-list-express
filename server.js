const express = require('express') // loads Express
const app = express() // create Express application
const MongoClient = require('mongodb').MongoClient // import MongoClient to allow connection MongoDB
const PORT = 2121 // sets local port to 2121
require('dotenv').config() // import env file to hide secrets


let db, // create database
    dbConnectionStr = process.env.DB_STRING, // set db connection string
    dbName = 'todo' // assign db to client db

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connect to Mongo via Mongo's provided string; unifiedTopography helps keep returns clean
    .then(client => { // if connected
        console.log(`Connected to ${dbName} Database`) // log to confirm connnection
        db = client.db(dbName) // set db == toDo
    })
    
app.set('view engine', 'ejs') // set template (view engine) to ejs (embedded JavaScript)
app.use(express.static('public')) // points Express to public; sets folder to static
app.use(express.urlencoded({ extended: true })) // tells server to use middleware to "clean up" data
app.use(express.json()) // Express should return results in JSON format


app.get('/',async (request, response)=>{ // get request to root
    const todoItems = await db.collection('todos').find().toArray() // get all todo items from db
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // get number of incomplete items from db
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // render index.ejs with todo items and number of incomplete items
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false}) // create collection of data in "todo"
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft }) // return items remaining on To Do list
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // add user input (to do item) to database
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added') // confirm user input was added
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => { // update database to change item status
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1}, // sort data
        upsert: false // prevents creation of new documents in response to search
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => { // allows user to revert marked item to undone status
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false // changes completed to false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete') // confirm user input received
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => { // allows user to remove items
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // finds and removes target item from database
    .then(result => {
        console.log('Todo Deleted') // confirms deletion
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{ // calls port
    console.log(`Server running on port ${PORT}`) // confirms port
})