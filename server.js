const express = require('express') //loads the express modules allowing for our app to use express
const app = express() // puts the express functions into a variable which can be used later
const MongoClient = require('mongodb').MongoClient // loads the mongobd functions. Makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 //initial port to run the app on and assign it to the constant PORT
require('dotenv').config() //allows the app to use the data from the .env file so that the sensitive data can stay hiddden


let db, //creates a db global variable
    dbConnectionStr = process.env.DB_STRING, //assigns the dbConnectionString variable the value from the DB_String in the env file
    dbName = 'todo' //variable for the name of the database to pull the data from 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //this is how we send data and connect to the mongo database
    .then(client => { // MongoClient is establishing a promise. after the client has connected to the database, these things should happen
        console.log(`Connected to ${dbName} Database`) //this lets the user know that there was a successful connection to the database
        db = client.db(dbName) //assigns value to previously declared db variable that contains a db client factory method
    }) //closes then 
    
app.set('view engine', 'ejs') //middleware to set ejs as the default render method
app.use(express.static('public')) //express will use the public folder in order to serve up the main js file and css files
app.use(express.urlencoded({ extended: true })) //parses all `application/x-www-form-urlencoded` (aka form) requests contents, extended to support arrays and objects
app.use(express.json()) //parses data into json


app.get('/',async (request, response)=>{ //root endpoint for the app. async function
    const todoItems = await db.collection('todos').find().toArray() // finds all of the to do list items in the database 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // counts the documents that have been marked not completed 
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //renders the ejs file returns the todo items as well as the items left 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})//closes get method

app.post('/addTodo', (request, response) => { //post endpoint where users can add to the todo list
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //adds one document to the todo list and assigns the completed key to false
    .then(result => { //if insert is successful do stuff
        console.log('Todo Added') //client side will see that it was added 
        response.redirect('/') //will redirect the user to the root endpoint
    })
    .catch(error => console.error(error)) //if there are any errors then they will appear here 
})//closes post method

app.put('/markComplete', (request, response) => { //updates a document to mark complete 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //Looks in the database for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: { //changes the completed key to true 
            completed: true
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list. doesn't really do anything significant 
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //after database has finished updating 
        console.log('Marked Complete') //client side will log marked comlpete
        response.json('Marked Complete') //will send back json marked compled. data is sent back to the marked complete async function
    })
    .catch(error => console.error(error)) //if there are any errors they will appear here 

}) //end put method

app.put('/markUnComplete', (request, response) => { //starts a put method when the markuncomplete route is passed in  
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //updates the body of the item 
        $set: { //sets completed to false 
            completed: false
          }
    },{
        sort: {_id: -1},//sorts input documents by id in descending order 
        upsert: false //prevents insertsion if the item doesn't exist 
    })
    .then(result => { //after database has finished updating 
        console.log('Marked Complete') //clienct side will log marked uncomplete
        response.json('Marked Complete') //sending a response back to the markec uncomplete async method
    })// closes then method
    .catch(error => console.error(error)) //catches and console logs any errors

}) //end put method

app.delete('/deleteItem', (request, response) => { //starts a delete method when the delete route is passed 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //looks inside todos collections and runs the deleteOne method. Looks for the name that was passed in from ejs
    .then(result => { //if delete was successful 
        console.log('Todo Deleted') //console log results
        response.json('Todo Deleted') //sends respnse back to the sender 
    })//closes then block
    .catch(error => console.error(error)) //catches errors

}) //closes delete method

app.listen(process.env.PORT || PORT, ()=>{ //setting up which port we will be listening on, either the port from the .env file or the port vaiable we set 
    console.log(`Server running on port ${PORT}`) //console.log the running port
}) //close listen method 