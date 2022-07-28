const express = require('express') //make it possible to use express in this file
const app = express() //setting constant  and assigning it to express
const MongoClient = require('mongodb').MongoClient //makes it possible to use methods associated with Mongo Client and talk to our database
const PORT = 2121 //setting constant to determine location where our server will be listening
require('dotenv').config() //allows us to look for variables inside of the .env file


let db, //declare a variable call db, no assigning of value (declare db as global variable)
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigining our database connection string to it
    dbName = 'todo' //declaring a variable  and assigning the name of the databse we will be using 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Creating a connection to MongoDB and passing in our connection string, also passing in an additional property
    .then(client => { //waiting for connection and proceed if succesful, and pass in client information
        console.log(`Connected to ${dbName} Database`) //log to the console a template literal "connected to todo database"
        db = client.db(dbName) //assigning a value to previously declare db variable that contains a db client factory method
    }) //closing our .then


//middleware - open communication channels for our requests
app.set('view engine', 'ejs') //sets ejs as the default render
app.use(express.static('public')) //sets the location for static assets
app.use(express.urlencoded({ extended: true }))//Tells express to decode and encode URL's where header matches the content
app.use(express.json()) //Parses JSON content from incoming requests


app.get('/',async (request, response)=>{  //starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable and awaits a counnt of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //render the EJS file and passing through the DB items and the count remaining inside of an object
    //clasic promise version of above
    // db.collection('todos').find().toArray() 
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //starts a Post method when the add route is passed in from the form in EJS file
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})  //inserts a new item into todos collection gives it a completed value of false by default
    .then(result => { //if insert is succesful, do something
        console.log('Todo Added') // console log what happened
        response.redirect('/') // gets rid of the /addTodo route, and redirects back to the homepage (a refresh)
    }) //closing the .then
    .catch(error => console.error(error)) //catching errors
}) //ending the Post

app.put('/markComplete', (request, response) => { //starts a Put method when the add route is passed in from the form in EJS file
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//(USE ID VALUE IN FUTURE INSTEAD OF thing, as you will run into issues with duplicates) look in the db for one item matching the name of the item passed in from the main.js that was clicked on
        $set: { //
            completed: true //set completed status to true
          }
    },{
        sort: {_id: -1},//moving item to the bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts a then if update is successful
        console.log('Marked Complete') //console log successful completion
        response.json('Marked Complete')//gets sent back to main.js(line 47) in a variable called data  
    })//closing .then
    .catch(error => console.error(error)) //catch error

})//ending Put

app.put('/markUnComplete', (request, response) => { //starts a Put method when the add route is passed in from the form in EJS file
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //(USE ID VALUE IN FUTURE INSTEAD OF thing, as you will run into issues with duplicates) look in the db for one item matching the name of the item passed in from the main.js that was clicked on
        $set: {
            completed: false //set completed status of item to false
          }
    },{
        sort: {_id: -1},//moving item to the bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts a then if update is successful
        console.log('Marked Complete') //console log successful completion
        response.json('Marked Complete')//sending a response back to the sender
    })//close .then
    .catch(error => console.error(error))//catch error

})//ending Delete

app.delete('/deleteItem', (request, response) => { //starts a delete method when the delete route is passed in from the form in EJS file
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //look inside the todos collection for the ONE item that has a mathcing name from our JS file
    .then(result => {//starts a then if update is successful
        console.log('Todo Deleted')//console log successful completion
        response.json('Todo Deleted')//sending a response back to the sender
    })
    .catch(error => console.error(error))//catch error

})

app.listen(process.env.PORT || PORT, ()=>{ //setup which port we will listen on - either the port from the .env file or the port variable we set
    console.log(`Server running on port ${PORT}`)//console log the running port with a template literal
})//end the listen method