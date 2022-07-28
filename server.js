const express = require('express') //sets variable to require use of Express
const app = express() // sets app as variable for Express
const MongoClient = require('mongodb').MongoClient // sets variable to require use of MongoDB
const PORT = 2121 //sets port
require('dotenv').config() // sets .env folder for storing secret information


let db, // declares db
    dbConnectionStr = process.env.DB_STRING, // sets variable that tells code to go into .env folder and find DB_STRING variable
    dbName = 'todo' // sets variable for name of db we are accessing

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    }) // tells to go use db connection string to go in and access the 'todo' db in mongo
    
app.set('view engine', 'ejs') //sets ejs as the template to use
app.use(express.static('public')) // tells Express to supply content and styling components from public folder
app.use(express.urlencoded({ extended: true })) // sets middleware to parse incoming data into more useful components
app.use(express.json()) // tells Express to return the data as JSON


app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) // async function that goes into db, return collection as an array along with items that have not been completed, and render them to the dom as ejs. 

app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
}) // inserts a todo item, marks it as incomplete, console.logs confirmation, and refreshes

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

}) // marks todo item as complete, drops it to bottom of list, sends confirmation to console and json.

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

}) // Seems to do same as previous function except with a different url. Seems like a mistake. 

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

}) // deletes todo item and sends confirmation as consolelog and json.

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
}) //sets port to listen to and console.logs confirmation