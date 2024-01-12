//requirements and dependencies are stored into variables. 
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

//connect to mongoDB
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
//middleware for express    
app.set('view engine', 'ejs') //using ejs as the templating language
app.use(express.static('public')) //using the static public funcitonality of express which autmatically handles pathing for public assets
app.use(express.urlencoded({ extended: true })) //not sure
app.use(express.json()) //allows parsing of json responses

//how to handle get request on page load.
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray() //geting all objects/records from the db and converting them to an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //calculating the items that are left to do
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering the HTML via ejs and sending it client side
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})
//how to handle update requests to add a todo item
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a todo item into the db
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//handles the request that marks a todo item as completed
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
//handles the request that marks a todo item as uncompleted
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

//handles the request to delete an item-
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //deletes item from  db
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})