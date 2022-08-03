const express = require('express') //lets you use express in server.js by telling the program to require express
const app = express() //shortens the use for express by letting you use 'app' instead
const MongoClient = require('mongodb').MongoClient//lets you use mongodb by telling the program to require it
const PORT = 2121 //the port you're listening on, making it a const here allows you to change the port later withough having to change it in the code
require('dotenv').config() //dotenv file lets you keep things private 


let db,
    dbConnectionStr = process.env.DB_STRING, //going into the env file for your connection string
    dbName = 'todo'// your database name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//connecting to mongodb 
    .then(client => {
        console.log(`Connected to ${dbName} Database`)//console.log to let you know it's connected to the database
        db = client.db(dbName) //shortened variable for your mondodb 
    })
    
app.set('view engine', 'ejs') // tells express that you're using EJS as the template engine
app.use(express.static('public'))//tells express to make this folder accessible to the public
app.use(express.urlencoded({ extended: true }))// parses requests and returns an object
app.use(express.json())//tells express to use json

//async await syntax for get request
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray() //looking in the mongodb collection, 'todos', finding the data and turning into an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //looking in the mongodb collection, 'todos', counting the documents that are not completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //the response is using ejs to render html in todoItems and itemsLeft
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})
//post request
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //tells program to go into the database collection 'todos' and insert one item and it is not completed
    .then(result => {
        console.log('Todo Added')//console.log showing the todo was added
        response.redirect('/')//redirects back to the root page
    })
    .catch(error => console.error(error))//catches your error 
})
//put request
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//tells program to go into the mongodb collection 'todos' and update one thing that matches item
        $set: {
            completed: true //mark as completed
          }
    },{
        sort: {_id: -1}, //sorting the list in reverse order
        upsert: false// don't update if nothing matches item
    })
    .then(result => {//what's returned
        console.log('Marked Complete')//console.log to let you know it's marked complete
        response.json('Marked Complete')//responding with json marked complete
    })
    .catch(error => console.error(error))//catches error

})
//put request
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//tells program to look in the db to update one thing that matches the item
        $set: {
            completed: false //mark as uncompleted
          }
    },{
        sort: {_id: -1},//sorting the list in reverse order
        upsert: false// don't update if nothing matches item
    })
    .then(result => { //what is returned
        console.log('Marked Complete')//should this be 'marked uncomplete'?
        response.json('Marked Complete')//should this be 'marked uncomplete'?
    })
    .catch(error => console.error(error))//catches error

})
//delete request
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//look in db and delete one item matching the itemFromJS
    .then(result => {//what is returned
        console.log('Todo Deleted')//console.log that it's deleted
        response.json('Todo Deleted')//send json that it's deleted
    })
    .catch(error => console.error(error))//catches error

})
//telling express to listen on env port or the PORT assigned 
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)//console.log to tell you what port it's running on
}) 