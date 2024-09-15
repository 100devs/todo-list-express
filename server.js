const express = require('express')//settting a variable making it possible to use express in this file
const app = express()//setting a constant variable and asigning it to a instance of exress
const MongoClient = require('mongodb').MongoClient //setting a constant making it possible to use methods associated with MongoClient ans talking to uor DB
const PORT = 2121 //Setting a constant to determine the location where our server will be listening.
require('dotenv').config()// allows us to look for variables inside the .env file


let db,//declare a variable called db but not assign a value declaring it globally
    dbConnectionStr = process.env.DB_STRING, //Declaring a variable and assing our database connection strig to it.
    dbName = 'todo' //Declaring a variable and assingning the name of the database we will be using 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Creating a connection to MongoDB, and passing in our connection string. Also passing in an additional property.
    .then(client => { //Waitng for connection and proceeding if succesful, and passing in all the client infromation.
        console.log(`Connected to ${dbName} Database`) //log to the console a template literal "connectected to todo Database"
        db = client.db(dbName) //Assigning a value to previous declared db variable that contains a db foctory method
    }) //Closing our .then

 //middleware   
app.set('view engine', 'ejs') //Set EJS as the default render method
app.use(express.static('public')) //Set the location for static assets
app.use(express.urlencoded({ extended: true })) //Tells express to decode URL's where the header matches the content. Supports arrays and objects
app.use(express.json())//Parses JSON content from incoming request


app.get('/',async (request, response)=>{ //starts a GET method when the root rote is passed in, sets up req and res paremeters
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits All items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //Rendering the Ejs file and passing through the db items and the count remaining inside of an objectS
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {//Stars a POST method when the add route is passed in 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //Inserts a new item into todos collection, Gives it a completed value of false by default
    .then(result => { //If insert is successful, do something
        console.log('Todo Added') //Console log action
        response.redirect('/') //gets rid of the /addToDo route, and redirects back to the homepage
    })//closing the .then
    .catch(error => console.error(error))//Catching errors
})//ending the post

app.put('/markComplete', (request, response) => { //Starts a PUT method when the markComplete route is passed in.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //Look in the db for one item matching the name of the item passedin from the main.js file that was clicked on.
        $set: {
            completed: true //Set completed status to true
          }
    },{
        sort: {_id: -1}, //Moves item to the bottom of the List
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //Stars a then if update was succesful
        console.log('Marked Complete') //Console logging succesful comlpletion
        response.json('Marked Complete') //Sending a response back to sender
    }) //Closing .then
    .catch(error => console.error(error)) //Catching errors

}) //Ending PUT

app.put('/markUnComplete', (request, response) => { //Starting a PUT method when the markUnComplete is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //Look in the db for one item matching the name of the item passed in from the main.js file that was clicked on.
        $set: {
            completed: false //Set completed status to false
          }
    },{
        sort: {_id: -1}, //Moves item to the bottom of the List
        upsert: false //prevents insertion if item does not already exist
    })
    })
    .then(result => {  //Stars a then if update was succesful
        console.log('Marked Complete') //Console logging succesful comlpletion
        response.json('Marked Complete') //Sending a response back to sender
    })
    .catch(error => console.error(error)) //Catching errors


app.delete('/deleteItem', (request, response) => { //Starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})// look inside the todos collection forthe ONE item that has a matching name from our JS file
    .then(result => { //Starts a then if delete was succesful
        console.log('Todo Deleted') //loggin succesful completion
        response.json('Todo Deleted') //Sending a response back to sender
    }) //Closing then
    .catch(error => console.error(error)) //Catching errors

}) //Ending delete

app.listen(process.env.PORT || PORT, ()=>{ //setting up which port we will be listening on - either the port from the .env file or the port variable we set.
    console.log(`Server running on port ${PORT}`) //console log the running port.
}) // End the listen method.