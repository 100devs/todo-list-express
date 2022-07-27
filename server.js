const express = require('express') // requires Express so we can use it
const app = express() // shortcut for express so to be easy to use
const MongoClient = require('mongodb').MongoClient // require MongoDB to me imported
const PORT = 2121 // port fot localhost 
require('dotenv').config() // require and configurate to hidde the sensitive information

let db, // create database
    dbConnectionStr = process.env.DB_STRING, // shortcut for the DB address who is stored in .env
    dbName = 'todo' // create a database with the mane of todo

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connection between DB and server
    .then(client => { // response from a promise
        console.log(`Connected to ${dbName} Database`) // if the connection is successful will appear the message from console log
        db = client.db(dbName) //  defines the database in use
    })
    
app.set('view engine', 'ejs') // set the view engine to ejs
app.use(express.static('public')) // use the files from public folder
app.use(express.urlencoded({ extended: true })) // call the middleware
app.use(express.json()) // transform the objects to json


app.get('/',async (request, response)=>{ // set the response when client access homepage
    const todoItems = await db.collection('todos').find().toArray() // create a constant named 'todoItems', creates 'todos' takes data store in 'todos' and convert them into an array 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // create a constant  which counts the documents with false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // response rendered in index.ejs which contains { items: todoItems, left: itemsLeft }
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // response when we create an item
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // in our 'todos' we insert one more item who has the status false

    // if we added with success then we will see in console'Todo Added' and will be redirect to homepage (refreh)
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })

    // show if we have errors
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => { // when we change something
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // update 'thing' from our database 'todos' when the client request it 

        // tells the Mongo to change the 'completed' to 'true'
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1}, // sort the items descending
        upsert: false // if the item don't exist do not create new document
    })
    .then(result => {
        console.log('Marked Complete') // feedback for successful result
        response.json('Marked Complete') // response json on client side (main.js)
    })
    // show if we have errors
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // update 'thing' from our database 'todos' when the client request it 

         // tells the Mongo to change the 'completed' to 'false'
        $set: {
            completed: false 
          }
    },{
        sort: {_id: -1}, // sort the items descending
        upsert: false // if the item don't exist do not create new document
    })
    .then(result => {
        console.log('Marked Complete') // feedback for successful result
        response.json('Marked Complete') // response json on client side (main.js)
    })
    // show if we have errors
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => { // acctions when delete an item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // delete 'thing' from our database 'todos' when the client request it 
    .then(result => {
        console.log('Todo Deleted') // feedback for successful result
        response.json('Todo Deleted') // response json on client side (main.js)
    })
    // show if we have errors
    .catch(error => console.error(error))

})

// server runs on localhost at PORT or for eg Heroku, it will use its own PORT then we need process.env.PORT
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`) // shows on console that the server runs
})