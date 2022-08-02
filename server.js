const express = require('express') //express module
const app = express() //shorthand var for express
const MongoClient = require('mongodb').MongoClient //mongo module
const PORT = 2121 //defining port for http
require('dotenv').config() //module to allow env vars


let db, //creating variable
    dbConnectionStr = process.env.DB_STRING, //grabbing env variable with mongo db connection path
    dbName = 'todo' //creating and defining variable

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //running mongodb.MongoClient.connect function to connect to path in .env
    .then(client => { //on connect, pass client output to function
        console.log(`Connected to ${dbName} Database`) //spit out database location
        db = client.db(dbName) // set client database name value to db var
    })
    
app.set('view engine', 'ejs') //set view engine to ejs for rendering
app.use(express.static('public')) //allows express to serve requests to public folder to just work
app.use(express.urlencoded({ extended: true })) //allows express to turn req into string or array 
app.use(express.json()) //allows express to turn req into json


app.get('/',async (request, response)=>{ //request for main page returns promise
    const todoItems = await db.collection('todos').find().toArray() //wait for data, make array and set to todoItems
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //wait for data, count obj, set to itemsLeft
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //return to client rendered index.ejs with todoItems and itemsLeft props
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //update request promise
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //calls insert method to add todoItem 
    .then(result => { // on completion run function
        console.log('Todo Added') //spit out completion
        response.redirect('/') //refresh page
    })
    .catch(error => console.error(error)) //on error, console log error msg
})

app.put('/markComplete', (request, response) => { //create completed request promise
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //updateOne method of todos db
        $set: {
            completed: true //set completed key to true
          }
    },{
        sort: {_id: -1}, //start at latest doc id value
        upsert: false //do not update or insert new value
    })
    .then(result => { //on completion
        console.log('Marked Complete') //return complete to console
        response.json('Marked Complete') //return complete to client in json
    })
    .catch(error => console.error(error)) //on error, console error

})

app.put('/markUnComplete', (request, response) => { //create uncomplete request promise
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //updateOne method of todos db
        $set: {
            completed: false //set completed key to false
          }
    },{
        sort: {_id: -1}, //start at latest doc id value
        upsert: false //do not update or insert new value
    })
    .then(result => {
        console.log('Marked Complete') //return complete to console -- is this wrong?
        response.json('Marked Complete')  //return complete to client in json -- is this wrong?
    })
    .catch(error => console.error(error)) //on error, console error

})

app.delete('/deleteItem', (request, response) => { //delete request promise
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //deleteOne method of todos db
    .then(result => { // on completion
        console.log('Todo Deleted') //console deleted
        response.json('Todo Deleted') //return client json deleted
    })
    .catch(error => console.error(error)) //on error console log error

})

app.listen(process.env.PORT || PORT, ()=>{ //listen for http request on env port or PORT
    console.log(`Server running on port ${PORT}`) //console log port
})