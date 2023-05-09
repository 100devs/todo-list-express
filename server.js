const express = require('express') //Making it possible to use express in this file
const app = express() //setting a variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient //makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 //setting a variable to determine the port/location where our server will be listening
require('dotenv').config() //allows us to look for variables inside of the .env file


let db, //declaring a variable called db but do not assign a value --globally so we can use it in multiple places
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our database connection string to it
    dbName = 'todo' //declaring a variable - assigning name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })  //Creating a connection to MongoDB and passing in our connection string, Also passing in an additional property
    .then(client => { //waiting for the connection and proceeding if successful. Also passing in all the client information
        console.log(`Connected to ${dbName} Database`) //Log to the console a template literal  "Connected to todo Database"
        db = client.db(dbName) //assigning a value to the variable - declared above - contains a db client factory method
    }) //closing our .then
    
//middleware -helps us to facilitate our communication - tweek messages - pipeline - for our requests
app.set('view engine', 'ejs') // sets ejs as the default render
app.use(express.static('public')) // sets location for static assets
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLs where the header matches the content - extented supports arrays and objects - nested things
app.use(express.json()) // replaces bodyparser - built into express - parses JSON content from incoming requests


app.get('/',async (request, response)=>{  //starts a get method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //setting a variable and awaits ALL items form the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //setting a variable and awaits a number of how many items that have a completed false - uncompleted - to display later in ejs
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering the ejs and passing through the db items and count remaining inside of an object 
    // below is the classic promise version - with thens -
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // Starts a POST method when the add route is passed in -this time sent by the form in the ejs
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item into todos collection - thing is being passed in from todoItem which comes from the input box in ejs named "todoItem". Also setting completed to false to show it isn't completed, which will add it to the list without text changes and add to number count
    .then(result => { //classic promise syntax. - if insert is successful do something
        console.log('Todo Added') //console log the action
        response.redirect('/') //redirection to get url - refreshing - move back "home" after going to the todo url due to form
    }) //closing the .then
    .catch(error => console.error(error)) //catching the errors
}) //ending the POST

app.put('/markComplete', (request, response) => {  //staring a PUT method when the mark complete route is passed in. Req and res passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //It will update the thing - it is matching on the task name from the DB -item from JS is from main.js where it grabbed the span info (from the clicked span) and called it "itemFromJS". It looks for the first match and tries to see if it can update that.
        $set: {
            completed: true //set completed status to true
          }
    },{ 
        sort: {_id: -1}, //moves the item to the bottom of the list
        upsert: false //if set to true if it didn't exist it would insert it (insert/update mashup) - we don't want that now 
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //logging successful completion
        response.json('Marked Complete') //sending back json 'marked complete' to function in main.js
    }) //closing then
    .catch(error => console.error(error)) //catching errors

}) //ending put

app.put('/markUnComplete', (request, response) => { ////staring a PUT method when the mark uncomplete route is passed in. Req and res passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //It will update the thing - it is matching on the task name from the DB -item from JS is from main.js where it grabbed the span info (from the clicked span) and called it "itemFromJS". It looks for the first match and tries to see if it can update that.
        $set: {
            completed: false //set completed status to false
          }
    },{
        sort: {_id: -1}, //moves the item to the bottom of the list
        upsert: false //if set to true if it didn't exist it would insert it (insert/update mashup) - we don't want that now 
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //logging successful completion
        response.json('Marked Complete') //sending back json 'marked complete' to function in main.js
    }) //closing the then
    .catch(error => console.error(error)) //catching the errors

}) //ending put

app.delete('/deleteItem', (request, response) => { //starts a delete method when the delete route is passed, req & res parameters
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //using delete one method in our db collection - looking for the name from the span from ejs to main.js
    .then(result => { //starts a then if delete was successful
        console.log('Todo Deleted') //console log the results
        response.json('Todo Deleted') //sending response back to the sender
    }) //close then
    .catch(error => console.error(error)) //catch errors

}) //end delete

app.listen(process.env.PORT || PORT, ()=>{ //setting up which port we will be listening on - either .env file port or the one from the PORT variable 
    console.log(`Server running on port ${PORT}`) //console log the running port
}) //end the listen method