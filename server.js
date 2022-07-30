const express = require('express') //make it possible to use express in this file
const app = express() // setting a variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient //make it possible to use method associated with mongoclient and talk to our db
const PORT = 2121 //setting a constant to define the location where our server will be listening
require('dotenv').config() //allows us to use contents of our .env file


let db, // declaring a variable called db but not assign a value. declaring db like this so we can use it globally
    dbConnectionStr = process.env.DB_STRING, //telling express to get our authentication string from .env file and assign it to a variable
    dbName = 'test-to-do-list' //declare a variable and assigning the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to mongodb, and passing our connection string, also passing in an additional property
    .then(client => { // waiting for connection and proceeding if sucessful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`) //console logging the dbName we are connected to via a template literal
        db = client.db(dbName) // assigning a value to previously declared db variable that contains a db client factory method
    }) //closing our .then
    
    //middlewar
app.set('view engine', 'ejs') //sets ejs as the default render method
app.use(express.static('public')) // tells our app to use a folder called public for all our static files like css or images
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode urls where the header matches the content. supports arrays and objs
app.use(express.json()) //parses json content


app.get('/',async (request, response)=>{ // starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and waits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable that awaits the number of documents that have a property of completed:false that will later display in ejs
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // rendering our index.ejs and passing through the db items and the count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //start a POST method when the root of /addToDo is passed in. sets up req and res params
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // go into the database collection, insert one. we are going to pass in an object which is a thing, with a todoItem, followed by a seperate property that we add on called completed that represents if the to do item is completed or not. when first created, the to do item won't be completed
    .then(result => { //promise syntax. if sucessful, run something 
        // consolelog that an item was added then refresh with redirect
        console.log('Todo Added')
        response.redirect('/') //refreshing to the read request so we can update the ejs so we can see the changes. also gets rid of the /addtodo route
    })
    .catch(error => console.error(error)) //if error, pass in the error to catch and consolelog it
})


app.put('/markComplete', (request, response) => { // start a UPDATE request when the root of /markComplete is passed in. sets up req and res params
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // go into the collection, update an item that has the body of itemFomJS from main js 
        $set: {
            completed: true //go into object, and set completed to do item to true or completed
          }
    },{
        sort: {_id: -1}, // moves item to bottom of list
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => { // starts a then if update was successful
        // mark item as complete
        console.log('Marked Complete') //console logging sucessful completion
        response.json('Marked Complete') //this is what is going back to our fetch in mainjs
    })
    .catch(error => console.error(error)) // catching errors

}) //end put request

app.put('/markUnComplete', (request, response) => { //update to set as uncompleted
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //go into the collection, update one thing and set completed to false since its no longer completed
        $set: {
            completed: false //set one thing from the database and switch completed to false
          }
    },{
        sort: {_id: -1}, //sort item to bottom of list
        upsert: false // prevents insertion if item does not exist
    })
    .then(result => {
        //console log marked uncomplete
        console.log('Marked Complete')
        response.json('Marked Complete') //this is what is going back to our fetch in mainjs
    })
    .catch(error => console.error(error)) //error handling

}) //close put request 

app.delete('/deleteItem', (request, response) => { //deletay request
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //go into the collection, delete one thing getting the itemfromjs from mainjs
    .then(result => { //if above code suceedes...
        console.log('Todo Deleted')
        response.json('Todo Deleted') //this is what is going back to our fetch in mainjs to consolelog todo deleted
    })
    .catch(error => console.error(error)) //error handling

}) //end deletay request

//listen for a heroku port, or a local port

app.listen(process.env.PORT || PORT, ()=>{ //setting up which port will be listened to. either port from env file or our global port variable
    console.log(`Server running on port ${PORT}`) //console log if port is successfully running via template literal
}) //close app.listen