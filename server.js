/* This comment-the-code team night project was done with greygoose#8685 and nachokal#7649 (discord names) 
and refined reviewed by watching mayanwolfes video */


const express = require('express')  // allow the use of express 
const app = express() //Create instance of express and set it to a constant
const MongoClient = require('mongodb').MongoClient // talk to the DB and use methods relatd to it
const PORT = 2121 //set port you will use to a constant
require('dotenv').config() // use variables inside the .env file


let db, //declare global db varible
    dbConnectionStr = process.env.DB_STRING, //declare vaiable and assign it the db conection string
    dbName = 'todo' //dhttps://github.com/DavidHenry-Dev/todo-list-express.giteclare variable and assign name of the database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //create connection to mongoDB, passing connection string, and passing another property
    .then(client => { //if connection sucessful do these things and pass client information
        console.log(`Connected to ${dbName} Database`) // clg connection to db
        db = client.db(dbName) //assign db client factory method to the db variable created earlier
    })
// MIDDLEWARE START   
app.set('view engine', 'ejs') //sets view engine/ render method to ejs
app.use(express.static('public')) //initialize public folder for files such as html, css, and static assets
app.use(express.urlencoded({ extended: true })) //tells express to decodce and encode URLs where the header matchs the content. Supports arrays and objects
app.use(express.json()) //parse JSON content from incoming requests
// MIDDLEWARE END

app.get('/', async (request, response)=>{ //starts a GET method root route is passed, sets up req and root params
    // try catch block missing
    const todoItems = await db.collection('todos').find().toArray() //sets a variable, awaits everything from Todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable, awaits for count of uncompleted items to dispplay as EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //render the ejs file and pass an object that contains the db items(todoItems) and count remaining(itemsLeft)
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //starts POST method when /addTodo route is passed
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts new todo into collection and gives it a completed value of false
    .then(result => {  //if successful, then do these things
        console.log('Todo Added') //clg that a todo was added
        response.redirect('/') //redirects user back to homepage
    })
    .catch(error => console.error(error)) //catch errors
})

app.put('/markComplete', (request, response) => { //starts PUT method when markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look into db for 1 item that matches the item passed from main.js that was clicked 
        $set: { 
            completed: true   //sets completed status to true
          }                   
    },{                         
        sort: {_id: -1},   //moves completed item to bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //if succesful, do these things
        console.log('Marked Complete') //clg completed 
        response.json('Marked Complete') //sending response back to sender
    })
    .catch(error => console.error(error)) //if error clg error

})

app.put('/markUnComplete', (request, response) => { //starts PUT method when markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body. itemFromJS},{ //look into db for 1 item that matches the item passed from main.js that was clicked 
        $set: {
            completed: false //sets completed status to false
          }                 
    },{
        sort: {_id: -1}, //moves completed item to bottom of the list
        upsert: false   //prevents insertion if item does not already exist
    })
    .then(result => { //if successful then do
        console.log('Marked Complete') //clg mark complete
        response.json('Marked Complete') 
    })
    .catch(error => console.error(error)) //clg error

})

app.delete('/deleteItem', (request, response) => { //starts a delete method when delete route is passed
    db.collection('todos').deleteOne({thing: request.body. itemFromJS}) //looks into todo collection for one item that matches from our main.js file
    .then(result => { //if succesful, then do these
        console.log('Todo Deleted') //clg todo deleted 
        response.json('Todo Deleted') // //sending response back to sender
    })
    .catch(error => console.error(error)) //clg error

})

app.listen(process.env.PORT || PORT, ()=>{ //gets port from env file or from server.js if not found and attaches it to the server for listening 
    console.log(`Server running on port ${process.env.PORT || PORT}`) //may want to show the env file port as well 
})