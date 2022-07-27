const express = require('express') //requires express to be used
const app = express() // adding variable "app" when using express
const MongoClient = require('mongodb').MongoClient //requires mongoclient
const PORT = 2121 // port for localhost
require('dotenv').config() //requiring dotenv 

//creating variables for DB, dbconnectionstring from .env and naming db
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//connection to DB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`) //response in console that it connected
        db = client.db(dbName) // we set the name to our db in mongodb (See variables set above)
    })

//Set middlewares    
app.set('view engine', 'ejs') //tells our app which view engine will be used to render content
app.use(express.static('public')) // tells our app to use "public" folder for all static files (css, images, sounds, etc)
app.use(express.urlencoded({ extended: true }))
app.use(express.json()) // turn objects into json


app.get('/', async (request, response) => {
    // what to display when client connects to "/" (home) route

    const todoItems = await db.collection('todos').find().toArray() //create variable todoItems that goes into 'todos' collection and transform all documents into an array

    const itemsLeft = await db.collection('todos').countDocuments({ completed: false }) //counts how many items there are in the collection with property completed being false

    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // sends response to render 'items' and 'left' 

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //adding a new item at route /addTodo

    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false }) //inserting one doc in collection 'todos' with following properties {thing: request.body.todoItem, completed: false}

        .then(result => {
            console.log('Todo Added') // feedback that it was added

            response.redirect('/') // after adding go back to '/' (refresh)
        })

        .catch(error => console.error(error)) // catching error in case there's any
})

app.put('/markComplete', (request, response) => {//updating an item

    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, { //goes into collection 'todos' and update one item with following {thing: request.body.itemFromJS}, itemFromJS comes from main.js
        $set: {
            completed: true // we setting 'completed' property from false to true
        }
    }, {
        sort: { _id: -1 }, //sort descending by id
        upsert: false // doesnt create a new doc in case item is not found
    })
        .then(result => {
            console.log('Marked Complete') //feedback that it was marked completed
            response.json('Marked Complete') // json response to main.js
        })
        .catch(error => console.error(error)) //catch error

})

app.put('/markUnComplete', (request, response) => { // update item to uncomplete
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, { //goes into collection 'todos' and update one item with following {thing: request.body.itemFromJS}, itemFromJS comes from main.js

        $set: {
            completed: false // we setting 'completed' property from true to false
        }
    }, {
        sort: { _id: -1 }, //sort descending by id
        upsert: false // doesnt create a new doc in case item is not found
    })
        .then(result => {
            console.log('Marked Complete') // feedback in console
            response.json('Marked Complete') // sends response to main.js
        })
        .catch(error => console.error(error)) // catch error

})

app.delete('/deleteItem', (request, response) => { //deleting an item
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS }) //goes into collection 'todos' and delete one item with following {thing: request.body.itemFromJS}, itemFromJS comes from main.js
        .then(result => {
            console.log('Todo Deleted') //feedback in console it was deleted
            response.json('Todo Deleted') //response to main.js
        })
        .catch(error => console.error(error)) //catch error

})

app.listen(process.env.PORT || PORT, () => { //tells our app to listen for the port we set to connect to. Or if we use for example heroku which sets his own ports to use process.env.PORT
    console.log(`Server running on port ${PORT}`) // logs succesfull connection
})