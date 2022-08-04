const express = require('express')
// This defines express as requiring the use of the middleware 'express'
const app = express()
// This makes the app use express
const MongoClient = require('mongodb').MongoClient
// This forces the MongoDB data base to be engaged when referenced
const PORT = 2121
// This denotes which server port the app should focus on using
require('dotenv').config()
// This requires the environment to be configured


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
// This establishes short cuts to the data base and stores your login for Mongo and your personal info which contains all that to the .env file

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
// The above connects the MongoClient info to connect to the exterior database using the login info and the method appropriate. It then handles what to do with that connect, and it publishes the name of the database it linked to. 

app.set('view engine', 'ejs')
// This sets the app to use express.js in accessing the info in these files
app.use(express.static('public'))
// This tells the app to use everything in express files publicly and without direction
app.use(express.urlencoded({ extended: true }))
// This makes your app use a url encoded express which extends your capabilities
app.use(express.json())
// This makes your app use json which allows communication with the api


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
    // The above is express doing the heavy lifting, 
})

app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})
// This adds a todo item to the collection stored in mongoDB and refreshes the page to show the additional list item, if it doesnt work it will throw an error

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
// This changes a todo item from one collection to the other collection stored in mongoDB and refreshes the page to show the different list item(maybe crossed out or lightened and made italics), if it doesnt work it will throw an error

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
    // This changes a todo item from one collection to the other collection stored in mongoDB and refreshes the page to show the different list item(maybe crossed out or lightened and made italics), if it doesnt work it will throw an error
})

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))
// This deletes a todo item from the collection stored in mongoDB and refreshes the page to show the shorter list, if it doesnt work it will throw an error
})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
// This shows that the server is ready to do work and communicate for/with the app and databases, it also shows what port the app's server is functioning off of