const express = require('express') // import 'express' npm
const app = express() //defines the express function
const MongoClient = require('mongodb').MongoClient //import MongoClient
const PORT = 2121 //set default/backup port
require('dotenv').config() // import dotenv


let db, //declare db variable
    dbConnectionStr = process.env.DB_STRING,//Declare and assign the connection string to use either the value in local .env or in the environment variables(eg on heroku)
    dbName = 'todo'//assigns database collection name to variable

    // useUnifiedTopology: False by default. Set to true to opt in to using the MongoDB driver's new connection management engine.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // Assign the database to connect to in Mongo, second parameter is to allow async/await but is deprecated
    .then(client => { //Promise chain of all the collections in the cluster
        console.log(`Connected to ${dbName} Database`)//Console logs a string of the database name when connected.
        db = client.db(dbName)// assign db variable => adds/connects a collection called dbname(that is, 'todo') to the cluster
    })
    
app.set('view engine', 'ejs')//sets the view engine to use EJS templating for making/editing HTML
app.use(express.static('public')) //tells the server to serve files requested from the 'public' folder
app.use(express.urlencoded({ extended: true })) //encodes the info from server into a format that json likes
app.use(express.json()) // parses the info served into json proper

//GET or READ(CRUD)
app.get('/',async (request, response)=>{ //user connects to main('/') page
    const todoItems = await db.collection('todos').find().toArray()// Grabs 'todos' collection in its entirety, converts it into an array, stores it in todoItems
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //assigning incomplete tasks as "itemsLeft"
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//respond with the EJS of tasks - passing in items & left into index.ejs
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//POST or CREATE (CRUD)
app.post('/addTodo', (request, response) => { //form action addToDo 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts one new task based on info from html/ejs form
    .then(result => {//then...
        console.log('Todo Added')//console log the result
        response.redirect('/')//redirect user to updated root page
    })
    .catch(error => console.error(error)) //catches in case of an error
})

//PUT or UPDATE
app.put('/markComplete', (request, response) => { //the put request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //connecting to db, update selected item
        $set: { //set item to have...
            completed: true //completed = true
          }
    },{ //this doesn't seem necessary
        sort: {_id: -1},
        upsert: false //if item doesn't exist, create it
    })
    .then(result => { //then...
        console.log('Marked Complete') //log 'marked complete'
        response.json('Marked Complete') //respond with json 'marked complete'
    })
    .catch(error => console.error(error)) //catch in case of error

})

//another PUT/UPDATE
app.put('/markUnComplete', (request, response) => { //same as above but for UNcomplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //connect to db
        $set: { //update selected items
            completed: false //set to false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')//log 'marked complete'
        response.json('Marked Complete') //respond with json 'marked complete'
    })
    .catch(error => console.error(error))//catch in case of error


})

//DELETE
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //connect to db collection, select what to delete
    .then(result => { //then...
        console.log('Todo Deleted') //log 'todo deleted'
        response.json('Todo Deleted') //respond with json
    })
    .catch(error => console.error(error)) //catch in case of error

})

app.listen(process.env.PORT || PORT, ()=>{ //specifies what port to listen to, dot env or the specific port from top of page
    console.log(`Server running on port ${PORT}`) //logs 'server running on ____'
})