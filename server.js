const express = require('express')  //import express package
const app = express()   //initialise express package into app variable
const MongoClient = require('mongodb').MongoClient  //import mongodb and client
require('dotenv').config()  //import .env to use environment variables


let db, //create db variable
    dbConnectionStr = process.env.DB_STRING, //point to connection string in .env
    dbName = 'todo' //assign variable for db name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connect to mongodb database, unifiedTopology for new connection version
    .then(client => {
        console.log(`Connected to ${dbName} Database`)  //show success message in log
        db = client.db(dbName)  //assign database to db variable
    })
    
app.set('view engine', 'ejs')   //set up express options
app.use(express.static('public'))   //middleware that points to public folder
app.use(express.urlencoded({ extended: true })) //settings for encoded url
app.use(express.json()) //settings to enable json


app.get('/',async (request, response)=>{    //client requests route page (root) to send back or throw error - uses async/await
    /*const todoItems = await db.collection('todos').find().toArray()     //find to-do items in collection and add to array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})   //count number for items where completed === false
    response.render('index.ejs', { items: todoItems, left: itemsLeft })     //render ejs file to show todoItems and itemsLeft*/
    db.collection('todos').find().toArray() //find to-do items in collection and add to array
    .then(data => {
        db.collection('todos').countDocuments({completed: false})   //count number of items in to-do collection where completed === false
        .then(itemsLeft => {    //include itemsLeft
        response.render('index.ejs', { items: data, left: itemsLeft })  //render on page using ejs file: data from above and itemsLeft
        })
    })
    .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {   //client requests route page (addTodo) to add items
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})  //add an item to the todos collection with completed status false
    .then(result => {
        console.log('Todo Added')   //show success message in console log
        response.redirect('/')  //after post request, redirect to root (triggers get request)
    })
    .catch(error => console.error(error))   //throw error in console if request unsuccessful
})

app.put('/markComplete', (request, response) => {   //client requests route page (markComplete) to update item
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{     //update requested item in todos collection
        $set: { //change item completed status to true
            completed: true
          }
    },{
        sort: {_id: -1},    //if item not found, do not upsert
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')  //show success message in console log
        response.json('Marked Complete')    //return a json response with success message
    })
    .catch(error => console.error(error))   //throw error in console if request unsuccessful

})

app.put('/markUnComplete', (request, response) => { //client requests route page (markUnComplete) to update item
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //update requested item in todos collection
        $set: {
            completed: false    //change item completed status to false
          }
    },{
        sort: {_id: -1},    //if item not found, do not upsert
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')  //show success message in console log
        response.json('Marked Complete')    //return a json response with success message
    })
    .catch(error => console.error(error))   //throw error in console if request unsuccessful

})

app.delete('/deleteItem', (request, response) => {  //client requests route (deleteItem) to delete item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})  //delete requested item in todos collection
    .then(result => {
        console.log('Todo Deleted') //show success message in console log
        response.json('Todo Deleted')   //return a json response with success message
    })
    .catch(error => console.error(error))   //throw error in console if request unsuccessful

})

app.listen(process.env.PORT || PORT, ()=>{  //tell express to listen on specified port
    console.log(`Server running on port ${process.env.PORT}`)   //show server running message in console log
})