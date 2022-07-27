//back end server side code
//declaring variables for Mongo  to work choosing express variable, require express, require mongo client, declare port, require dotenv package as well
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient //.MongoClient lets you use methods from Mongo Client
const PORT = 2121
require('dotenv').config()

//declare db with a name
let db,
    dbConnectionStr = process.env.DB_STRING, //database connection string form .env
    dbName = 'todo' //database name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connection string
    .then(client => { //then call back console log database connection success
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) //storing all database objects in a variable
    })

//middlewares
app.set('view engine', 'ejs') //render EJS
app.use(express.static('public')) //serve all files in the public
app.use(express.urlencoded({ extended: true })) //returns middleware for parsing body in HTML
app.use(express.json()) //parses incoming JSON requests


app.get('/',async (request, response)=>{ //main page fetch
    const todoItems = await db.collection('todos').find().toArray() //adding key value pair of todos to collection key in object
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //counts how many items in your database a document is one record
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //renders EJS and creates keys to reference in EJS in the HTML
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //post request which creates an item in the database, this references HTML form, action on form is called "addToDo"
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //go into ToDos database and insert one adds an item. pulls from HTML form
    .then(result => { //shows completion
        console.log('Todo Added') //console.log to do added
        response.redirect('/') //redirect to homepage and reloads/renders the page
    })
    .catch(error => console.error(error)) //if there is an error console logs error
})

app.put('/markComplete', (request, response) => { //request to update database
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //find item user clicked on
        $set: { //set completed property to true
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false //update and insert, if document doesn't exist insert a new one
    })
    .then(result => { //when update successful console log and 
        console.log('Marked Complete') //console log server sending it
        response.json('Marked Complete') //front end receiving it and console logging the data variable.
    })
    .catch(error => console.error(error)) //if there is an error console logs error

})

app.put('/markUnComplete', (request, response) => { //request to update database
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //find item user clicked on
        $set: {
            completed: false //set completed property to false
          }
    },{
        sort: {_id: -1},
        upsert: false //update and insert, if document doesn't exist insert a new one
    })
    .then(result => {
        console.log('Marked Uncomplete') //console log server sending it
        response.json('Marked Uncomplete') //front end receiving it and console logging the data variable.
    })
    .catch(error => console.error(error)) //if there is an error console logs error

})

app.delete('/deleteItem', (request, response) => { //request to update database with a delete
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //find item user clicked on and click delete from todos database
    .then(result => { //if successful
        console.log('Todo Deleted') //console log to server
        response.json('Todo Deleted') //frotn end receiving it and console logging the data variable
    })
    .catch(error => console.error(error)) //if there is an error console logs error

})

app.listen(process.env.PORT || PORT, ()=>{ //listens for port from env file or whatever port you specify
    console.log(`Server running on port ${PORT}`) //console log a message of successing
})