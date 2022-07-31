const express = require('express')//require express, allows use of express methods
const app = express()//Set constact and assinging it to use express
const MongoClient = require('mongodb').MongoClient//Makes it possible to use methods associated with MongoClient
const PORT = 2121//Setting constant to define location where server will listen
require('dotenv').config()//allows us to look for variables inside .env file

let db,//declare variable called db but not assigning it a value
    dbConnectionStr = process.env.DB_STRING,//declare variable and assigning database string to it
    dbName = 'todo'//declare variable and assigning the database name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//creates connection to MongoDB, passes connection string
    .then(client => {//waits for connection and proceds if succesful
        console.log(`Connected to ${dbName} Database`)//Console log saying you're connected to the database
        db = client.db(dbName)//assign value to previously declared variable
    })//closes .then
    
//middleware
app.set('view engine', 'ejs')//sets ejs as default render method
app.use(express.static('public'))//sets location for static assets
app.use(express.urlencoded({ extended: true }))//tells express to decode and encode urls where header matches the content
app.use(express.json())//Uses JSON content

app.get('/',async (request, response)=>{//Requests information from the database with GET method
    const todoItems = await db.collection('todos').find().toArray()//Finds and sets array of items
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//Finds items that have not been completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//Shows items that have not been marked as completed
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {//Starts POST method
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//Inserts info into 'todo' section
    .then(result => {//if insert is succesful, do something
        console.log('Todo Added')//console log action
        response.redirect('/')//gets rid of /addToDo route, redirects to main page
    })//closes .then
    .catch(error => console.error(error))//catches errors
})//ends POST

app.put('/markComplete', (request, response) => {//Starts PUT method when markComplete is passed
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in database for one item matching the name of item passed from main.js
        $set: {
            completed: true//set completed status to true
          }
    },{
        sort: {_id: -1},//moves item to bottom of list
        upsert: false//prevents insertion if item does not exist
    })
    .then(result => {//starts if succesful
        console.log('Marked Complete')//console log successful completion
        response.json('Marked Complete')//send response to sender
    })//close .then
    .catch(error => console.error(error))//catches errors

})//ending put

app.put('/markUnComplete', (request, response) => {//Starts PUT method when markUnComplete is passed
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in database for one item matching the name of item passed from main.js
        $set: {
            completed: false//set completed status to false
          }
    },{
        sort: {_id: -1},//moves item to bottom of list
        upsert: false//prevents insertion if item does not exist
    })
    .then(result => {//starts if succesful
        console.log('Marked Complete')//console log successful completion
        response.json('Marked Complete')//send response to sender
    })//close .then
    .catch(error => console.error(error))//catches errors

})//ending put

app.delete('/deleteItem', (request, response) => {//starts delete method when deleteItem is passed
    //Selects and deletes an item from database
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//look in database for one item matching the name of item passed from main.js
    .then(result => {//starts if succesful
        console.log('Todo Deleted')//console log successful completion
        response.json('Todo Deleted')//send response to sender
    })//close .then
    .catch(error => console.error(error))//catches errors

})//end delete

app.listen(process.env.PORT || PORT, ()=>{//setting up which port we will be listening on
    console.log(`Server running on port ${PORT}`)//console log the running port
})//end listen 