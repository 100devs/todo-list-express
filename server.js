//import express library, setting the result to the express variable
const express = require('express')

//execute the 'express' function, saving it's result to the 'app' variable
const app = express()

//import the MongoClient from the mongodb library, setting it's result as the MongoClient variable
const MongoClient = require('mongodb').MongoClient

//declare a variable named PORT with the value of '2121'
const PORT = 2121

//import the dotenv libary and call it's config function
require('dotenv').config()

//declare a variable named db
let db,
//declare a variable named dbConnectionStr whose value is the value of DB_STRING environment variable
    dbConnectionStr = process.env.DB_STRING,
//declare a variable named dbName with the value todo, this is the MongoDB database we will store values into
    dbName = 'todo'

//call the mongoclient connect method to connect to our MongoDB database. the useUnifiedTopology option uses the unified topology lair, which is an additional property we are passing through
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        //log the connected database
        console.log(`Connected to ${dbName} Database`)
        //tell the MongoClient to use the dbName database. store the returned db class in the db variable
        db = client.db(dbName)
    })
    
//set the express application view engine setting to use ejs as its rendering engine
app.set('view engine', 'ejs')
//set the expres application to server static files from the public directory
app.use(express.static('public'))
//tell the application to automatically parse urlcoded payload
app.use(express.urlencoded({ extended: true }))
//tell the express application to automatically parse JSON payloads and make that available in the request body
app.use(express.json())

//listen for the HTTP GET request on the base level '/' route and execute the handler
app.get('/',async (request, response)=>{

    //find all documents in the todos collection and return them as an array. store the result in the todoItems variable. since a promise is returned, we await for for the promise to resolve (or reject)
    const todoItems = await db.collection('todos').find().toArray()

    //count the number of documents in the todos collection where the completed field is false. store the result in the itemsLeft variable. since a promise is returned, we await.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})

    //render the index.ejs file with the passed in todo items. response to the client with the rendered content, or the count of the itemsLeft variables.
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



app.post('/addTodo', (request, response) => {   //listen for HTTP POST requests on the 'addTodo' line 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})  //inserts a new item into the 'todos' collection, and gives it a completed value of false by default
    .then(result => {   //if insertion of new item is successful, do something
        console.log('Todo Added')   //display console log of verified todo task
        response.redirect('/')  //redirects to root home page after console log fires
    })  //closing the .then
    .catch(error => console.error(error))   //catch function to catch errors
})  //ending the POST

//
app.put('/markComplete', (request, response) => {   //starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: true //set completed status to true  
          }
    },{
        sort: {_id: -1},    //moves item to the bottom of the list
        upsert: false   //prevents insertion if item does not exist
    })
    .then(result => {   //starts a then if item does not complete
        console.log('Marked Complete')  //console log to mark item as being succesfully complete
        response.json('Marked Complete')    //sending a response back to the sender
    })  //closing. then
    .catch(error => console.error(error))   //catching errors

})

app.put('/markUnComplete', (request, response) => { //starts a PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false    //set completed status to false
          }
    },{
        sort: {_id: -1},    //moves item to the bottom of the list
        upsert: false   //prevents insertion if item does not already exist
    })
    .then(result => {   //starts a then if update was successful
        console.log('Marked Complete')  //console log to mark item as being succesfully complete
        response.json('Marked Complete')    //sending a response back to the sender 
    })  //closing the .then
    .catch(error => console.error(error))   //catch to catch potential errors

})  //ending put

app.delete('/deleteItem', (request, response) => {  //starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})  //look in the todos collection for the one item that has a matching name from our JS file
    .then(result => {   //starts a .then if delete was successful
        console.log('Todo Deleted') //console logging the todo list item as being succesfully deleted
        response.json('Todo Deleted')   //sending a todo deleted response back to the sender
    })  //closing the .then
    .catch(error => console.error(error))   //catch to failsafe against errors

})  //ending delete

app.listen(process.env.PORT || PORT, ()=>{  //setting up which PORT we'll be listening in at - either the PORT from the .env file or the PORT variable that we set
    console.log(`Server running on port ${PORT}`)   //console log showing successful connection to the running PORT
})