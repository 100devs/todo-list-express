//importing express and then assigning it to the variable app to use it
const express = require('express')
//allowing the server to access express methods
const app = express()
//importing mongodb and assigning it to a variable
const MongoClient = require('mongodb').MongoClient
//assigning PORT a value
const PORT = 2121
//dotenv is installed, this is so your app knows to look in the
//.env file to find process.env variables
require('dotenv').config()

//instantiating db, assigning your secret link to your db via
//env, and assigning the db name todo to a variable
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

    //establishing a connection to the mongodb using your connection string from
    //the env file - unified topology: Set to true to opt in to using the MongoDB driver's new connection management engine
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        //once you are connected to the db, this will print the console
        //log in the terminal console
        console.log(`Connected to ${dbName} Database`)
        //variable db now has the db name assigned to it
        db = client.db(dbName)
    })
    
//this tells express to use ejs to display/serve pages
app.set('view engine', 'ejs')
//this tells ejs where to look for client side files, js/css
app.use(express.static('public'))
//middleware to parse incoming requests -- 
app.use(express.urlencoded({ extended: true }))
//allows the app to parse and use json formatted data that is rec'd from the server
app.use(express.json())

//when route / is passed to the api,,,,,
app.get('/',async (request, response)=>{
    //todoitems will access the db collection todos and find all items and put them in an array
    const todoItems = await db.collection('todos').find().toArray()
    //items left will access the db and get the number of documents that are not completed
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //this will then tell the browser to render index.ejs and also s end back an obj with the todoitems and it ems l eft
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
//when the /addtodo route is accessed...
app.post('/addTodo', (request, response) => {
    //access the db collection to do and insert a task
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})
//updating function - when markcomplete is accessed
app.put('/markComplete', (request, response) => {
    //access db collection todos and update one
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
             //changes completed to true
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
                //does not add to the db if it does not exist
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})
//accesses the endpt markuncomplete, access the db, finds and updates the item from the request
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //changes completed to false
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        //does not add to the db if it does not exist
        upsert: false
    })

    .then(result => {
        //console logs marked uncomplete, sends response to client
        console.log('Marked UnComplete')
        response.json('Marked UnComplete')
    })
    //catch err
    .catch(error => console.error(error))

})
//accesses the endpt deleteitem, access the db, delete one item from the request
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        //logs todo deleted to the terminal, and sends a response to the client
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})
//allows an outside host to provide the PORT or use the PORT variable
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})