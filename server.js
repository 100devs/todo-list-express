const express = require('express')// making it possible to use express in this file
const app = express()//setting a constant and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient//makes it possible to use methods associated with to talk to Mongodb 
const PORT = 2121//setting a constant determine the location where our server will be listening.
require('dotenv').config()//allows us to look for variables inside of the .env file


let db,//declaring a variable not assigne to anything
    dbConnectionStr = process.env.DB_STRING,//declaring a variable and assigning our db connection string to it.
    dbName = 'todo'//declaring a variable and assigning the name of the bd to be accessed 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//creating a connection to mongodb and passing inour connection string...also passing in a additional property
    .then(client => { //waiting for the connection and proceeding if succesful and passing in the client info
        console.log(`Connected to ${dbName} Database`) //log to the console a template literal
        db = client.db(dbName)//assigning a value to a previously declared db variable
    })//closing our then
    
    //MIDDLEWARE
app.set('view engine', 'ejs') //sets as the default render
app.use(express.static('public'))//sets the location for static asserts
app.use(express.urlencoded({ extended: true }))//tells express to decode and encode urls where the header matches the content,,,supports arrays and objects
app.use(express.json())//parses json content from incoming requests


app.get('/',async (request, response)=>{ //starts  GET method when the root route is passed in , sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray()//sets a variable and waits..all items from the todo collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//sets a var and waits a count of uncompleted items to later display in ejs
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering the ejs file and passing the db items and count the remaining inside of object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //starts a post method when the add route  is passed in 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//inserts a new item into todo collectionn, gives it a completed value of false by default
    .then(result => {//if insert is successful do something
        console.log('Todo Added')//console log action
        response.redirect('/') //get rid of the /addtodo route redirects the homepage
    })//closing the then
    .catch(error => console.error(error))//catcthing erors
})//end request

app.put('/markComplete', (request, response) => { //starts a put method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the db for one item matching the name of the itempassed in the mainjs file that was clicked on
        $set: {
            completed: true//set completed status to true
          }
    },{
        sort: {_id: -1},//moves item to bottom of list
        upsert: false //prevents insertion if item does not already exists
    })
    .then(result => {//starts a then if update was succsful
        console.log('Marked Complete')//logging succesful completion
        response.json('Marked Complete')//sending a response back to sender
    })//close then
    .catch(error => console.error(error))//catching errors

})//ending put

app.put('/markUnComplete', (request, response) => {//starting a put 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the db for one item matching the name of the itempassed in the mainjs file that was clicked on
        $set: {
            completed: false //set completed status to false
          }
    },{
        sort: {_id: -1},//moves item to bottom of list
        upsert: false//prevents insertion if item does not already exists
    })
    .then(result => {//starts a then if update was succsful
        console.log('Marked Complete')//logging succesful completion
        response.json('Marked Complete')//logging succesful completion
    })
    .catch(error => console.error(error))//catching errors

})//ends put

app.delete('/deleteItem', (request, response) => { //starts a delete method when delete route is passed in
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//look inside collection for the 1 item that has a matching name from our js file
    .then(result => {//starts a then if delete was success
        console.log('Todo Deleted')//log success 
        response.json('Todo Deleted')//send response back to sender
    })
    .catch(error => console.error(error))//catching errors

})//ending delete

app.listen(process.env.PORT || PORT, ()=>{//setting up whuch port  will be listening on..either on port from .env or the variable we se
    console.log(`Server running on port ${PORT}`)//console log the running port
})//end the listen method