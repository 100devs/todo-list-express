const express = require('express') //using express by requiring it
const app = express() //basically saying that we're using express
const MongoClient = require('mongodb').MongoClient //using mongodb for our databse 
const PORT = 2121 //this will be the default port we use
require('dotenv').config() //loads environment variables from .env file


let db,
    dbConnectionStr = process.env.DB_STRING, //connection string to database
    dbName = 'todo' //name of database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connect to Mongo database
    .then(client => {
        console.log(`Connected to ${dbName} Database`) //display on console that you've succesfully connected 
        db = client.db(dbName) //db is = to the dbName
    })
    
app.set('view engine', 'ejs') // 'view engine' = 'ejs'
app.use(express.static('public'))//use Express middleware to serve public folder as static to server
app.use(express.urlencoded({ extended: true })) //you can post "nested objects"
app.use(express.json())//use to parse incoming requests with JSON payloads


app.get('/',async (request, response)=>{ //read request
    const todoItems = await db.collection('todos').find().toArray() //pull all from 'todos' collection and put into array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //pull the number of documents where completed = false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //returns the todo items and the count
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //create request
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //add to collection the new 'thing' with a status of completed = false
    .then(result => {
        console.log('Todo Added') //print on console that item was added
        response.redirect('/') // redirect to original page
    })
    .catch(error => console.error(error)) //if error print error
})

app.put('/markComplete', (request, response) => { //update request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //update this thing
        $set: {
            completed: true // change status to completed
          }
    },{
        sort: {_id: -1}, //sort by descending id
        upsert: false // do not insert new doc if can't find thing 
    })
    .then(result => {
        console.log('Marked Complete') //print on console 'Marked Complete'
        response.json('Marked Complete') //send response back 'Marked Complete'
    })
    .catch(error => console.error(error)) //if error print error

})

app.put('/markUnComplete', (request, response) => { //update request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false //change status to incomplete
          }
    },{
        sort: {_id: -1}, //sort by descending id
        upsert: false // do not insert new doc if can't find thing
    })
    .then(result => {
        console.log('Marked Complete') //print on console 'Marked Complete'
        response.json('Marked Complete') //send response back 'Marked Complete'
    })
    .catch(error => console.error(error)) //if error print error

})

app.delete('/deleteItem', (request, response) => { //delete request
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //delete thing
    .then(result => {
        console.log('Todo Deleted') //print on console 'Todo Deleted'
        response.json('Todo Deleted') //send response back 'Todo Deleted'
    })
    .catch(error => console.error(error)) //if error print error

})

app.listen(process.env.PORT || PORT, ()=>{ //use environment provided port or default port
    console.log(`Server running on port ${PORT}`) //print on console the port the server is running on
})