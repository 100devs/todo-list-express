//importing express framework to handle the details of our routing
const express = require('express')
//attach an app to express
const app = express()
//import mongodb so we can save to a database in the cloud
const MongoClient = require('mongodb').MongoClient
//set up the port our server will be using 
const PORT = 2121
//import dotenv so we can securely store our secrets 
require('dotenv').config()

//delcaring database variable and provide authentication credentials form .env (if local)
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

    //connect to the database, and apply useUnifiedTopolgy, which is fancy database optimization on the topology level
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        //verify db is connected on console
        console.log(`Connected to ${dbName} Database`)
        //initialize the database
        db = client.db(dbName)
    })
//connect the app to ejs view engine for dynamic rendering    
app.set('view engine', 'ejs')
//enable ejs to connect to the public folder to render static files
app.use(express.static('public'))
//allows you to parse nested objects/arrays, extends beyond just accepting arrays and objects 
app.use(express.urlencoded({ extended: true }))
//connect app to express using json format for data transfer
app.use(express.json())

//code for rendering index/the root directory 
app.get('/',async (request, response)=>{
    //access database and put all of its documents into an array
    const todoItems = await db.collection('todos').find().toArray()
    //retrive the count of uncompleted items 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //return all items and the count of uncompleted items and send them to index to be rendered using ejs 
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

//code for adding an item , connecting with form's /addTodo action 
app.post('/addTodo', (request, response) => {
    //add an item to the database from the /addTodo form, defaulting to not yet completed
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //log that the item has been added, then reroute back to index
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    //display any errors 
    .catch(error => console.error(error))
})
//code for marking an item complete
app.put('/markComplete', (request, response) => {
    //reach into database to update whichever item was selected, setting completed to true (which then gives it the completed css class)
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        //return items with newest item at the top 
        sort: {_id: -1},
        //do not create a new document if the correct one does not exist 
        upsert: false
    })
    .then(result => {
        //console log to indicate the item as been marked complete
        console.log('Marked Complete')
        //send json indicating the item has been marked complete
        response.json('Marked Complete')
    })
    //log any errors 
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    //reach into the database to update the itemFromJS clicked from the main.js markUnComplete function
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //set completed to false in the database, to remove the completed css class from the item
        $set: {
            completed: false
          }
    },{
        //display newest items first, and do not create new documents if relevant document is not located  
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        //console log and send json indicating the item has been marked complete 
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //console log any errors 
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => {
    //get request body from main.js deleetItem function, then access the database and delete that item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        //console log and send json indicating item has been deleted
        console.log('Todo Deleted')
        response.json('Todo Deleted')
        console.log(request.body.itemFromJS)
    })
    //console log any errors
    .catch(error => console.error(error))

})

//serve the app from either the local port or from whatever port is configured on deploy 
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})