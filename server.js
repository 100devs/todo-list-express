const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config() //DotEnv is a lightweight npm package that automatically loads environment variables from a . env file into the process. env object.
// this document is using express, mongo, port 2121, requires dotenv

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo' // name of the database is to do 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',async (request, response)=>{  //
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // each collection each item there in is an item in the array. its setting them all to false. db is the room. the collection is the box and documents are each item in the box 
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

app.post('/addTodo', (request, response) => { // post - create method 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => { //will insert one thing fromt he requst from the body to to do item completes is false 
        console.log('Todo Added')
        response.redirect('/') // connects to file
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => { //put update/ replace from todos collection update one thing requesting from the body > itemFromJs item 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1}, // sort in descending order , id assigned in database in mongodb _ is private not public 
        upsert: false // update + insert = will not create a new document
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => { // put / update / replace 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false //auto default to false. 
          }
    },{
        sort: {_id: -1},
        upsert: false // not creating something new so false 
    })
    .then(result => {
        console.log('Marked Un Complete') //why are we marking compelte? and not Marked Uncomplete 
        response.json('Marked UnComplete') // chnged from marked complete to marked uncomplete for accuracy
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => { //DELETE - Day-lay-tay 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // deletes one item from list 
    .then(result => {
        console.log('Todo Deleted') // console log after compelted  toDo Deleted 
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{  //listen to port and display from server on port listed above 2121
    console.log(`Server running on port ${PORT}`)
})