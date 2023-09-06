const express = require('express')
//give server access to express
const app = express()
//save express as variable app
const MongoClient = require('mongodb').MongoClient
//give server permission to talk to mongodb
const PORT = 2121
//set default listening port to 2121
require('dotenv').config()
//allow environment variables to run & needed for connection between server/hosting site and database 


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
//save monogodb connection url to the string for connection between server and database
//name of database/collection is todo 
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
//connect server to mongodb of todo collection 
    
app.set('view engine', 'ejs')
//tell the server the templating language is ejs 
app.use(express.static('public'))
//any static file request shoudld be directed to the public folder for the response of such file 
app.use(express.urlencoded({ extended: true }))
//replacement for body parser, allows server to grab important values out of request object body 
app.use(express.json())
//allows server to use express


app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
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

//get request at the default route
//wait for the database collection of todos and grab all the documents and store the document (objects) in an array and save that array to variable todoItems
//then wait for the number of documents that have a property of completed and property value of false
//then take the data of an object with the array of todoItems documents and the number of itemsLeft and put it into templating language ejs. to render out html and respond with html

//nested callbacks
//go to the database collection of todos and get every document inside into an array
//from that array, count all the documents that have a property of completed and property value of false
//then reponse with an html rendering of eje with the data that is has received in object format of the array and the number of itemsLeft. 
//run a catch error with console.log(error) if anything goes wrong 

app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//post/create request for a task to complete
//go to database in collection of todos, insert one document with a property of thing and property value of the task of the to do item and also a completed property of false
//then console.log todo added and respond with a server side refresh 
//if any errors console.log the error 


app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})
//put or update request to mark complete
//go to the database with collection of todos and update completed property to be true for the document that has the same property value in thing property as the itemFromJS property does from the request body.
//if there are multiple documents that match the property value of itemFromJS order the documents in descending order and choose the first one that matches
//if there are none that match the property value from the itemFromJS property, create a new document with that property value in thing 
//then console.log marked completed
//respond with json that the mark completed
//if any errors console.log the error 

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked UnComplete')
        response.json('Marked UnComplete')
    })
    .catch(error => console.error(error))

})
//put or update request to mark uncomplete
//go to the database with collection of todos and update the completed property to be false for the document that has the same property value in thing property as the itemFromJS property does from the request body.
//if there are multiple documents that match the property value of itemFromJS order the documents in descending order and choose the first one that matches
//if there are none that match the property value from the itemFromJS property, create a new document with that property value in thing 
//then console.log marked Uncompleted
//respond with json that the mark Uncompleted
//if any errors console.log the error 

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})
//delete request to delete to do item
//go to the database with collection of todos and delete the document that has the same property value in thing property as the itemFromJS property does from the request body.
//then console.log todo deleted
//respond with json that the mark was deleted
//if any errors console.log the error 


app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
//tells the server to listen to whatever port the hosting environment is requiring or if there is no such port listen to port 2121 assigned at the beginning and console.log that the specific port that is listening