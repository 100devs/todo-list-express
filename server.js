const express = require('express')
//declare a variable that requires the express 
const app = express()
//delcare a variable that holds the express module for ease of use later
const MongoClient = require('mongodb').MongoClient
//declaring and assigning the Mongo node.js package to a variable 
const PORT = 2121
//Assinging a number that will be act as our localhost port 
require('dotenv').config()
//require and configure the dotenv function to provide access to the hidden environment variables  


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
    //declare a set of variables that will be used for our connection to our database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    //MongoClient.connect() is an async function call takes dbConnectionStr as an argument to access the right database
    .then(client => {
    //.then() is called after the async function; 
        console.log(`Connected to ${dbName} Database`)
        //We are connected!
        db = client.db(dbName)
        //client contains the connection credentials, which contains the giant db object/collections
    })
    

 //declaring middleware    
app.set('view engine', 'ejs')
//Tells express we are going to be using EJS, and at this point we would create a views folder for the index.ejs
app.use(express.static('public'))
//tells express to look in a 'public' for HTML, CSS, JS
app.use(express.urlencoded({ extended: true }))
//Makes URL handling easier
app.use(express.json())
//makes syre tgat responses are in json format

//CRUD METHODS

//Read Method (READ THE TODO LIST)
app.get('/', async (request, response)=>{
    //when you have a request at the root, call this async callback
    const todoItems = await db.collection('todos').find().toArray()
    // declaring a variable that fetches the 'todos' collection from our db; .find() returns ALL (when no params) in the collection , and then put's it all in an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //countDocuments is a mongodb module which counts the objects in the 'todos' collection, in this case we are only adding them if they are 'false'(counts the documents in the collection that are not completed)
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //tells express to render the response as EJS


    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error)) 
})

//POST 
//CREATE (ADD AN ITEM TO THE TODO LIST)
app.post('/addTodo', (request, response) => {
    //a request at the 'addTodo' path, fires this callback (express methods are promise based)
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // grabs the 'todos' collection and adds the users request to a document in the collection 
    .then(result => { //the .then fires after the 
        console.log('Todo Added')
        response.redirect('/')
        //refreshes/redirects back to the root
    })
    .catch(error => console.error(error))
    //error handler if there is an issue
})

//updating the item to be completed (setting)
//this update request runs with the URL path '/markComplete'
app.put('/markComplete', (request, response) => {
    //we take the itemText from the main.js and set that to ???
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //selecting our item
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1}, //sort the collection by ID, from most recent(?)
        upsert: false //mongo stuff (does not upsert in this case)
    })
    .then(result => {
        console.log('Marked Complete') //logs in the terminal
        response.json('Marked Complete') //json object is viewable to the client
    })
    .catch(error => console.error(error))  //error handling

})

//updating an item to be 'incomplete'
app.put('/markUnComplete', (request, response) => {
    //when the path change to ^that....
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //..we take out the 'todos' collection from our database, and update that ^
        $set: {
            completed: false
          }
          //.. the 'completed' property in the target document is set to false 
    },{
        sort: {_id: -1},
        upsert: false
        //mong stuff
    })
    .then(result => {
        console.log('Marked Un-omplete')
        response.json('Marked Un-Complete')
    })
    .catch(error => console.error(error))
    //error handling 

})

//DELETE request, fires the callback that tells mongo to look for the item in the request body
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//.listen is the express module that tells the server which port to listen too
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})