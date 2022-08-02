const express = require('express') //initilazing the express module from npm after install
const app = express() //initializing express methods from inside express. requiring express + using = 2 lines
const MongoClient = require('mongodb').MongoClient //initilizaing mongo database
const PORT = 2121 //port number 
require('dotenv').config() //requiring .env file for mongodb

//testing

let db, //initializing db variable
    dbConnectionStr = process.env.DB_STRING, //db connection string = DB string in the env file
    dbName = 'todo' //naming the database 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //mongo connection method //wjat does unified topology mean?
    .then(client => { // .then method using a promise
        console.log(`Connected to ${dbName} Database`) //confirming databse connection with console.log
        db = client.db(dbName) //need to find this
    })
    
app.set('view engine', 'ejs') //this is required to use express -- initializing into variable
app.use(express.static('public')) //using the public folder for express.js
app.use(express.urlencoded({ extended: true })) //parses incoming requests with urlencoded payloads and is based on body-parser.
app.use(express.json()) //only looks at requests where the Content-Type header matches the type option.  example: type: 'application/json'

//GET - CREATE
//PUT - READ
//POST - UPDATE
//DELETE - DELETE

app.get('/',async (request, response)=>{ //GET = CREATE. creating an html page on  '/' ping, with async fn
    const todoItems = await db.collection('todos').find().toArray() //await = wait for this method before doing anything else.
    //finding all items inside collection 'todos', turning it into an array element.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //itemsLeft = count documents method with object filter - completed: false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //after await is completed, render ejs HTML file. 1st param: ejs file, 2nd param: sending object to front-end
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //using POST = UPDATE method when '/addTodo' is pinged in the index.ejs
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //req.body.todoItem = the name in the form input.
    // also adding another property of 'completed' with a default value of false
    .then(result => { //using .then as a promise -- promise happens after method is complete
        console.log('Todo Added') //confirmation of database update
        response.redirect('/') //redirects to the '/' ping. ping will utilize GET method after insertOne method is complete
    })
    .catch(error => console.error(error)) //catching error
})

app.put('/markComplete', (request, response) => { // READ METHOD -- READ goes into the database system to retrieve, search, or view existing entries
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //go into the the 'todos' collection and updateOne using the filter object prop: thing -- this might be adding a new "thing property"
        //key: req.body.itemFromJS = the information that is sent over from the FRONT END 
        $set: { //$set method changes the value of the key 
            completed: true //changing value of property: completed from false to true 
          }
    },{
        sort: {_id: -1}, //sort -1 = descending, and 1 = ascending 
        upsert: false //combination of insert and update 
    })
    .then(result => { //finishing promise to confirm a complete task
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error)) //catching error confirmation

})

app.put('/markUnComplete', (request, response) => { //READ METHOD when marking a task as incomplete -- goes into the database system and searches an existing entry to update
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // updates a task from the todos collection with the filter -- thing: 
        //req.body.itemsFromJS = front-end items that were sent into the backend 
        $set: { // $set = changing a property 
            completed: false // changing items that were previously completed: true -- into completed: false 
          }
    },{
        sort: {_id: -1}, //sort -1 = descending, and 1 = ascending 
        upsert: false //combination of insert and update  -- find out what the difference between false and true upsert
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

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
