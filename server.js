//Tells web app that it will be using the express library and framework
const express = require('express')
//Created variable so wherever we write app it is telling the computer to use express
const app = express()
//connects the app to our Mongodb database
const MongoClient = require('mongodb').MongoClient
//Use variable port for our local server
const PORT = 2121
//
require('dotenv').config()

//Connects database
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
 
//Middleware
//Tells our app to use ejs file to render HTML to the cient
app.set('view engine', 'ejs')
//Tells app to find static files in the public folder
app.use(express.static('public'))
//Tells app to use express framework
app.use(express.urlencoded({ extended: true }))
//Tells app to use the express package
app.use(express.json())

//READ - initiates a get request, when the client refreshes page
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray() //Goes into collection called 'todos' and finds all the documents and makes it into an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //also finds how many items have the completed property set as false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //Sends the array of objects to the ejs file so it can render the HTML file
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//CREATE - post request to add item to ToDo list
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts new object as a document in our database. Takes the name of the thing from the body of the request sent from the form, hard codes the item to false for the completed property
    .then(result => {
        console.log('Todo Added')
        response.redirect('/') //console logs item completed, client only sees change because of the redirect and iniates a get request
    })
    .catch(error => console.error(error)) //error message
})


//UPDATE - put request for when a item is marked complete
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          } //goes to todo collection update one document, which is taken from the request body, then sets the completed property to true
    },{
        sort: {_id: -1},//moves item to the bottom of the list
        upsert: false //prevents insertion if the item doesn't already exist
    })
    .then(result => {
        console.log('Marked Complete') 
        response.json('Marked Complete') //marks action complete
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false //put request that will make a completed task toggle to incomplete task
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertion if the item doesn't already exist
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//DELETE - request to delete an item
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => { //goes to the todo collection, takes the name of the thing from the request body, deletes that document at mateches
        console.log('Todo Deleted')
        response.json('Todo Deleted') //Shows the deletion is complete
    })
    .catch(error => console.error(error))

})

//Sets up our server. either using Heroku port or local host port
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})