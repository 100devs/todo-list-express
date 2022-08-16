const express = require('express')//sets a const variable to bring express into server.js to use its methods
const app = express()// setting a const variable and ssigning it to the instance of express
const MongoClient = require('mongodb').MongoClient //decalring a const varibale that makes it possible to connect with our DB with Mongoclient methods
const PORT = 2121//declares a const variable for a port for our server to run on
require('dotenv').config()//allows us to look varibales stored in our .env file


let db,//declaring varibale as db but not assign a variable
    dbConnectionStr = process.env.DB_STRING,//declaring variable and assigning it to connectstring as process.end.DB_STRING which will access .env file
    dbName = 'todo'//giving dtatabase a name and setting that as variable

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//Alows to connect to database via our dbstring
    .then(client => {//returns promise if we have successfully connected, run the following code...
        console.log(`Connected to ${dbName} Database`)//logs 'connected ${what the previously declared database name is} to whdatabase, 
        db = client.db(dbName)//if connection is succesful set db to = client.db(dbName)
    })
    
app.set('view engine', 'ejs')//Tells view engine that we'll using ejs
app.use(express.static('public'))//middleware that serves static files to our express app (e.g. script, css and html etc)
app.use(express.urlencoded({ extended: true }))//middleware that tells express to decode and encode URLs where header matches content. Supports arrays and objects 
app.use(express.json())//middelware that helps us parse JSON content 


app.get('/',async (request, response)=>{//Creates a GET method which handles Read requests when route is passed in.
    const todoItems = await db.collection('todos').find().toArray()//sets a const variable that awaits existing items from todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//sets a const varibale and awaits the count of incompleted items 
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//renders index.ejs and passing through the todoItems and itemsLeft
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {//creates a POST method which handles POST request when route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//adds a new item into db with it's completed status set to false
    .then(result => {//returns promise if successfully added the todo to the database
        console.log('Todo Added')//if successful log "Todo Added" to console.
        response.redirect('/')//redirect to root route 
    })//close promise
    .catch(error => console.error(error))//catch block that will log error if there is one
})//close POST method

app.put('/markComplete', (request, response) => {//creates a PUT method which handles PUT request when route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//Goes into collection and finds the requested item was passed into input on main.js 
        $set: {
            completed: true//set completed status to true
          }
    },{
        sort: {_id: -1},//moves item to bottom of the list
        upsert: false//prevents insertion if item does not already exist
    })
    .then(result => {//start then if update was successful 
        console.log('Marked Complete')//logs 'Marke complete' to console
        response.json('Marked Complete')//sending response back to sender
    })
    .catch(error => console.error(error))//creates catch in case of error, if there's an error log erro to console

})

app.put('/markUnComplete', (request, response) => {//creates a PUT method which handles PUT request and when route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//Goes into collecion and find rquested item that was passed in 
        $set: {
            completed: false//set completed status to false
          }
    },{
        sort: {_id: -1},//moves item to bottom of list
        upsert: false//prevents insertion if item does not already exist
    })
    .then(result => {//start then if update was successful
        console.log('Marked Complete')//logs "marked complete" to console
        response.json('Marked Complete')//sends response back to sender
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => {//creates a DELETE method which handles PUT request when route is passed in
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//Look for item in the database that matches the name of the item selected and delete
    .then(result => {//returns promise if item is successfully found to do the following:
        console.log('Todo Deleted')//log 'Todo Deleted' to the console
        response.json('Todo Deleted')//respond json 'Todo Deleted'
    })//close promise
    .catch(error => console.error(error))//if item not found return and log error to console

})

app.listen(process.env.PORT || PORT, ()=>{ // creates a LISTEN method which creates a PORT for our server to connect to
    console.log(`Server running on port ${PORT}`)//longs the PORT that the server is running on if a succesful connection is madee
})//close listen 