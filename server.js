// import express so we can create our express app
const bodyParser = require('body-parser')
const express = require('express')
// this is actually creating the express app
const app = express()
// this is importing the mongodb database
const MongoClient = require('mongodb').MongoClient
// this is the port our server will be running on
const PORT = 2121
// this is how we access the info that's inside of the .env file
require('dotenv').config()


// these are the db related variables
let db,//this is just declaring our db (not assigning it yet)
    dbConnectionStr = process.env.DB_STRING,//this is grabbing the connection string from the .env file
    dbName = 'todo'//here we are just naming our database, so in mongo our db will show as 'todo'

// here we are actually making the connection to the mongo client
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//the connect method takes in the connection string and some more optional stuff to avoid deprecated warnings
// MongoClient returns a promise so we can use .then and .catch
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)//here we are finally assigning our db a value
    })

//here we are saying that we are using ejs as a template engine 
app.set('view engine', 'ejs')
// this middleware allows our server to render files inside of the public folder
app.use(express.static('public'))
// this parses incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: true }))
// this parses incoming requests with json payloads
app.use(express.json())
app.use(bodyParser.json())

// this is making a GET (READ) request when the root route is hit. Basically when you refresh the browser or go to your localhost:portNumber it executes the code inside of it.
app.get('/',async (request, response)=>{ //'/' is the root route, and then we have an async callback
    // since the function is async we are awaiting a few things
    // first we are FINDING all of the todo items from the todos collection, and then we are turning it into a array of objects and then storing it inside of the todoItems variable
    const todoItems = await db.collection('todos').find().toArray()
    // we are looking at the todos db and counting the amount of documents that has not been marked completed so we can display that count in the 'left to do' part of the ui
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // we are rendering the index.ejs file and passing in the todoItems and itemsLeft that we got from the collection above
    // now when we want to access the todoItems in our ejs we use the 'items' key and 'left' key to access itemsLeft
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

// this is making a POST (CREATE) request when the '/addTodo' route is hit.In the ejs, the form has a action of /addTodo, so when that form is submitted it hits this route. 
app.post('/addTodo', (request, response) => { // the request gets the requested information that was requested by the user and the response responds to what the user requested

    // this is grabbing the todos collection and inserting the info that was submitted through the form 
    //the name of the field in the form that got submitted was todoItem so here when using the insertOne method we need to pass in a object. here its named thing (couldve been anything) for the key and for the value we grab what came in when the form was submitted the request.body have todoItem
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log(request.body)
        console.log('Todo Added')
        response.redirect('/')// once the item gets inserted then we want to redirect back to the root route to get a updated list of items
    })
    .catch(error => console.error(error))//if there is an error , catch it 
})

// this is making a PUT (UPDATE) request when the '/markCompleted' route is hit. 
app.put('/markComplete', (request, response) => {
    // this is grabbing the todos collection and updating the the item from our client side js file which is making a fetch request and then we are making the update to set completed to true
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1}, // this is just sorting the ids of the items in descending order
        upsert: false 
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// this is performing a PUT (UPDATE) request when the '/markUncomplete' endpoint is hit
app.put('/markUnComplete', (request, response) => {
    // we are grabbing the todos collection and updating the item that is coming from the js fetch operation
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

// this is performing a DELETE (DELETE) request when the '/deleteItem' endpoint is hit
app.delete('/deleteItem', (request, response) => {
    //we are grabbing the todos collection and using the deleteOne method to delete the item that is coming from the js fetch operation
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})
// here is how our app listens for the server. its either going to listen on the port we provided or the port that the platform we are deploying to is providing
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})