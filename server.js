const express = require('express')  //import express module
const app = express() //run express and set up variable for express
const MongoClient = require('mongodb').MongoClient  //import mongoClient
const PORT = 2121  //Set up port for listen()
require('dotenv').config() //require dotenv and call .config so we can store our DBSTRING and details in an .env file.

// Initialize the db variable
let db,
    dbConnectionStr = process.env.DB_STRING, //save connection string from .env file 
    dbName = 'todo' //specify name of mongodb db. 


//Call the connect method to connect to db. 
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) 
    })
//set up EJS templating engine for page rendering.    
app.set('view engine', 'ejs')

//set up public folder where we can store files which will be accessible to express and public.
app.use(express.static('public'))
//Express can encode/decode query parameters in get/post etc requests. 
app.use(express.urlencoded({ extended: true }))
// tells express to use json. 
app.use(express.json())

//Set up route to main page / root document. GET Handler for '/'
app.get('/',async (request, response)=>{  //async request to db. 
    const todoItems = await db.collection('todos').find().toArray() //find all items in todo and return as an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //count items in collection return count. 
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //inject items and items left into ejs template. 
	
	//Leon's comments
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})


//Set up handler for POST to /addTodo. Used when we add a new todo item. 
app.post('/addTodo', (request, response) => {
	//connect todo collection, and insert one item. Which was sent by the html/js form. 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added') //promise resolved, log to confirm 
        response.redirect('/') //redirect back to /, which will cause new item to be rendered in ejs. 
    })
    .catch(error => console.error(error)) //error handling if req fails.
})


// PUT handler for /markComplete route
app.put('/markComplete', (request, response) => {
	//Find an existing to do item using 'thing' from request body and
	//mark it as complete. The second argument to the updateOne method tells 
	//MongoDB to sort by the largest ID and to not add a new document if one already exists. 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true  //mark the status as true in the items status field. 
          }
    },{
        sort: {_id: -1}, //sort by oldest first
        upsert: false //With the upsert option set to true, if no matching documents exist for the Bulk.find() condition, then the update or the replacement operation performs an insert. If a matching document does exist, then the update or replacement operation performs the specified update or replacement.
    })// Promise resolved, log it and return json to client. 
    .then(result => {
        console.log('Marked Complete') //promise resolved -> console.log confirmation
        response.json('Marked Complete') //promise resolved -> send back to front end js that item was complete.
    }) //promise is rejected, log error. 
    .catch(error => console.error(error))

})
//Find an existing to do item using 'thing' from request body and
	//mark it as not complete. The second argument to the updateOne method tells 
	//MongoDB to sort by the largets ID and to not add a new document if one already exists. 

//Responding to update request which will be a PUT request.
app.put('/markUnComplete', (request, response) => {
	//Connecting to dob collection todos, and updating item with content in request.body
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false //Mark item status  as not complete. 
          }
    },{
        sort: {_id: -1}, //sort oldest to newest. 
        upsert: false  
		//With the upsert option set to true, if no matching documents exist for the Bulk.find() condition, then the update or the replacement operation performs an insert. If a matching document does exist, then the update or replacement operation performs the specified update or replacement.
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})
// Respond to delete response 
app.delete('/deleteItem', (request, response) => {
	
	//locate item in todos, and delete matching item with DeleteOne
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => { 
		//promise resolved  - console log and return status to calling front end JS
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))  //promise fails -> console.log err

})
// setting up listening port. If you are you are in an hosted enviornment
//use port provided by process.env. If that does not exist, use PORT decalared above. 
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)  //Message to user we have connected. 
})