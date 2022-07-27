const express = require('express') // get the express module import
const app = express()// bind express into a variable
const MongoClient = require('mongodb').MongoClient // get the mongodb client module - import from node modules
const PORT = 2121 //port for listening
require('dotenv').config()// middleware for hiding secrets

let db,
    dbConnectionStr = process.env.DB_STRING, // connection string linking to .env
    dbName = 'todo' // this db name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })// MongoDB driver's new connection management engine - always set to true
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) // connect, creates automatically
    })
    
app.set('view engine', 'ejs')// ejs engine
app.use(express.static('public'))// set static files to public folder
app.use(express.urlencoded({ extended: true }))// parses req.body - The express.urlencoded() function is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is based on body-parser.
app.use(express.json())// parses req.body - It parses incoming requests with JSON payloads and is based on body-parser.


app.get('/', async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()// finding convert to array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})// count the number of documents completed:false. 
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // render to ejs (HTML)
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
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //fields to enter 
    .then(result => {
        console.log('Todo Added')
        response.redirect('/') // redirect to home
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // inner text - match it on db and set the completed status to true
        $set: {
            completed: true // value to replace - set to true
          }
    },{
        sort: {_id: -1}, // sort it by latest
        upsert: false // update db and if not there then don't create a new doc.
    })
    .then(result => {
        console.log('Marked Complete') 
        response.json('Marked Complete') // response to json string to main.js which the reloads the browser
    })
    .catch(error => console.error(error))// log error otherwise 

})

app.put('/markUnComplete', (request, response) => { // match thing and set to completed to false - uncomplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{// match the innertext sent from the main.js
        $set: {
            completed: false // set value to false
          }
    },{
        sort: {_id: -1},//sort by latest??
        upsert: false //update
    })
    .then(result => {
        console.log('Marked Complete') // think this should say incomplete
        response.json('Marked Complete')// response to json string to main.js which the reloads the browser
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => { // delete item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})// match the innertext
    .then(result => {
        console.log('Todo Deleted') // log item was deleted
        response.json('Todo Deleted') //response to json string to main.js which the reloads the browser
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`) // creates server
})