const express = require('express')//server requires express
const app = express()//sets express as "app" variable
const MongoClient = require('mongodb').MongoClient//sets MongoDb requirement
const PORT = 2121//sets local host port
require('dotenv').config()//requires 'dotenv'


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'//sets MongoDB variables

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//sets connection to MongoDB, unifiedTopology is a disconnect handler, that retrys connection after disconnection
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)//sets db from your mongodb collection name
    })
    
app.set('view engine', 'ejs')//sets ejs as view engine
app.use(express.static('public'))//connects server.js to files inside public folder
app.use(express.urlencoded({ extended: true }))//express middleware that parses incoming requests - replaces body-parser?
app.use(express.json())//parses incoming requests with JSON - replaces body-parser?


app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()//sets variable for items in DB and sets as an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//counts items in 'todos' that havent been completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//renders the count on page
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {//method to create new list iotems
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//inserts new item into DB and sets as not completed
    .then(result => {
        console.log('Todo Added')//confirmation in console
        response.redirect('/')//reloads page
    })
    .catch(error => console.error(error))//error logging
})

app.put('/markComplete', (request, response) => {//marks completed items as complete and updates DB
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true//marks item completed in DB
          }
    },{
        sort: {_id: -1},//sort in desceding order
        upsert: false//If property is true, create property if it doesn exist
    })
    .then(result => {//console logging 
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {//changes completed items to incomplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false//marks item incomplete in DB
          }
    },{
        sort: {_id: -1},//sort in desceding order
        upsert: false//If property is true, create property if it doesn exist
    })
    .then(result => {
        console.log('Marked Complete')//console logging
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))//error logging

})

app.delete('/deleteItem', (request, response) => {//removes item from todo list
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {//console logging
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))//error logging

})

app.listen(process.env.PORT || PORT, ()=>{//tells server to listen on PORT# or Heroku settings
    console.log(`Server running on port ${PORT}`)
})