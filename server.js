// requiring frameworks and packages to initualize the app including express, mongodb ERM, 
const express = require('express')
//initialize express library and saving it in app variable
const app = express()
//initialize mongodb library and save it in MongoClient
const MongoClient = require('mongodb').MongoClient
//port variable is declared
const PORT = 2121
//require dotenv
require('dotenv').config()

//declare db, dbConnectionStr for DB_STRING process variable
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

    // MongoClient connecting to database using above variables. this will return a promise and once its connected run console.log
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
//configuring ejs
app.set('view engine', 'ejs')
//configuring public folder
app.use(express.static('public'))
//express encodes and decodes URLs
app.use(express.urlencoded({ extended: true }))
//use JSON
app.use(express.json())


// any get requests on the / or base url will be processed in this middleware
app.get('/',async (request, response)=>{
    //using an async function a find() request is being made in the collection todos and is 
    const todoItems = await db.collection('todos').find().toArray()
    //request another query to count the not-complete documents and return the count
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

// middleware handles functio/addTodo
app.post('/addTodo', (request, response) => {
    //add the form data to the document collection 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        //then if promise is fulfulled console log the output
        console.log('Todo Added')
        //redirect to main url
        response.redirect('/')
    })
    //if there's an error in the function console log it.
    .catch(error => console.error(error))
})

// listen to the stated url with the put request on the end point then run the middleware function to change database entry to compelete task
app.put('/markComplete', (request, response) => {
    //make a put update request  for the requestbody item  and update it
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{ //sort array with desending order and 
        sort: {_id: -1},
        upsert: false
    })  
    .then(result => { //then console log the output
        console.log('Marked Complete')
        response.json('Marked Complete')
    })//show error if there's one
    .catch(error => console.error(error))

})
//declare endpoint for /markUncomplete route and run the middleware
app.put('/markUnComplete', (request, response) => {

    //send a updateOne requset with the id of todo entry. then set completed to false and sort by id 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
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
//declare endpoint for url /delete item then run the middleawre
app.delete('/deleteItem', (request, response) => {
//find document that was clicked on and use the delete method. and log the success  or error
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})
//use Express to start a server using process variable PORT or PORT variable 
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})