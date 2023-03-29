const express = require('express') //requiring express
const app = express() //intiting express
const MongoClient = require('mongodb').MongoClient //requiring your server to connect to mongodb
const PORT = 2121 //localhost
require('dotenv').config() //depdencay module that loads environment variabes from .env file

//defining variables, env variable, db variable to use in public code
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//connecting to mongodb server
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        //connect to database called "todo"
        db = client.db(dbName)
    })

//defining which template language you are using
app.set('view engine', 'ejs')
//telling express to use public folder
app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))
//formates document into json file
app.use(express.json())

//initiating get request
app.get('/',async (request, response)=>{
    //looking into the db database and grabing and turning it into an array
    const todoItems = await db.collection('todos').find().toArray()
    //looking into the database and finding the documents with completed = false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //taking toDoItems and itemsLeft and populating it into the dom using ejs
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //why do items and left instead of todoItems and itemsLeft
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//when /addToDo form in EJS is submitted it runs this POST (create)
app.post('/addTodo', (request, response) => {
    //inserts the form input into the database using thing: 'todoItem', and sets completed as automatically false (to be changed later)
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        //redirected to root and refreshes changes
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//Update request
app.put('/markComplete', (request, response) => {
    //goes into todos database and updates thing: with request.body.itemFromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1}, //sorts completed from uncompleted tasks
        upsert: false //doesn't duplicate every time something updates
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete') //returns to user
    })
    .catch(error => console.error(error))

})

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