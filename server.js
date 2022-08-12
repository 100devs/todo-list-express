const express = require('express') //create constant 'express' to require express
const app = express() // call express
const MongoClient = require('mongodb').MongoClient //create constant 'MongoClient' to require mongodb
const PORT = 2121 //create constant 'PORT' to store port number
require('dotenv').config() //allow use of variables in .env


let db, //declare global var 'db'
    dbConnectionStr = process.env.DB_STRING, //create var 'dbConnectionStr' and assign to the database connection string in .env
    dbName = 'todo' //set variable 'dbName' as 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connect to mongo, pass into variable 'dbConnectionStr', use unified topology
    .then(client => { //call promise from MongoClient and store in client
        console.log(`Connected to ${dbName} Database`) //log a confirmation to console
        db = client.db(dbName) //assign variable 'db' to a client 'db' constructor method
    })
    
app.set('view engine', 'ejs') //set ejs as the default rendering engine for html
app.use(express.static('public')) //set location for static js and css
app.use(express.urlencoded({ extended: true })) //express decodes and encodes URLs where header and content match
app.use(express.json()) //express parses JSON content


app.get('/',async (request, response)=>{ //when root page is called, declare async function with params 'request' and 'response'
    const todoItems = await db.collection('todos').find().toArray() //create constant 'todoItems' that contains called items for the todo list and forms an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //create variable 'itemsLeft' to count number of items where completed: false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //render contents of 'response' to html in sections 'items' and 'left'
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //when 'addTodo' is called, run 'post' with params 'request' and 'response'
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //run 'collection' on db to insert one todo item with completed set to false
    .then(result => { // after promise resolves, run arrow function to log message in console and reload page
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error)) //log any errors to console
})

app.put('/markComplete', (request, response) => { //when 'markComplete' is called, run 'update' with params 'request' and 'response'
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //run 'collection' on db to update todo item 
        $set: { //set key value pair to change completed to true 
            completed: true
          }
    },{
        sort: {_id: -1}, //sorts completed item to end of list and prevent insertion (upsert) if the item does not yet exist
        upsert: false
    })
    .then(result => { //after promise resolves, run arrow function to log message in console and reload page
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error)) //log any errors to console

})

app.put('/markUnComplete', (request, response) => { //when 'markUnComplete' is called, run 'update' with params 'request' and 'response'
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //run 'collection' on db to update todo item 
        $set: { //set key value pair to change completed to false 
            completed: false
          }
    },{
        sort: {_id: -1}, //sorts completed item to end of list and prevent insertion (upsert) if the item does not yet exist
        upsert: false
    })
    .then(result => { //after promise resolves, run arrow function to log message in console and reload page
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error)) //log any errors to console

})

app.delete('/deleteItem', (request, response) => { //when 'deleteItem' is called, run 'update' with params 'request' and 'response'
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //run 'collection' on db to delete todo item 
    .then(result => { //after promise resolves, run arrow function to log message in console and reload page
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error)) //log any errors to console

})

app.listen(process.env.PORT || PORT, ()=>{ //set listening port on .env to 'PORT' and log message to console 
    console.log(`Server running on port ${PORT}`) 
})