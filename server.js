const express = require('express')//making it possible to use express in this file
const app = express()//setting a variable and assigning it to the instance express
const MongoClient = require('mongodb').MongoClient//makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121//setting a constant to define the location where our server will be listening
require('dotenv').config()//allows us to look for variables inside of the .env file


let db, //declaring a variable db
    dbConnectionStr = process.env.DB_STRING,//declaring a variable and assigning it to our database connection string
    dbName = 'todo'//declaring a variable and assigning it to the name of the database we will access

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//creating a connection to MongoDB and passing in our connection string. and also passing in an additional property
    .then(client => { //waiting for connection and proceeding if successful, and passing in all the client informaion
        console.log(`Connected to ${dbName} Database`)//log to the console a template literal 'connected to todo Database'
        db = client.db(dbName)//assigning a value to previously declared db varaible that contains a db client factory method 
    })//closing our .then
    

    //middleware
app.set('view engine', 'ejs')//sets ejs as the default render method
app.use(express.static('public'))//sets the location for static assets ,gives access to public folder
app.use(express.urlencoded({ extended: true }))// tells express to decode and encode URLS where the header matches the content. supports arrays and objects
app.use(express.json())//parses JSON content from incoming request


app.get('/',async (request, response)=>{//starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray()//sets a variable and awaits all items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//sets a variable and awaits the number of items from the todos that is not completed to display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//rendering the EJS file and passing through the db items and the count remaining inside an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {//starts a POST method when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//inserts a new item (object with property thing and completed) into todos collection. thing has a value for the name of the input.
    .then(result => {//if insert is successful , do something
        console.log('Todo Added')//console log action
        response.redirect('/')//gets rid of the /addTodo route and redirects back to the root
    })//closing the .then
    .catch(error => console.error(error))//catching errors 
})//ending the POST

app.put('/markComplete', (request, response) => {//starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: true//set completed status to true
          }
    },{
        sort: {_id: -1},//moves item to the bottom of the list
        upsert: false//prevents insertion if item does not already exist
    })
    .then(result => {//starting a then if update was successful
        console.log('Marked Complete')//console log 'marked complete'
        response.json('Marked Complete')//sending a response back to the sender
    })//closing then
    .catch(error => console.error(error))//catching errors

})//ending PUT

app.put('/markUnComplete', (request, response) => {//starts a PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false//set completed status to false
          }
    },{
        sort: {_id: -1},//moves item to the bottom of the list
        upsert: false//prevents insertion if item does not already exist
    })
    .then(result => {//starting a then if update was successful
        console.log('Marked Complete')//console log 'marked complete'
        response.json('Marked Complete')//sending a response back to the sender
    })//closing then
    .catch(error => console.error(error))//catching errors

})//ending PUT

app.delete('/deleteItem', (request, response) => {//starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//look inside the todos collection for ONE item that has a matching name from our JS file
    .then(result => {//starts a then if delete was successful
        console.log('Todo Deleted')//log successful completion
        response.json('Todo Deleted')//sending a response back to the sender
    })//closing .then
    .catch(error => console.error(error))//catching errors

})//ending delete
app.listen(process.env.PORT || PORT, ()=>{//setting up which port we will be listening on - either the port from the .env file or PORT variable
    console.log(`Server running on port ${PORT}`)//logs 'Server running on port ${PORT}' to the console
})//ending the listen method
