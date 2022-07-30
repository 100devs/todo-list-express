//imports express after installing it from npm
const express = require('express')
//creates app variable that lets us use the express methods
const app = express()
//imports mongodb to be able to connect our program ot our database
const MongoClient = require('mongodb').MongoClient
//variable to hold the port number
const PORT = 2121
//lets us be able to use dotenv to be able to hide info from other users
require('dotenv').config()

//creates db to be able to do operations on the database
let db,
//holds the connection string from the hidden .env file
    dbConnectionStr = process.env.DB_STRING,
    //holds the database name
    dbName = 'todo'

//function to connect database to the program. returns a promise
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        //console logs that the connection succeeded
        console.log(`Connected to ${dbName} Database`)
        //assigns the database name to the variable db
        db = client.db(dbName)
    })
//sets the templating language to ejs
app.set('view engine', 'ejs')
//lets the server serve static files like css and server side js
app.use(express.static('public'))
//these two lines make express be able to read incoming data like from forms
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//the GET route for the homepage
app.get('/',async (request, response)=>{
    //retrieves all the documents from the database and stores it in the variable as an array
    const todoItems = await db.collection('todos').find().toArray()
    //counts all the documents in the db that have the completed property set to false and stores it in the variable
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //server responds with ejs and sends it the two above variables
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

//route for the post for creating a new task
app.post('/addTodo', (request, response) => {
    //creates a new document with the thing and completed properties
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        //if the insertion is successful then its console logged
        console.log('Todo Added')
        //and the server redirects the user to the homepage
        response.redirect('/')
    })
    //if it fails then it is console logged
    .catch(error => console.error(error))
})

//PUT route for marking a task as completed
app.put('/markComplete', (request, response) => {
    //first finds the document in the database that matches 'request.body.itemFromJS', then takes that item and sets the completed property to true
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        //the 3rd argument is for the options for the findOneAndUpdate method which sorts and sets upsert to false
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        //if update is successful then it is logged
        console.log('Marked Complete')
        //and the server sends json with the message
        response.json('Marked Complete')
    })
    //if it fails then the console logs the error
    .catch(error => console.error(error))

})

//other PUT route for un-completing something
app.put('/markUnComplete', (request, response) => {
    //finds the document that matches the js
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            //sets the value of that item to false
            completed: false
          }
    },{
        //sorts the documents by id in descending order
        sort: {_id: -1},
        //sets upsert to false
        upsert: false
    })
    .then(result => {
        //console logs and json sends message that the marked was completed
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //logs the error
    .catch(error => console.error(error))

})

//route for deleting a task
app.delete('/deleteItem', (request, response) => {
    //deleteOne operation finds the specified document and deletes it from the database
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        //if its successful then it sends a message
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    //if fails then logs the error
    .catch(error => console.error(error))

})
//starts the express server on the specified port
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})