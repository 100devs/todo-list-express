const express = require('express')   //allows us to use express in server.js after download
const app = express()  //giving express a variable name to use in server.js
const MongoClient = require('mongodb').MongoClient  //allows us to connect to the Mongo 
const PORT = 2121  //defining the location where the server willbe listening
require('dotenv').config()  //npm package that imports environment variables when we select it


let db,  // declaring the variable to be assigned on line 15 
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our databse string to it
    dbName = 'todo'  //declaring name of the database to 'todo

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connecting to database with the db connection string, naturally set to false so we set it to true in order to connect use mongoDB connection manager 
    .then(client => { //waiting for connection and proceeding if successful, and passing client information 
        console.log(`Connected to ${dbName} Database`)  //console logs when we are successfully connected to the database
        db = client.db(dbName)  //declaring the database name, initiates the db variable on line 8 to equal whatever the db name is
    })
    

//middlewear
app.set('view engine', 'ejs') //this tells express we are using the EJS template to render
app.use(express.static('public')) //sets the location for tatic assets 
app.use(express.urlencoded({ extended: true })) //tells express to decode/encode URLs where the header matches the content 
app.use(express.json()) //helping us parse JSON


app.get('/',async (request, response)=>{ //when at the root route, creates a promise 
    const todoItems = await db.collection('todos').find().toArray()  //sets a variable and awaits all items from the todos collection from the database 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //counts the items that are not completed to later display in EJS 
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //renders the EJS file and passes through the DB items and count remaining inside an object 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //starts a POST method, create an item for the todo list 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserting new item to the todo list, gives a completed value of false by default
    .then(result => { //if it works then do something
        console.log('Todo Added') //console log when something is added to todolist 
        response.redirect('/') //redirecting to the root (refresh the page) 
    })
    .catch(error => console.error(error)) //catching for errors 
})

app.put('/markComplete', (request, response) => { //starts a PUT method when route is passed 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in DB for matching name of the item passed from main.js file that was clicked on
        $set: {    //set completed staus to true in this section
            completed: true
          }
    },{
        sort: {_id: -1}, //sorts item to bottom of the list
        upsert: false  //prevents insertion if item does not already exist 
    })
    .then(result => { //starts a then if update was successful 
        console.log('Marked Complete')  //log to data if successful 
        response.json('Marked Complete') //sends response back to sender
    })
    .catch(error => console.error(error)) //catch errors

})

app.put('/markUnComplete', (request, response) => {  //starts a PUT method when route is passed 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in DB for matching name of the item passed from main.js file that was clicked on
        $set: {  //set completed staus to false in this section
            completed: false
          }
    },{
        sort: {_id: -1}, //sorts item to bottom of the list
        upsert: false //prevents insertion if item does not already exist 
    })
    .then(result => { //starts a then if update was successful 
        console.log('Marked Complete') //log to data if successful 
        response.json('Marked Complete') //sends response back to sender
    })
    .catch(error => console.error(error)) //catch errors

})

app.delete('/deleteItem', (request, response) => {  //starts delete method when delete value is passed 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //look in todos collection for item that has matching name from our JS file
    .then(result => {  //if successful we start a then if
        console.log('Todo Deleted') //starts a then if update was successful 
        response.json('Todo Deleted') //sends response back to sender
    })
    .catch(error => console.error(error)) //catch errors

})

app.listen(process.env.PORT || PORT, ()=>{  //setting up which port we should be listening on from env file if one exists, if one doesnt then from the variable we set up top
    console.log(`Server running on port ${PORT}`) //log the running port to console 
})