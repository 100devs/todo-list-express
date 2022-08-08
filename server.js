const express = require('express')  //importing express module
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()


let db,     //adding db variables, especially DB_STRING which is found in .env to connect to mongo
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })  //connecting to db
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

app.set('view engine', 'ejs')  //settng up ejs middleware
app.use(express.static('public')) //serves up all static files in public folder
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',async (request, response)=>{ //serves up main home page -- READ
    const todoItems = await db.collection('todos').find().toArray() //getting all todo items and making an array out of them
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //returns number of todo items that haven't been completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //sending the above two variables to the index.ejs page to be used there
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //POST/CREATE request coming from form on index.ejs page
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//adding item to mongo (get request.body.todoItem from form on index.ejs page), setting variables for item added to mongo
    .then(result => {
        console.log('Todo Added')
        response.redirect('/') //reloading page with newly added item from mongo
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {//PUT/UPDATE request coming from main.js page
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//sending update request to mongo and finding item to update using request.body.itemFromJS
        $set: {//updating variable in mongo
            completed: true
          }
    },{
        sort: {_id: -1}, //not soring?
        upsert: false //not creating item if not found in list
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => { //PUT/UPDATE request from main.js
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//sending request to mongo and finding item requested to be updated
        $set: { //updating item in mongo
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

app.delete('/deleteItem', (request, response) => { //DELETE request from main.js
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //sending request to mongo using identifier from request.body.itemFromJS
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{//creating server and listening to env port or PORT variable port
    console.log(`Server running on port ${PORT}`)
})
