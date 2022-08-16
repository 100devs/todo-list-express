const express = require('express') //making it possible to use express in this file
const app = express() //setting a variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient //makes it possible to use methods with MongoClient and talk yo our DB
const PORT = 2121 //setting a constant to determine the location where our server will be listening
require('dotenv').config()//allows us to look for variables inside of the .env file


let db,//declare a varibale called db but not assign a value
    dbConnectionStr = process.env.DB_STRING,//declaring a variable and assigning our database connection string to it
    dbName = 'todo'//declaring a variable and assigning our database name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })// Creating a connection to MongoDB, and passing in out connection. Also passing in an additional property
    .then(client => {
        console.log(`Connected to ${dbName} Database`) //consoles the ph
        db = client.db(dbName)//the database name
    })
 //middleware   
app.set('view engine', 'ejs') //set view engine to ejs tells express we're using a EJS as template engine
app.use(express.static('public'))//tells express to look in the public folder for stylesheets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json())//Parses JSON content from incoming requests


app.get('/',async (request, response)=>{//starts a GET method when the roor route passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //sets variable and awaits all items on the todo collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//sets variable and awaits a count of uncompleted itams to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//rendering the EJS file and passing through the db items and the count remaining inside of an object 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //starts a POST method when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//inserts a new item itno todos collection, gives a completed value of false by default
    .then(result => {//if insert is sucessful, do something
        console.log('Todo Added')//console log action
        response.redirect('/')//gets rid of the /addToo route, and redirects back to the homepage
    })
    .catch(error => console.error(error))//catching errors
})//ending the POST

app.put('/markComplete', (request, response) => { //starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the db for one item matching the name of item passed in from the main.js that was clicked on
        $set: {
            completed: true //set completed status to true
          }
    },{
        sort: {_id: -1},//moves item to the bottom of the list
        upsert: false//prevents insertion if item does not already exist
    })
    .then(result => {//starts a then if update was sucessful
        console.log('Marked Complete')//logging successful completion
        response.json('Marked Complete')//sending a response back to the sender
    })//closing .then
    .catch(error => console.error(error))//catching errors

})

app.put('/markUnComplete', (request, response) => {//
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the db for one item matching the name of item passed in from the main.js file that was clicked on
        $set: {
            completed: false//set completed status to false
          }
    },{
        sort: {_id: -1},//moves item to the bottom of the list
        upsert: false//prevents insertion if item does not already exist
    })
    .then(result => {//starts a then if update was sucessful
        console.log('Marked Complete')//logging successful completion
        response.json('Marked Complete')//sending a response back to the sender
    })//closing .then
    .catch(error => console.error(error))//catching errors

})

app.delete('/deleteItem', (request, response) => {//starts a delete mothod when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//look inside the todos collection for the ONE item that has a matching name from JS file
    .then(result => {//starts a then if delete was sucessful
        console.log('Todo Deleted')//logging sucessful completion
        response.json('Todo Deleted')//sending a response back to the sender
    })//closing .then
    .catch(error => console.error(error))// catching errors

})//ending delete

app.listen(process.env.PORT || PORT, ()=>{ //specifying which port well be listening on - either from the port from the .env file or the port variable we set
    console.log(`Server running on port ${PORT}`)//console.log the running port
})//end the listen method