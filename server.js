//npm packages and setup
//express
const express = require('express')
const app = express()

//MondoDB
const MongoClient = require('mongodb').MongoClient

//listening Port
const PORT = 2121

//dotenv
require('dotenv').config()


//initialize db variables
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//set db var, and make connection to MongoDB client
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    

//Setting express denpencies: (ejs, json, urlencoded)
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//Get index
app.get('/',async (request, response)=>{
    //puts dbs into an array
    const todoItems = await db.collection('todos').find().toArray()
    //counts the documents
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //render index.ejs
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

//Post addTodo
app.post('/addTodo', (request, response) => {
    //insert into todo list
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        //respond with success
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error)) //respond with error
})

//Update (put)
app.put('/markComplete', (request, response) => {
    //.updateOne (filer, operators)
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        //return success
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error)) //return fail

})

//update (put)
app.put('/markUnComplete', (request, response) => {
    //.updateOne (filer, operators)
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        //return sucess
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error)) //return fail
})


//delete request
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