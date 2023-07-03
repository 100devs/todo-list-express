// dependencies 
const express = require('express') 
const app = express()
const MongoClient = require('mongodb').MongoClient

// port ( can go to .env as well)
const PORT = 2121
require('dotenv').config() // enable .env 


let db,
    dbConnectionStr = process.env.DB_STRING, // referencing db_string from .env file for security 
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // use new MongoDb engine
    .then(client => { // after you're connected console log name of database 
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) // connect to db, so you dont have to type clinet.db('todo') over again
    })
    
    
app.set('view engine', 'ejs') // render the page using ejs
app.use(express.static('public')) //middleware for serving static files via HTTP
app.use(express.urlencoded({ extended: true })) // not 100% but i think it allows us to parse trough files we got from user in req.body
app.use(express.json())


app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray() // wait for it to find all todos from db and put it in the arary
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // count how many documents have complited: false 
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // render data with ejs template
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {
    // go to the db collenction an insert one, thing is the naem in db collection, req.body.todoItem gets whatever they wrote. It takes req goes to bdoy and todoItem is name of the fild
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/') // get back to the main page
    })
    .catch(error => console.error(error)) // console log the error
})

// if you click on the item, it should be marked complite 
app.put('/markComplete', (request, response) => {

    // updateOne looks for thing that has the same name in Db as itemFromJS( item being clicked)
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
// Defining PORT to run on, ether local or hosted
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})