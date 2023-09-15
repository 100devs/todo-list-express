const express = require('express')
// unchanging variable express requires express module
const app = express()
//unchanging variable app set equal to express application
const MongoClient = require('mongodb').MongoClient
//assign the variable MongoClient to require mongodb 
const PORT = 2121
//assign the port variable to 2121
require('dotenv').config()
//call config mothod to require in imported dotenv module loading .env file


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
//declare 3 variables. db, dbconnectionstring to store the connection string put into the process.env file. dbName assigned to todo database 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
//calling connect on MongoClient passing in the connection string and the object with the property of useUnifiedTopology set the true 
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
//log to the console connected to the database with the name of the dbName variable
        db = client.db(dbName)
//assign the desired db returned by the db method on the Mongo client to the db variable
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
//alows express to use client side files and parse in json


app.get('/',async (request, response)=>{
//////////get request from root 

    // const todoItems = await db.collection('todos').find().toArray()
    // const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // response.render('index.ejs', { items: todoItems, left: itemsLeft })
    db.collection('todos').find().toArray()
    //find the collection title todo and turn it to an array 
    .then(data => {
        //take that data 
        db.collection('todos').countDocuments({completed: false})
        //with any collections that have the completed status of false 
        .then(itemsLeft => {
            response.render('index.ejs', { items: data, left: itemsLeft })
            //respond by rendering that data in index.ejs with the text from itemsLeft
        })
    })
    .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {
    // post request with the addTodo path
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // find the collection with the todo title insert the text from todoITem to the collections with completed status of false 
    .then(result => {
        console.log('Todo Added')
        //log to the console that it was added
        response.redirect('/')
        //refresh and trigger another get request to reload the page with the new data
    })
    .catch(error => console.error(error))
    //if ther is an error console log the erro
})

app.put('/markComplete', (request, response) => {
    // put request with the path of markComplete
    db.collection('todos').updateOne({thing: request.body.
    itemFromJS},{
          // go to the data base and find the collection of updateOne and add the text from request.body
        $set: {
            completed: true
          }
          //change the completed status to true
    },{
        sort: {_id: -1},
        upsert: false
        //sort the collections 
    })
    .then(result => {
        console.log('Marked Complete')
        //log to the console the result mark complete
        response.json('Marked Complete')
        //respond in json it's complete
    })
    .catch(error => console.error(error))
    //log any errors to the console

})

app.put('/markUnComplete', (request, response) => {
    //put request with a markUnComplete path
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
    // go to the db and find the collection with the title of todo. update it with the text from itemFromJs
        $set: {
            completed: false
          }
    //set the completed status to false
    },{
        sort: {_id: -1},
        upsert: false
    //sort it
    })
    .then(result => {
        console.log('Marked Complete')
    //log to the console it's complete
        response.json('Marked Complete')
    //respond with json it's complete
    })
    .catch(error => console.error(error))
    //log errors to the console. 

})

app.delete('/deleteItem', (request, response) => {
    //delete request from the path deleteItem
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //go to the db and find  the collection with the todos title. delete the one that has the text that is request.body from itemFromJs
    .then(result => {
        console.log('Todo Deleted')
    //log to the console the ToDo Deleted
        response.json('Todo Deleted')
    //respond in json Todo Deleted
    })
    .catch(error => console.error(error))
    //log any errors to the console.

})

app.listen(process.env.PORT || PORT, ()=>{
    //listen on the express applicatoin to the PORT variable or preset PORt
    console.log(`Server running on port ${PORT}`)
    //log to the console the server is running on the PORT name
})