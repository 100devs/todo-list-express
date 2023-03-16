const express = require('express') // making it possible to use express in this file
const app = express() //setting a variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient //make it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 //setting a constant to deteremine the location where our server will be listening
require('dotenv').config() //allows us to look for variables inside of the .env file


let db, //declare a global variable called db but not assign a value
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our database string to it
    dbName = 'todo' //declaring a variable and assigning a name to the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })// creating a connection to mongoDB and passing in our connection string. also passing in an additional property 
    .then(client => { // waiting for the conenction and proceeding if successful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`) //log to the coneole a template literal "conencted to todo database"
        db = client.db(dbName) //assinging a value to previously declared db variable that contains a db client factory method 
    }) //closing our .then
    
/**************************middleware**************************/    
app.set('view engine', 'ejs') //sets ejs as the default render method
app.use(express.static('public')) //set the location static assets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URLs where the header matches the content. supports arrays and objects
app.use(express.json()) //parses JSON content from incoming requests


app.get('/',async (request, response)=>{ //starts a GET method when the root route is passed in sets up req ansd res parameters
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable and awaits a count of uncompleted items to later display in ejs
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering th eejs and passing through the db items and the count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})//closes get

app.post('/addTodo', (request, response) => { //starts a POST method when the add route is passed in 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item into the todos collection, gives it a completed value of false by default
    .then(result => { //if insert is successful, do something
        console.log('Todo Added') //concole log action
        response.redirect('/') //gets rid of the addToDo route and redirects back to the homepage
    }) // closes .then
    .catch(error => console.error(error)) //catching errors
}) //ending the POST

app.put('/markComplete', (request, response) => { //starts a PUT method when the markComplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the database for one item matching the name of the item passed in from the main.js file that was clicked on  
        $set: { 
            completed: true //set completed status to true
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts a then if update was succesful
        console.log('Marked Complete') //logging successful completion
        response.json('Marked Complete') //sending a response back to the sender
    }) //closing .then
    .catch(error => console.error(error)) //catching errors

}) //closing our PUT

app.put('/markUnComplete', (request, response) => { //starts a PUT method when the markUnComplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the database for one item matching the name of the item passed in from the main.js file that was clicked on  
        $set: {
            completed: false //set completed status to false
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts a then if update was succesful
        console.log('Marked Complete') //logging successful completion
        response.json('Marked Complete') //sending a response back to the sender
    }) //closing .then
    .catch(error => console.error(error)) //catching errors

}) //closing our PUT

app.delete('/deleteItem', (request, response) => { //starts a Delete method when the deleteItem route is passed in 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //look in the database for one item matching the name of the item passed in from the main.js file that was clicked on  
    .then(result => { //starts a then if update was succesful
        console.log('Todo Deleted') //logging successful completion
        response.json('Todo Deleted') //sending a response back to the sender
    }) //closing .then
    .catch(error => console.error(error)) //catching errors

}) //closing our delete

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})