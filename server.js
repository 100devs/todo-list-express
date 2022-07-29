const express = require('express') //a function that allows us to use express
const app = express() //assigning the express function from line 1 into the variable app for ease of use
const MongoClient = require('mongodb').MongoClient //allows us to use methods associated with MongoClient and talk to our DB
const PORT = 2121 //assigns the location where our server will be listening to a variable PORT
require('dotenv').config() //allows us to look for variables inside of the .env file


let db, //declaring a variable called db but not assigning a value
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our database connection string to it
    dbName = 'todo' //declaring and assigning 'todo' to the variable dbName. This is the name of the database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //we are connecting to our mongo database. Passing in our
//connection string and an additional property
    .then(client => { //invoking a then method with a client parameter. 
        console.log(`Connected to ${dbName} Database`) //Once we have connected to our database, console log that string
        db = client.db(dbName) //global variable db is assigned the value of the dbname
    }) //closing our .then
    
app.set('view engine', 'ejs') //sets ejs as the default render method
app.use(express.static('public')) //it tells the code where to search for static assets. In the public folder
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode the URLs where the header matches the content
app.use(express.json()) //parses JSON content


app.get('/',async (request, response)=>{ //starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits all items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable and awaits a count of uncompleted
    //items to later dispaly in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering the EJS file and passing through the db items and the
    //count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
     .catch(error => console.error(error)) //console logging an error
})

app.post('/addTodo', (request, response) => {//starts a POST method when the addToDo route is passed in, sets up req and res parameters
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item into the todos collection
    //and gives it a completed value of false by default
    .then(result => { //if insert is successful, 
        console.log('Todo Added') //console log that the todo was added
        response.redirect('/') //refresh the page to the root route
    })
    .catch(error => console.error(error)) //console logging an error
}) //closing our post method

app.put('/markComplete', (request, response) => { //starts a PUT method when the markComplete route is passed in, 
    //sets up req and res parameters
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //this updates an item to complete
        $set: { //this is an object 
            completed: true //this changes the completed status to true
          } //closing our object
    },{ //closing our updateOne function and making another object
        sort: {_id: -1}, //this subtracts 1 from our tracker
        upsert: false 
    }) //closing our new object
    .then(result => { //if markcompleted is successful
        console.log('Marked Complete') //console log marked complete
        response.json('Marked Complete') //send the response back as a json 
    }) //closing the then method
    .catch(error => console.error(error)) //console logging an error

}) //closing our put method

app.put('/markUnComplete', (request, response) => { //starts a PUT method when the markComplete route is passed in, 
    //sets up req and res parameters
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //this updates an item to not complete
        $set: { //this is an object 
            completed: false  //this changes the completed status to false
          } //closing our object
    },{ //closing our markUncomplete function and making another object
        sort: {_id: -1}, //this subtracts 1 from our tracker
        upsert: false
    }) //clsing our new object
    .then(result => { //if markuncompleted is successful
        console.log('Marked Complete') //console log marked complete
        response.json('Marked Complete') //send the response back as a json
    }) //closing then method
    .catch(error => console.error(error)) //console log an error

}) //closing put method

app.delete('/deleteItem', (request, response) => { //starts a DELETE method when the deleteItem route is passed in, 
    //sets up req and res parameters
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //this deletes an item from the database
    .then(result => { //if deleteOne is successful
        console.log('Todo Deleted') //console log todo deleted
        response.json('Todo Deleted') //send the response back as a json
    }) //close then method
    .catch(error => console.error(error)) //console log an error

}) //close the delete method

app.listen(process.env.PORT || PORT, ()=>{ //sets up which port we will be listening on, either the port from .env or the variable
    console.log(`Server running on port ${PORT}`) //console logs which port the server is running on
}) //closing listen method