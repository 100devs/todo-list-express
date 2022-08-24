const express = require('express') //allows for use of express in this file.
const app = express()//set const assigned to instance of express.
const MongoClient = require('mongodb').MongoClient//allows methods associated with MongoClient and to talk to our DB.
const PORT = 2121//const to define PORT location.
require('dotenv').config()//allows us to look for variables inside of the .env file.


let db,//declare a variable called db without an assigned value.
    dbConnectionStr = process.env.DB_STRING,//declaring a variable and assigning our db connection string to it.
    dbName = 'todo'//declares variable dbName and assigns it the name of the db we will be using.

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//creating a connection to MongoDB and passing in our connection string. also passing in an additional property.
    .then(client => {//waiting for connection and then passing in client information if successful.
        console.log(`Connected to ${dbName} Database`)//console log template literal.
        db = client.db(dbName)//assigning a value to previously declared db variable that contains a db client factory method.
    })//closing our .then

//middleware
app.set('view engine', 'ejs')//sets ejs as the default render method.
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
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

app.post('/addTodo', (request, response) => {//starts a POST method when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//inserts a new item into the todos collection, gives it a completed value of false by default
    .then(result => {//if insert is successful do something
        console.log('Todo Added')//console log action
        response.redirect('/')//gets rid of the /addTodo route, and redirects back to the homepage
    })//closing the .then
    .catch(error => console.error(error))//catching errors
})//ending the POST

app.put('/markComplete', (request, response) => {//starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{// look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: true//set completed status to true
          }
    },{
        sort: {_id: -1},//moves the item to the bottom of the list
        upsert: false//prevents insertion if item does not already exist
    })
    .then(result => {//starts a then if update was successful
        console.log('Marked Complete')//logging successful completion
        response.json('Marked Complete')//sending a response back to the sender
    })//closing .then
    .catch(error => console.error(error))//catching errors

})//ending put

app.put('/markUnComplete', (request, response) => {//starts a PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false//set completed status to false
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

app.delete('/deleteItem', (request, response) => {//starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//look inside the todos collection for the one item that has a matching name from our JS file
    .then(result => {//starts a then if delete was successful
        console.log('Todo Deleted')//logging sucessful completion
        response.json('Todo Deleted')//sends a response back to the sender
    })
    .catch(error => console.error(error))//catching errors

})//ending delete

app.listen(process.env.PORT || PORT, ()=>{//setting up which port we will be listening on -- either the port from the .env file or the part variable we set
    console.log(`Server running on port ${PORT}`)//console log the running port
})//end the listen method