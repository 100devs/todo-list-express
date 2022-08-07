const express = require('express')  // making it possible to use express in this file
const app = express() //setting a constant and assigning to the instance of express.  
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121  // setting a variable to determine the location where the server will be listening.
require('dotenv').config() //it allows us to look for variables inside the .env file

let db, // declaring variable called db but not assigning a value
    dbConnectionStr = process.env.DB_STRING, // declaring a variable and assigning our database connection string to it.  
    dbName = 'todo' //declaring a variable and assigning the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })// creating a connection to MongoDB, and passing in our connection string.  Also passing in useUnifiedTopology helps ensure that things are returned in a clean manner
    .then(client => { // waiting for the connection and proceeding if successful, and passing in all client information
        console.log(`Connected to ${dbName} Database`) //log to the console a template literal "conneccted to todo Database"
        db = client.db(dbName) //assigning a value to previously declared global variable that contains a db client factory method
    })//closing the .then
// BELOW ARE MIDDLEWARE which help faciliate communication(request and respose)   
app.set('view engine', 'ejs') // setting ejs as the default render method
app.use(express.static('public')) //setting the location for static assets
app.use(express.urlencoded({ extended: true })) // call to middleware that cleans up how things are displayed and how our server communicates with our client(similar to useUnifiedTopology above).  The express.urlencoded() function is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is based on body-parser. Also tells express to decode and encode URLS where the header matches the content. Supports arrays and objects
app.use(express.json()) // tells the app to use express's json method to take the object and turn it into a JSON. Parses JSON content from incoming requests


// ROUTES / METHOD
app.get('/',async (request, response)=>{ // starts a GET method when the root route is passed in, sets up request and response using an asynchronous function 
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits ALL itmes from the todos collection, if the database doesnt exists it can create the collection // create a variable to capture an array of our documents in our colletion 'todos' db called
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//sets a variable and awaits a count of uncompleted items to later display in EJS // the countDocuments() method counts the number of documents that matches to the selection criteria. It returns a numeric value.  It looks like we're counting the incomplete todos (where completed:false) and assigning that number to itemsLeft. "Youre going and counting how many to-do list items havent been completed yet -- what is left on the agenda"
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering the EJS file and passing through the db items and the count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    .catch(error => console.error(error))//if an error occurs, pass the error into the catch and console log that error
})//ending the get

app.post('/addTodo', (request, response) => { //starts a POST method when the addToDo route is passed in, triggering the request and response paramenters
    db.collection('todos') .insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item into todos collection, gives it a complete value of false by default
    .then(result => { //if insert is successful, execute something
        console.log('Todo Added')//console log action
        response.redirect('/')//gets rid of the /addToDo route and redirects back to the homepage
    })//closing the .then
    .catch(error => console.error(error))//catching the errors
})//ending the POST

app.put('/markComplete', (request, response) => { // UPDATE.starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the database for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: true //set completed status to true
        }
    },{
        sort: {_id: -1}, //moves item to the bottom of list // once a thing has been marked as completed, this sorts the array by descending order by id. 
        upsert: false //prevents insertion if item does not already exist.// if upsert set to true, and our query didnt return matching documents, our upsert would create it.  Being false, it doesnt create it.  
    })
    .then(result => { //starts the then if update was successful
        console.log('Marked Complete') //logging succesful completion
        response.json('Marked Complete') //sending a response back to the sender //response.json is what is going back to our fetch in main.js
    })//closing .then
    .catch(error => console.error(error)) // if something broke, an error is logged to the console. 

})//ending the PUT

app.put('/markUnComplete', (request, response) => { // UPDATE.starts a PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the database for one item matching the name of the item passed in from the main.js file that waas clicked on.
        $set: {
            completed: false // setting completed status to false
        }
    },{
        sort: {_id: -1}, //moves item to the bottom of list
        upsert: false  //prevents insertion if item does not already exist
    })
    .then(result => { //starts the then if update was successful
        console.log('Marked Complete') // console log as mark complete
        response.json('Marked Complete') // returns response of marked complete to the fetch in main.js //sending a response back to the sender //response.json is what is going back to our fetch in main.js
    })//closing the then
    .catch(error => console.error(error)) //if something broke, an error is logged to the console.

})//ending the PUT

app.delete('/deleteItem', (request, response) => { //starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // look inside the todos collection for the ONE item that has the matching name from our JS file
    .then(result => {  //starts a then if delete was successful
        console.log('Todo Deleted') // console log todo deleted. 
        response.json('Todo Deleted') //sending response to sender// returns response of TODO DELETED to the fetch main.js
    })//closing .then
    .catch(error => console.error(error)) // if something broke, an error is logged to the console. 

})//ending the delete

app.listen(process.env.PORT || PORT, ()=>{ //setting up which port we will be listening on - either the port from the .env file or the port variable we set globally // tells our server to listen for a connection on the port or the port we define as a const earlier.  process.env.port will tell the server to listen whatever server were hosting it at aka heroku.  
    console.log(`Server running on port ${PORT}`) //console.log the running port
})//end the listen