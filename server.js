//import the express module
const express = require('express')
//create an express application
const app = express()
//import the MongoClient module
const MongoClient = require('mongodb').MongoClient
//set the port to 2121
const PORT = 2121
//use the dotenv file for configuration
require('dotenv').config()

// initialize db variable, set dbConnectionStr to the DV_STRING variable in dotenv file, set dbName to 'todo'
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//connect to MongoDB through the string establish in the dotenv
//useUnifiedTopology to avoid deprecation error
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        // once connected, print to the console that you're connected to the database named todo
        console.log(`Connected to ${dbName} Database`)
        //set the database to the connected database
        db = client.db(dbName)
    })

//setting up the app to use ejs
app.set('view engine', 'ejs')
//
app.use(express.static('public'))
//
app.use(express.urlencoded({ extended: true }))
//setting the app to use json
app.use(express.json())

//when at the url ending with '/', get the following from the server
app.get('/',async (request, response)=>{
    // assign all the todo items from the todos collection to a variable as an array
    const todoItems = await db.collection('todos').find().toArray()
    // count of todo items
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //show the todo items through an index.ejs file that can be interpreted by the browser
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

// when on the url ending /addTodo, send the following to the database
app.post('/addTodo', (request, response) => {
    // insert the new todo item
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // once that's complete, if successful, print to the console that it worked and go back to the main page
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    // if it's not successful, print the error to the console
    .catch(error => console.error(error))
})

// when on the url /markComplete, update the database in the following way
app.put('/markComplete', (request, response) => {
    //select the one database item you are looking to update
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // update completed to be true
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    // then, if successful, print to the console and to the browser that it was 'Marked Complete'
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    // if not successful, print the error to the console
    .catch(error => console.error(error))

})

// when on the url /markUnComplete, update the database in the following way
app.put('/markUnComplete', (request, response) => {
    //find the item you want to update in the database
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            // update completed to be false
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    // then, if successful, print to the console and to the browser that is was 'Marked InComplete' - below is a typo
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    // if not succesful, print the error to the console
    .catch(error => console.error(error))
})

// when on the url /deleteItem, remove the item from the database
app.delete('/deleteItem', (request, response) => {
    //search for and delete the item selected
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // if successful, print 'TodoDeleted' to the console and the browser
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    // if not successful, print the error to the console
    .catch(error => console.error(error))

})

// when the app is started, print to the console which PORT it is running on
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})