const express = require('express') //import express, save into const
const app = express() //create express application
const MongoClient = require('mongodb').MongoClient // import mongoclient from mongodb
const PORT = 2121 //set port to 2121
require('dotenv').config() //import .env for environment variables


let db, //declare db variable
    dbConnectionStr = process.env.DB_STRING, //grab db string from env file, save into variable
    dbName = 'todo' //set dbname to 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//connect to mongodb
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) //change dbname
    })
    
app.set('view engine', 'ejs') //set view to ejs
app.use(express.static('public')) //middleware - allow files in public folder to be accessible by all
app.use(express.urlencoded({ extended: true })) //middleware - to recognize incoming request object as strings/arrays
app.use(express.json()) //middleware - parses json requests


app.get('/',async (request, response)=>{ //get request on root route
    //wait till promise settles, go through 'todos' collection in mongodb, find it, and convert this collection to array
    const todoItems = await db.collection('todos').find().toArray() 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //count amount of docs in collection
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //render an object to index.ejs
    db.collection('todos').find().toArray()
    .then(data => {
        db.collection('todos').countDocuments({completed: false})
        .then(itemsLeft => {
            response.render('index.ejs', { items: data, left: itemsLeft })
        })
    })
    .catch(error => console.error(error)) //catch error
})

app.post('/addTodo', (request, response) => { //post request on 'addTodo' route
    //insert a document in 'todos' collection, taking from form 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/') //redirect to root route(refresh page)
    })
    .catch(error => console.error(error)) //catch error
})

app.put('/markComplete', (request, response) => { //put request to 'markComplete' route
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //find first document that matches filter, applies updates set below
        $set: {
            completed: true //replace current value of field with new value
          }
    },{
        sort: {_id: -1}, //descending order sort
        upsert: false // do not upload and insert if not present
    })
    .then(result => {
        console.log('Marked Complete') //log 
        response.json('Marked Complete')  //send response json
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => { //put request to 'markUnComplete' route
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //mostly same as above
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

app.delete('/deleteItem', (request, response) => { //delete request to 'deleteItem' route
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //find first document that matches filter, deletes document
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{ //bind and listen connections to port, set in .env file
    console.log(`Server running on port ${PORT}`)
})