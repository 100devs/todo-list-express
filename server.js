const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()
// this is for hiding critical keys


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
        // asigning database collection to db for further use
    })
    
app.set('view engine', 'ejs')
// telling express to use ejs to display pages
app.use(express.static('public'))
    //allows us to use the public folder
app.use(express.urlencoded({ extended: true }))
    //parse stuff after /
app.use(express.json())
    //parse JSON Objects from database


app.get('/',async (request, response)=>{
    // create an async func 
    const todoItems = await db.collection('todos').find().toArray()
    // grab collection items in the database todos, find => grabs everything
    // and sends them to an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // grabs items in collection and returns a count of items with key values of
    // completed: false
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // responds with index.ejs with gets plugged in with constants
    // 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
    // this is a promise instead of an async function
})

app.post('/addTodo', (request, response) => {
    // waiting for data in /addTodo
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // inserts one entry into database collection 'todos' and takes it from
    // the request body, item called todoItem and sets key value completed: false
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
        // reloads the page
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // update a thing to done
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
        console.log('Marked Uncomplete')
        response.json('Marked Uncomplete')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => {
    //expects a delete request
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //deletes one item in the within the collection 'todos' in collection
    //it gets it from the main.js which pulls it from index.ejs
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    //listens on heroku's port or the one we set it to
    console.log(`Server running on port ${PORT}`)
})
