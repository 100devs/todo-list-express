const express = require('express') //making it possible to use express in this file
const app = express() //setting aconstant and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient //makes it possible to use methods associated with MongoClient and talk to our DB mongodb = location where we store our data MongoClient (capitalized because it's a class)= allows us to talk to mongodb, so it performs operations
const PORT = 2121 // setting a constant to define the location where our server will be listening (it's all caps because it's a global constant)(BETTER: const PORT = process.env.PORT || PORT)
require('dotenv').config() // allows us to access variables inside of the .enf file


let db, //declare a variable called db but not assign a value (we declare it now globally, so we can use it later)
    dbConnectionStr = process.env.DB_STRING, // declaring a variable and assigning our database connection string to it (take it from .env file)
    dbName = 'todo' // declaring a variable and assigning the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })// creating a connection to MongoDB, and passing in our connection string. Also passing in an additional property
    .then(client => { // waiting for the connection and proceeding if successful, and passing in all the client information(the db connection is being setup asynchronously so as you're connecting to the db, the rest of the code can execute)
        console.log(`Connected to ${dbName} Database`) // log to the console a template literal "connected to todo Database"
        db = client.db(dbName)// assigning a value to previously declared db variable that contains a db client factory method (we get a bunch of information about the database client.db = a db client factory method)
    }) //closing our .then

    /*========================
        MIDDLEWARE (to process our requests, either adding things to or handling entirely requests as the go through the server, helps facilitate our connections to the database, set pipelines for an incoming http request, open communication channels for our requests(between client and database))
========================*/
app.set('view engine', 'ejs') // sets ejs as the default render method (allows yout to ditch the ejs extension when making response.render calls)
app.use(express.static('public')) // sets the location for static assets(css, html, img, main.js etc)
app.use(express.urlencoded({ extended: true }))//tells express to decode and encode URLs where the header matches the content. Supports arrays and objects.
app.use(express.json()) // parses JSON content from incoming requests (replaces bodyparser)


app.get('/', async (request, response) => { //starts at GET method when the root route is passed in, sets up req and res parameters ('/' =  the root route, triggered by refresh or visiting the page for the 1st time)
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits ALL items from the todos collection (go into todos collection .find()-built in mehtod get everything from it and put it into an array) 
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false })//sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // rendering the EJS file and passing through the db items and the count remaining inside of an object(grab items from database put it into an array etc and just send it back to ejs)

    //-----------THE SAME CODE BUT AS A CLASSIC PROMISE SYNTAX: 
    /*The only difference is error handling. The async await would crash the server if something went wrong while the promise would only log the error. There's no error handling in the first version of code.*/
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) //closing the GET

app.post('/addTodo', (request, response) => { // starts a POST method when the add route is passed in (it's triggered by the form and clicking the submit button)
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false })// inserts a new item into todos collection, gives it a completed value of false by default  (there's a request that's coming up from the client side it has a body and we want to get the todoItem from within that body (todoItem is assigned to the contents of the input text box in index.EJS). We set the completed to false and we can't leave it undefined because that would cause our count of incomplete tasks to be inaccurate)
        .then(result => { //if insert is successful, do something
            console.log('Todo Added')// console log action
            response.redirect('/') //gets rid of the /addTodo route, and redirects back to the homepage WE ALWAYS NEED TO GO BACK HOME
        }) //closing the .then
        .catch(error => console.error(error)) //catching errors
})//ending the POST

app.put('/markComplete', (request, response) => { // starts a PUT method when the markComplete route is passed in 
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, { //look in the database for one item matching the name of the item passed in from the main.js file that was clicked on (we grab the inner text from the list, package it up, send it to the server, server looks at its body, pulls the text out of it, drops that into an object and tries to match it in the database aka check if there's an object with a thing property that matches what was just passed - potential issue = duplicates. It'll always delte the firts item with the same name even if it wasn't completed. Use ID values not object properties.updateOne - built in method)
        $set: { // treated as on thing:
            completed: true // updating the items completed status to true
        }
    }, {
        sort: { _id: -1 }, // moves item to the bottom of the list (sorts items in descending order(latest first))
        upsert: false// prevents insertion if an item doesn't already exist(a mix of insert and update if the value doesn't exist it'would insert it for us then if we set it to true)
    })
        .then(result => { // start then if update was successful
            console.log('Marked Complete') //logging successful completion
            response.json('Marked Complete') //sending a response back to the sender(sending back some JSON & it's gonna contain words marked complete then it gets sent back to our function in main.js file and it gets put into a variable called data awaiting a response with some json, json gets converted to a string and data gets console logged. Getting a response back tells our main.js file that we've completed the request and we got a response.)
        })//closing our .then
        .catch(error => console.error(error))// catching errors

}) // ending PUT

app.put('/markUnComplete', (request, response) => {// starts a PUT method when the markUnComplete route is passed in 
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {//look in the database for one item matching the name of the item passed in from the main.js file that was clicked on 
        $set: { // treated as on thing:
            completed: false // updating the items completed status to false
        }
    }, {
        sort: { _id: -1 },// moves item to the bottom of the list (sorts items in descending order(latest first))
        upsert: false// prevents insertion if an item doesn't already exist
    })
        .then(result => {// starts then if update was successful
            console.log('Marked Complete')//logging successful completion
            response.json('Marked Complete')//sending a response back to the sender
        })//closing our .then
        .catch(error => console.error(error))// catching errors

})// ending PUT

app.delete('/deleteItem', (request, response) => {// starts a DELETE method when the deleteItem route is passed in 
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS })//look inside the todos collection for the ONE item that has a matching name from our JS file  (deleteOne - built in method)
        .then(result => {// starts then if delete was successful
            console.log('Todo Deleted')//logging successful completion
            response.json('Todo Deleted')//sending a response back to the sender
        })//closing our .then
        .catch(error => console.error(error))// catching errors

})//ending DELETE

app.listen(process.env.PORT || PORT, () => { //setting up which PORT we will be listening on - either gets the port from the .env file or variable we set at the top of this file
    console.log(`Server running on port ${PORT}`)// console.log the running port
})//closing .listen