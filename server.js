const express = require('express') //Declare variable for requiring express
const app = express() //assigns express to app variable
const MongoClient = require('mongodb').MongoClient //Declare variable for requiring MongoDB
const PORT = 2121 //declaring PORT number
require('dotenv').config() //requiring .env file


let db,//declare global for database
    dbConnectionStr = process.env.DB_STRING, //grabs variable from env file
    dbName = 'todo' //name of database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Connecting to mongo database 
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) //adds collection of database name
    }) 
    
app.set('view engine', 'ejs') //setting ejs template
app.use(express.static('public')) //renders all static files in public folder
app.use(express.urlencoded({ extended: true })) //parses the urls
app.use(express.json()) //returns data database


app.get('/',async (request, response)=>{ // Get root route
    const todoItems = await db.collection('todos').find().toArray() //find todo items and converts them into an array.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //ejs uses render instead of send file
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) 

app.post('/addTodo', (request, response) => {  //To create a todo list item 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //insert a todo list item in ejs body**
    .then(result => {
        console.log('Todo Added')
        response.redirect('/') //redirect to root route after adding a todo list item
    })
    .catch(error => console.error(error)) //error if promise fails
})

app.put('/markComplete', (request, response) => { //To update a todo list item by marking it complete.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //Update todo list item on MongoDB and on ejs body
        $set: {
            completed: true 
          }//Adds updated items to todolist 
    },{
        sort: {_id: -1}, //sorts todo items in descending order 
        upsert: false //does not insert new document when no match is found
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error)) //error if promise fails

}) //Update todo list item

app.put('/markUnComplete', (request, response) => { //To update a todo list item by marking it uncomplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //Update uncompleted todo list item on MongoDB and on ejs body
        $set: {
            completed: false
          } 
    },{
        sort: {_id: -1}, //sorts todo items in descending order
        upsert: false //does not insert new document when no match is found  
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error)) //error if promise fails
})

app.delete('/deleteItem', (request, response) => { //Delete a todo list item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //Delete from MongoDB database and from ejs body
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error)) //error if promise fails

}) //delete todo list item

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
}) //tells us when port is running and when we're connected to database