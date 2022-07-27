const express = require('express') //TELL CODE TO USE EXPRESS ASSETS
const app = express() //USER SHORTCUT TO CALL EXPRESS ASSETS
const MongoClient = require('mongodb').MongoClient //TELL CODE TO USE MONGO ASSETS
const PORT = 2121 //ASSIGN STATIC PORT
require('dotenv').config()


let db, //ASSIGNING GLOBAL VARIABLES TO USE LATER IN THE CODE
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //CONNECT TO THE MONGO DB; PRINT TO CONSOLE A SUCCESS; PULL 'todo' CLIENT DB STRING AND ASSIGN IT TO VARIABLE 'db'
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs') //CHANGE THE VIEW ENGINE FROM JADE TO EJS
app.use(express.static('public')) //SET UP MIDDLEWARE TO HANDLE '\PUBLIC' 
app.use(express.urlencoded({ extended: true })) //SET UP MIDDLEWARE TO STORE OBJECTS AS A STRING/ARRAY
app.use(express.json()) //SET UP MIDDLEWARE TO STORE OBJECTS AS JSON

/* READ */
app.get('/',async (request, response)=>{ //FETCH THE FOLLOWING CODE AT BASE DIRECTORY
    const todoItems = await db.collection('todos').find().toArray() //WAIT FOR AN ASYNC PROMISE AND FIND ALL OF THE TODO ITEMS IN THE DB AND ASSIGN THEM TO 'todoItems' AS AN ARRAY
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //WAIT FOR AN ASYNC PROMISE AND COUNT THE TODO ITMES IN THE DB AND ASSIGN THAT VALUE TO 'itemsLeft'
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //USE EJS TO RENDER/BUILD AN INDEX PAGE USING THE TWO VARIABLES ABOVE
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

/* CREATE */
app.post('/addTodo', (request, response) => { 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

/* UPDATE */
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

/* UPDATE */
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

/* DESTROY */
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})