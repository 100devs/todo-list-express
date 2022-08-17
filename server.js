//enables the us of the express framework
const express = require('express')
//creates an instance of express library, shortcut instead of express() every time
const app = express()
//enables use of mongodb client module
const MongoClient = require('mongodb').MongoClient
//telling express what port to listen to, beyond local
const PORT = 2121
//loading dotenv package and immediately calling config method from the package. This imports dotenv file in root directory. Always want to have .env in root directory
require('dotenv').config()

//creating db variable with no value
let db,
//creating variable to hold the dbstring from the .env file
    dbConnectionStr = process.env.DB_STRING,
//creating variable to hold the name of the database. If no database found with this name mongo will create it
    dbName = 'todo'

//use unified topology is a connection option for mongodb. This line is connecting to the mongo database with the connection string in our .env file. Returns a promise that is either resolved or rejected. This line begins the promise
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
//then handler for handling a successfully resolved process. Client is a paramater returned with the promise
    .then(client => {
        //console log returned with then handler saying database is connected
        console.log(`Connected to ${dbName} Database`)
        //defining db variable, as the
        db = client.db(dbName)
    })
//telling express ejs is the view engine. Both paramaters
app.set('view engine', 'ejs')
//anything in the public folder, serve it up as is. Inside views folder, express has to do stuff to it. Public is as is no intervention by express
app.use(express.static('public'))
//Urlencoded middleware intercepts requests and responses and inserts itself in the middle between client and server. This allows data to be passed to the server through a request. Allows the client to pass data via the URL to the server. ? is delimiter between the URL and data passing through
app.use(express.urlencoded({ extended: true }))
//when a req is sent, it has a body/overall content, telling express to load a function to look at the json sent, parse it out and understand it
app.use(express.json())

//get method when client requests to root, localhost/2121/, starts a promise, req res variables
app.get('/',async (request, response)=>{
    //creating a toDoItems variable that holds all the documents in the todos database in an array
    const todoItems = await db.collection('todos').find().toArray()
    //creating a variable to return # of matches of items that are not completed
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //telling express to take the todoItems assign it to items, and itemsLeft assigned to left, passing the object to the ejs file, when completed ejs is back, sending it to clients computer as html. Ejs is template, html is final document
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

//post req that will fire when the user enters data on the page
app.post('/addTodo', (request, response) => {
    //with every new item entered by client, adds object to the database with thing as the item entered, marks completed as false 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //if req is successful, will print todo added to console
    .then(result => {
        //console log to heroku
        console.log('Todo Added Woohoo')
        //refresh page
        response.redirect('/')
    })
    //if problem inserting document, error log on heroku
    .catch(error => console.error(error))
})
  
//when we recieve put request at /markcomplete endpoint
app.put('/markComplete', (request, response) => {
    //updates one document in collection with the data from the request body
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //when doc is found, set completed field to true
        $set: {
            completed: true
          }
    },{
        //Telling it to sort database items by id in descending order. Updated item would be at bottom of list. If "walk the dog" on list twice, update the newest "walk the dog"
        sort: {_id: -1},
        //telling mongo if nothing if found don't create anything. 
        upsert: false
    })
    //when promise successful, log in heroku it was successful
    .then(result => {
        console.log('Marked Complete')
        //inform client it was successful
        response.json('Marked Complete')
    })
    //log in heroku there was an error if error 
    .catch(error => console.error(error))

})

//update request at /markuncomplete directory
app.put('/markUnComplete', (request, response) => {
    //update one document in todos collection 
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

//delete request at /deleteItem directory
app.delete('/deleteItem', (request, response) => {
    //delete one item from todos collection with the name of todo matches what's sent in req
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //if successful
    .then(result => {
        //log success in heroku
        console.log('Todo Deleted')
        //tell client its successful
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//telling server to start and take requests, and what port to listen to 
app.listen(process.env.PORT || PORT, ()=>{
    //log to heroku that the server is running. If running locally in dev environment, it will show up in console in vscode because computer is essentially server
    console.log(`Server running on port ${PORT}`)
})

//app.listen is a blocking function, event loop, anything after it won't run 