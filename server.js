const express = require('express') //import express package into express object
const app = express() //instantiate the express object as app
const MongoClient = require('mongodb').MongoClient //import MongoClient object from mogodb package
const PORT = 2121 //local port
require('dotenv').config() //import dotenv's config object


let db,  //declare db variable 
    dbConnectionStr = process.env.DB_STRING, //declare db variable and assign it the value from process.env.DB_String
    dbName = 'todo' //declare dbName variable and assign it the value 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)//output to console database name
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs') // use EJS
app.use(express.static('public')) //set public folder
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray() //find 
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

app.post('/addTodo', (request, response) => {//starts a POST method when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item into todos collection default complete is false
    .then(result => { //if insert is successful  do...
        console.log('Todo Added') //output to console 'Todo Added'
        response.redirect('/')//gets rid of the /addTo route, redirect to home
    }) //close then
    .catch(error => console.error(error))// catch error
})

app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in db for match
        $set: {
            completed: true //set completed status to true
          }
    },{
        sort: {_id: -1}, //moves item to bottom of list
        upsert: false //update if exists, insert if it doesn't
    })
    .then(result => {//then if update was successful
        console.log('Marked Complete') //output to console 'Marked Complete'
        response.json('Marked Complete') //send response back to sender
    })
    .catch(error => console.error(error))//output to console the error if there is one

})//end put

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look for item
        $set: {
            completed: false //set completed status to false
          }
    },{
        sort: {_id: -1}, //move item to bottom of list
        upsert: false
    })
    .then(result => { //if update was successful
        console.log('Marked Complete') //output to console 'Mark Uncomplete'
        response.json('Marked Complete') //send response back to sender
    })
    .catch(error => console.error(error))//catch error

})

app.delete('/deleteItem', (request, response) => {//start delete when delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//remove matching item from db
    .then(result => { //if successful do...
        console.log('Todo Deleted') //output to console 
        response.json('Todo Deleted')//send response back to server 
    })
    .catch(error => console.error(error))//catch error

})

app.listen(process.env.PORT || PORT, ()=>{ //listen to the port from Heroku or this file
    console.log(`Server running on port ${PORT}`) //output to console string with server value
})