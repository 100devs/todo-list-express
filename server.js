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
    // .then(data => { //FIND AND COUNT THE DB ITEMS THAT ARE NOT COMPLETED AND RENDER THAT NUMBER ON THE INDEX
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error)) //IF AN ERROR OCCURS, SEND THE INFORMATION TO THE CONSOLE
})

/* CREATE - ADDING A TODO ITEM TO THE LIST */
app.post('/addTodo', (request, response) => { 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //ADD A SINGLE ITEM TO THE DB USING A REFERENCE FROM THE todoItem ARRAY AND ASSIGN IT A VALUE OF FALSE/NOT-COMPLETED
    .then(result => { //OUTPUT A VERIFICATION TO CONSOLE AND GO BACK TO BASE DIRECTORY
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error)) //IF AN ERROR OCCURS, SEND THE INFORMATION TO THE CONSOLE
})

/* UPDATE - MARKING AN EXISTING TODO ITEM COMPLETE */
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //FIND A SPECIFIC ITEM IN 'todos' DB AND CHANGE THE COMPLETED VALUE TO TRUE
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1}, //SORT DB IN DECENDING ORDER, STARTING WITH LATEST TIMESTAMP
        upsert: false //IF A DOCUMENT IS NOT FOUND, DO NOT CREATE ONE AND INSERT IT INTO THE DB
    })
    .then(result => { //CREATE AN OUTPUT TO MARK THE TASK COMPLETED IN CONSOLE AND ON JSON/WEBSITE
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error)) //IF AN ERROR OCCURS, SEND THE INFORMATION TO THE CONSOLE

})

/* UPDATE - MARKING AN EXISTING TODO ITEM UNCOMPLETE*/
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //FIND A SPECIFIC ITEM IN 'todos' DB AND CHANGE THE COMPLETED VALUE TO FALSE
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1}, //SORT DB IN DECENDING ORDER, STARTING WITH LATEST TIMESTAMP
        upsert: false //IF A DOCUMENT IS NOT FOUND, DO NOT CREATE ONE AND INSERT IT INTO THE DB
    })
    .then(result => {
        console.log('Marked Complete') //CREATE AN OUTPUT TO MARK THE TASK COMPLETED IN CONSOLE AND ON JSON/WEBSITE
        response.json('Marked Complete')
    })
    .catch(error => console.error(error)) //IF AN ERROR OCCURS, SEND THE INFORMATION TO THE CONSOLE

})

/* DESTROY  - REMOVING A TODO ITEM FROM THE LIST*/
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //FIND A SPECIFIC ITEM IN 'todos' DB AND REMOVE THAT ITEM FROM THE DB
    .then(result => {
        console.log('Todo Deleted') //CREATE AN OUTPUT TO MARK THE TASK COMPLETED IN CONSOLE AND ON JSON/WEBSITE
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error)) //IF AN ERROR OCCURS, SEND THE INFORMATION TO THE CONSOLE

})

app.listen(process.env.PORT || PORT, ()=>{ //LISTEN ON A SPECFICIC PORT TO SERVE THE DATA CONTAINED IN THE PROGRAM
    console.log(`Server running on port ${PORT}`)
})