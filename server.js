const express = require('express')//get express things in the file
const app = express()// set express module equal to variable app
const MongoClient = require('mongodb').MongoClient //MongoClient lets us talk to mongodb 'the database'; makes it possible to use method associated with MongoClient and to our DB      
const PORT = 2121 //use internet port; location where we are listening, its in all cap because it is a Global valuable


require('dotenv').config()
//allows us to access stuff in dotenv file npm package

//connect to database
let db,//declaring db variable globally
    dbConnectionStr = process.env.DB_STRING, //declaring a variable look in env file and find DB_String a
    dbName = 'todo' //setting name of database to access
//promise connect to database and show comment that it did. set the db to 

MongoClient.connect(dbConnectionStr, { useNewUrlParser: true, useUnifiedTopology: true })//creating a connection to MongoDB, and passing in our connection string
    .then(client => {//establish promise and do the rest if the connection works
        console.log(`Connected to ${dbName} Database`)// log to the console a template literal "connected to todo database"
        db = client.db(dbName)//assigning variable to db client factory method????
    })//closing then

    //declare middleware
app.set('view engine', 'ejs') // render web pages using ejs template files

app.use(express.static('public'))//sets the location for static asset like pictures

app.use(express.urlencoded({ extended: true }))//tells express to decode and encode url wherre header matches the content. supports the array and objects?????
app.use(express.json())//help parse json

app.get('/',async (request, response)=>{//Starts a GET method when the root route is passed in , sets up req and res parameter
    const todoItems = await db.collection('todos').find().toArray()//sets a variable and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//sets a variable and awits ia count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//rendering the EJS file and passing through the db items and count remaining  inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})
//add todo set item sets completed factor to false and refresh from database. else error
app.post('/addTodo', (request, response) => {//starts a post method when the add route is passsed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//set up a new object(todo item and whether completed) from input box, set it to false so it doesnt have strike through
    .then(result => {//if insert is successful do something
        console.log('Todo Added')//console log action   
        response.redirect('/')// take you out of addtodo so you don't stay there; you go back to local host

    })//closing then 
    .catch(error => console.error(error))//catching errors
})
//matches an item from 
app.put('/markComplete', (request, response) => {//updates starts a put method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//i have a body and I can pull ItemFromJS and put into object, better to use id value though, ids are unique
        $set: {
            completed: true//update item to true
          }
    },{
        sort: {_id: -1},//moves item to the bottom of the list
        upsert: false //if value does not exist create it if true; prevents insertion if item does not exist
    })
    .then(result => {//starts a then if update was successful
        console.log('Marked Complete')//logging to the console
        response.json('Marked Complete')//sending a response to the sender
        // if true change to to complete in console log and creates a new object
    })
    .catch(error => console.error(error)) //catching error

})

app.put('/markUnComplete', (request, response) => {//updates starts a put method when the unmarkComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//i have a body and I can pull ItemFromJS and put into object, better to use id value though, ids are unique
        $set: {
            completed: false//update item to true
          }
    },{
        sort: {_id: -1},//moves item to the bottom of the list
        upsert: false//if value does not exist create it if true; prevents insertion if item does not exist
    })
    .then(result => {//starts a then if update was successful
        console.log('Marked UnComplete')//typo- logging to the console
        response.json('Marked UnComplete')//typo- sending a response to the sender
    })
    .catch(error => console.error(error))//catching erro

})
// delete  item from data base 
app.delete('/deleteItem', (request, response) => {//starting delete method
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//CRUD method, check body to matching name from itemFromJS
    .then(result => {//starts if delete is successful
        console.log('Todo Deleted') //console log delete
        response.json('Todo Deleted')//sending a response back to the sender
    })
    .catch(error => console.error(error))//catch error

})
//get port that env file is trying to use if not use our own port
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})//end the listen