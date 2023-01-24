//connect express
const express = require('express')
const app = express()
//connect DB
const MongoClient = require('mongodb').MongoClient
//assign localhost
const PORT = 2121
//allow .env to connect to the server
require('dotenv').config()


let db,
//pulls the mongoDB from .env file
    dbConnectionStr = process.env.DB_STRING,
    //finds the todo DB
    dbName = 'todo'


    //checking DB Connection
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')
//static of public so that I don't have to constantly write the route in the public folder
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
//using express
app.use(express.json())


//starting the DB and finding all the information needed 
app.get('/',async (request, response)=>{
    //making the iobjects in the DB into an array
    const todoItems = await db.collection('todos').find().toArray()
    //assigning a variable to counts the amount of documents with the property completed that is false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //if the object is not completed this renders the amount of tasks left
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
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
    //insertOne --> adding to the list of objects in the db
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        //takes it back to the home page
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
    //updating the object in the todo to completed of true
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    //after the request goes through we have a result
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//for completed items wanting to uncomplete them
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            //assigning property of completed as false
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


//when an object is deleted from the DB
app.delete('/deleteItem', (request, response) => {
    //deleteOne is used to remove the task from the DB
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})


//using the 2121 port or one assigned by env
app.listen(process.env.PORT || PORT, ()=>{
    //informs which port the app is running on
    console.log(`Server running on port ${PORT}`)
})