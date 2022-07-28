const express = require('express') //use express in file
const app = express() //save express as variable called app
const MongoClient = require('mongodb').MongoClient //use mongo to connect to db
const PORT = 2121 // set variable that declares port location 
require('dotenv').config() //look at env file


let db, //declare variable db
    dbConnectionStr = process.env.DB_STRING, //declare variable to look at db connection string in env file
    dbName = 'todo' //setting name of db in variable

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //create mongo connection with connection string with additional property
    .then(client => { //wait for connectiona and proceed if successful, pass in client info
        console.log(`Connected to ${dbName} Database`) //log name of database pulled from todo variable
        db = client.db(dbName) //assigning value to db with name of db todo
    })
 
//middleware to communicate btw db and client
app.set('view engine', 'ejs') //set ejs to render file
app.use(express.static('public')) // set access in public folders for static files
app.use(express.urlencoded({ extended: true })) //tells ejs to auto encode/decode urls
app.use(express.json()) //parse json


app.get('/',async (request, response)=>{ //get or read request from root
    const todoItems = await db.collection('todos').find().toArray() //set variable and awaits all items from todo colloection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // get back number of incomplete items
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //render index.ejs and pass db items and count as objects
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //start method when addtodo action is triggered
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //in todos collection add incomplete item
    .then(result => { // if above completed, do following
        console.log('Todo Added') //conole log that item addded
        response.redirect('/') //refresh page
    })
    .catch(error => console.error(error)) //console log if error
})

app.put('/markComplete', (request, response) => { //update/put method if markcomplete method passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look at db for item matching what was passed in from main.js
        $set: {
            completed: true //mark as completed by setting to true
          }
    },{
        sort: {_id: -1}, //move to bottom of list 
        upsert: false // stop insert of time if does not already exist
    })
    .then(result => { //start if update successful
        console.log('Marked Complete') //then log as complete
        response.json('Marked Complete') //send json to main.js
    })
    .catch(error => console.error(error)) //catch error

})

app.put('/markUnComplete', (request, response) => { //start put when markuncomplete route passed
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in db for matching item
        $set: {
            completed: false //mark as completed by setting to false
          }
    },{
        sort: {_id: -1},//move to bottom of list
        upsert: false // stop insert of time if does not already exist
    })
    .then(result => { //start if update successful
        console.log('Marked Complete')//then log as complete
        response.json('Marked Complete')//send json to main.js
    })
    .catch(error => console.error(error))// log error

})

app.delete('/deleteItem', (request, response) => {//start delete when route passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //look in db and find matching item
    .then(result => { //run if delete successful
        console.log('Todo Deleted') //console log success
        response.json('Todo Deleted') //send results to sender
    })
    .catch(error => console.error(error)) //catch error

})

app.listen(process.env.PORT || PORT, ()=>{ //specify which port to use
    console.log(`Server running on port ${PORT}`) //log which port is running
})