//bring in the express module
const express = require('express')
//put it into the app vairable
const app = express()
//bring in mongoDB
const MongoClient = require('mongodb').MongoClient
//Set up the variable for the port that the server will run on
const PORT = 2121
//sets up environment variables
require('dotenv').config()

// instantiate variable for the database, database name & database connections
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//MongoClient class lets you connect to mongoDb
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    
    //if successful console log that is worked
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        //set the db varialble to the database name
        db = client.db(dbName)
    })


//use ejs (
app.set('view engine', 'ejs')
//set the public folder as where to look for static files, css, html
app.use(express.static('public'))
//middleware that helps express recognize the incoming Request Object as strings or array
app.use(express.urlencoded({ extended: true }))
//middleware that helps express to recognize the incoming Request Object as a JSON Object
app.use(express.json())

//get (Read) with the path of /
app.get('/',async (request, response)=>{
    //goes to database & returns an array made up of the todo collection
    const todoItems = await db.collection('todos').find().toArray()
    //checks database & returns sets the number of items where completed is false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //renders the index.js file and passes it the array & num variable
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

//Post (Create) at the path /adddtodo
app.post('/addTodo', (request, response) => {
    //finds the todo collection in the database & adds the new item, marking complete as false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        //redirects back to the / path which will call the above get request, re-rendering the page with the new item displayed
        response.redirect('/')
    })
    //if it fails, it will throw an error so the user knows
    .catch(error => console.error(error))
})

//put (Update) at the path /markComplete
app.put('/markComplete', (request, response) => {
    //goes to the database, finds the item that has been marked and updates it's status
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    //marks the item as complete
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //if it fails, it will throw an error
    .catch(error => console.error(error))

})

//put (Update) at the path /markUnComplete same as mark complete but unmarks it
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

//delete (Delete) at path /deleteItem
app.delete('/deleteItem', (request, response) => {
    //goes to the database an locates the item, then removes it
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        //sends back success as json object
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    //if it fails, it will throw an error
    .catch(error => console.error(error))

})

//sets up the server on the port
app.listen(process.env.PORT || PORT, ()=>{
    //console logs to tell user it's working
    console.log(`Server running on port ${PORT}`)
})
