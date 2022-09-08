// enables express npm
const express = require('express')
// ties express to the app variable. anywhere app is present is just express().
const app = express()
// enables MongoDB to be used with the software
const MongoClient = require('mongodb').MongoClient
// ties the variable PORT to an arbitrary number of the developer's choosing
const PORT = 2121
//enables dotenv npm which is used to put sensitive information within an .env file
require('dotenv').config()

// declares variables needed to communicate with MongoDB
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//enables connection between the server and MongoDB 
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        //console logs connection to MongoDB if successful
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

// sets express to use the 'view engine' or template. in this case we are using ejs (embedded javascript)
app.set('view engine', 'ejs')
// built in module from express that utilizes any code within the public folder without explicitly stating paths for the files
app.use(express.static('public'))
//middleware which parses incoming requests with urlencoded payloads 
app.use(express.urlencoded({ extended: true }))
//middleware which parses req.body from JSON
app.use(express.json())

// handles read requests when the user enters '/' aka the root of the route. 

app.get('/',async (request, response)=>{
    //looks inside of the database for a collection matching the 'todos' string. returns the documents within the database as an array
    const todoItems = await db.collection('todos').find().toArray()
    //searches the database for documents with the key completed and a value of false and ties it to the itemsLeft variable
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //takes the todoItems/itemsLeft variables and ties it to 'items' and 'left' respectively. These items will then be injected into the .ejs file which will run its calculations. Responds to the get request with an HTML template which is then served up to the client.
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

//handles create requests with the route of /addTodo

app.post('/addTodo', (request, response) => {
    //creates a new document within MongoDB
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //logs in the terminal that the create request was successful and then reloads/redirects the page back to the root to reflect changes.
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    //will display an error if unsuccessful
    })
    .catch(error => console.error(error))
})

//handles update requests with the route /markComplete

app.put('/markComplete', (request, response) => {
    //goes within the DB, searches for documents with a key of itemFromJS and updates with new value
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        //sorts in descending order
        // upsert set to false will not create a new document if it does not exist
        sort: {_id: -1},
        upsert: false
    })
    //reports progress in console
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //error handler
    .catch(error => console.error(error))

})

//handles update requests with the route /markUnComplete

app.put('/markUnComplete', (request, response) => {
    //goes within the DB, searches for documents with a key of itemFromJS and updates with new value
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        //sorts in descending order
        // upsert set to false will not create a new document if it does not exist
        sort: {_id: -1},
        upsert: false
    })
    //reports progress in console
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    // error handler
    .catch(error => console.error(error))

})

// handles delete requests with the route /deleteItem

app.delete('/deleteItem', (request, response) => {
    // goes within the DB, searches for the target document and delete's one instance of it
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //progress handler
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    //error handler
    .catch(error => console.error(error))

})

//listener needed to initialize the server. process.env.PORT handles whichever hosting platform the developer uses

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})