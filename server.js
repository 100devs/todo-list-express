//Require Express
const express = require('express')
//Saving the express call to the 'app' variable
const app = express()
//Require MongoDB
const MongoClient = require('mongodb').MongoClient
//Declaring port variable
const PORT = 2121
//Requiring dotenv
require('dotenv').config()

//Delcaring an empty 'db' variable,
let db,
    dbConnectionStr = process.env.DB_STRING,//a connection string variable that gets the string from .env or heroku's variables
    dbName = 'todo'// Decalring the name of the database o the 'dbName' varible

//Conection to the database/server
    MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)//Console logging connection sucess faliure
        db = client.db(dbName)//Assigning a value to previuosly declared db varible contains that contains a db client factory method
    })
    //Middlewares
app.set('view engine', 'ejs')// Setting up EJS as the default render method 
app.use(express.static('public'))//Setting up the public folder-- sets the location for static assets
app.use(express.urlencoded({ extended: true }))//Tells expres to decode and encode URL's automaticaly -- where headers match content 
app.use(express.json())//Tells express to use json-- fromincoming request

//Responding to a get request to the '/' route
app.get('/',async (request, response)=>{// starts a GET method when the root route is passed in, sets up req and res parameters
    //Getting to-do items from the database
    const todoItems = await db.collection('todos').find().toArray()
    //Getting items with a completed value of 'false'
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//sets a variable and awaits a count of uncompleted
    //SEnding over the variables toDoItems in itsmeleft to ejs
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//rendering the EJS file and passing thought the db items and the count rremaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})
//Responding to a post request to the /'addTodo' route 
app.post('/addTodo', (request, response) => {
    //Inserting a new todos item into the list
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//insets a nre item into todos collection, gives it a completed value of false by default
    .then(result => {
        console.log('Todo Added')//Console logging todo added
        response.redirect('/')//gets rid of the /addTodo
    })
    .catch(error => console.error(error))//Console log if errors
})
//Responing to an update request to mark an item complete-sorting: newest or oldest
app.put('/markComplete', (request, response) => {
    //Going into database, collection 'todos', and finding a document that ,matches request.body..itemsFromJs
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//Look in the database for one item mathcing the na,e of the item passed in the main.js file that was clicked on
        $set: {
            completed: true//updating the items completed status to true
          }
    },{
        sort: {_id: -1},//Sorting in desending order/reverse sort
        upsert: false// IF the document doesn't exist don't create one
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))//error catch

})
//Responsing to an update request to mark an item uncomplete
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts a then if update was sucessfull
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})
//Resposning to a delete request/item from the list
app.delete('/deleteItem', (request, response) => {
    //Going into the database and deleteing the item that matches requestbody
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//look inside the todos collection for the ONE item that has a matching na,e form our JS file
    .then(result => {//starts a then if delete was successful completion
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})
//Setting the server to listen to prot or Horuki
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})