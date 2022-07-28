const express = require('express')//making it possible to use express in this file 
const app = express() //setting a variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient //setting a variable called mongoclient that allows us to speak to our database by using methods associated with Mongo
const PORT = 2121 //setting variable to determine the location where our server will be listening
require('dotenv').config()//allows us to look for variables inside of the .env file


let db, //declaring a variable called db but not assign a value // declared globally but not assigning it so we can use it in multiple places
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning it to our connection string 
    dbName = 'todo'//declaring a variable and assigning the name of the database we will be using //Cluster - Database - Collection - Document 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to MongoDB and passing in our connection string. Also passing in an additional property 
    .then(client => {//waiting for the connection and proceeding if successful and also passing in all the client information
        console.log(`Connected to ${dbName} Database`) //log to the console a template literal 'connected to todo database'
        db = client.db(dbName)//assignig a value to a previously declared db variable that contains a db client factory method
    })//close out our .then
    
//Middleware
app.set('view engine', 'ejs')//sets ejs as the default render method
app.use(express.static('public'))//sets the location for statis assets
app.use(express.urlencoded({ extended: true }))//tells express to decode and encode urls where the header matches the content. supports arrays and objects
app.use(express.json())//parses JSON content from incoming requests


app.get('/',async (request, response)=>{//starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray()//sets a variable and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//rendering the ejs file and passing through the db items and the count remaining inside of an object 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    //.catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {//starts a POST method when the add route is passed in 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//inserts a new item into todos collection, gives it a completed value of false by default
    .then(result => {//if insert is successful, do something
        console.log('Todo Added')//console log action
        response.redirect('/')//gets rid of the /addTodo route, and redirects back to the route
    })//closint the .then
    .catch(error => console.error(error))//catching errors
})//ending the POST

app.put('/markComplete', (request, response) => {//starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look for in the db for one item matching the name of the item passed in from the main.js file that was clicked on. 
        $set: {//
            completed: true //set completed status to true
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starting a then if update was successful 
        console.log('Marked Complete') //logging successful completion
        response.json('Marked Complete')//sending a response back to the sender 
    })//closing our .then
    .catch(error => console.error(error))//catching errors

})//ending our PUT

app.put('/markUnComplete', (request, response) => { //Starts a PUT method when the markedUncomplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look for in the db for one item matching the name of the item passed in from the main.js file that was clicked on.
        $set: {
            completed: false//set completed status to false
          }
    },{
        sort: {_id: -1},//moves item to the bottom of the list
        upsert: false//prevents insertion if item does not already exist
    })
    .then(result => {//starts a .then if update was successful
        console.log('Marked Complete')//logging successful completion
        response.json('Marked Complete')//sending a response back to the sender 
    })//closing .then
    .catch(error => console.error(error))//catching errors

})//ending PUT

app.delete('/deleteItem', (request, response) => { //starts a delete method when the deleteItem route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//look inside the todos colelction for the ONE item that has a matching name from our JS file
    .then(result => {//start a .then if delete was successful
        console.log('Todo Deleted')//console log the results
        response.json('Todo Deleted')//send response back to sender
    })//close our .then
    .catch(error => console.error(error))//catch our errors

})//ending delete

app.listen(process.env.PORT || PORT, ()=>{//specifying which port we will be listening on - gets the one out of the .env file or the port variable
    console.log(`Server running on port ${PORT}`) //console.log the running port
})//closing the listen