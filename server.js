const express = require('express') // set express and import express to be used, making it possible to use express in this file
const app = express()   //set a constant and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient  //require mongodb used as the database, makes it possible to use methods associated with mongoclient and talk to our DB
const PORT = 2121   //create the local port to access the server application, setting a constant tat defines the lcoation wheren our server will listen
require('dotenv').config()  //require the dotenv file to keep private variables and strings, allows us to put .env in thte file



//SET OUR VARIABLE
let db, //initialize the database variable  called db but don't assign a value
    dbConnectionStr = process.env.DB_STRING,    //initialize the databse connection string to the string stored in dotenv file, assign our database connection string to it
    dbName = 'todo'     // declaring a variabl and assigning the name of the database we will be using to "todo"


//SET OUR DATABASE CONNECTION 
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })  //set how we connect to the mongodb with the client, it creates a connection to mongoDB adn passiing our connection string, the additional property  unified topology is a formating helper to make things look good
    .then(client => {   //after we connect to the databse we wait for the connection to be successful and passingin all the client information 
        console.log(`Connected to ${dbName} Database`) //then console log the template literal message successully connected to the database collection set
        db = client.db(dbName) //assigning a value to previously declared db variable to the db client factory method
    }) //closing our .then
 
//SET OUR MIDDLEWARE, the helps facilitate our communications 
app.set('view engine', 'ejs')   //set ejs as the default render method
app.use(express.static('public'))   //set express static to be as the location for static assets, used to help with routing our file, if you need css, client side js thsi is where they will be
app.use(express.urlencoded({ extended: true })) // use urlencode to parses incoming requests with urlencoded payloads and is based on body-parser., don't need to use that anymore. it basically tells express to decode and encode URLS where the header matches the content. Supports arrays and objects
app.use(express.json()) //use this to parse application/json files, which parses JSON content from incoming requests


//SET OUR CRUD METHODS
app.get('/',async (request, response)=>{    //starts the GET method when the root toure is passed in it setus up req and res params, set the root path  for get request to trigger the action when the root is accessed
    const todoItems = await db.collection('todos').find().toArray() //set the const variable "todoItems"  and awaits all the items in the todos collection places them in an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})  //sets a variable and awaits the count of unompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //render the index.ejs file with the contents of the 2 variabled we set. It passes the db items and the count remaining inside of an object

    //***********was commented out  doing the same thing as what is up in the await but using a classic promise syntax of then catch*/
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})// close out app.get

app.post('/addTodo', (request, response) => {   //starts ta POST method when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts a new item into todos collection, gives it a completed value of false by default
    .then(result => {//if isert is successful do something
        console.log('Todo Added') //console log action 
        response.redirect('/') // redirect the action from the form /addTodo router and redirect back to the root  or the homepage
    }) //closing the .then
    .catch(error => console.error(error)) //catch errors
}) //ending the POST

app.put('/markComplete', (request, response) => { //starts a PUT method when the markCpmplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from the main.js file that was click on
        $set: {
            completed: true //set completed status to true 
          }
    },{
        sort: {_id: -1}, //moves item to bottom of list 
        upsert: false //prevents insertion if item does not already exist 
    })
    .then(result => { //start at then if update was successful
        console.log('Marked Complete') //logging successful completion 
        response.json('Marked Complete') //sending a response back to the sender
    }) //closing .then
    .catch(error => console.error(error))  //catching errors 

}) //ending put

app.put('/markUnComplete', (request, response) => { //starts a PUT method when the markUnCOmplet route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matchnig then name of the itme passed in from the main.js file that was clicked on 
        $set: {
            completed: false //set completed status to false
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts a then if update was succesful 
        console.log('Marked Complete') //logging successful completion 
        response.json('Marked Complete') //sending a response back to the sender
    }) //closing .then
    .catch(error => console.error(error)) //catchnig errors

}) //ending put 

app.delete('/deleteItem', (request, response) => { //starts a delete method when the delete route is passed 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //look inseide the todos collection for the one item that has a matchnig name from our JS file
    .then(result => { //starts a then if delete was successful 
        console.log('Todo Deleted') //logging successful completion
        response.json('Todo Deleted') //sending a reasponse back to the sender
    }) //closing .then 
    .catch(error => console.error(error)) //catching errors

}) //ending delete

app.listen(process.env.PORT || PORT, ()=>{ //setting up which port we will be listening on 
    console.log(`Server running on port ${PORT}`) //console.log the running port
}) //end the listen method